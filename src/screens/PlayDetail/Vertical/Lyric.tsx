import { memo, useMemo, useEffect, useRef, useCallback } from 'react'
import { View, FlatList, Image as RNImage, StyleSheet, type FlatListProps, type LayoutChangeEvent, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import { type Line, useLrcPlay, useLrcSet } from '@/plugins/lyric'
import { createStyle } from '@/utils/tools'
import { useSettingValue } from '@/store/setting/hook'
import playerState from '@/store/player/state'
import { scrollTo } from '@/utils/scroll'
import { useWindowSize } from '@/utils/hooks'
import Text from '@/components/common/Text'
import PlayLine, { type PlayLineType } from '../components/PlayLine'
import { SmartisanImages } from '@/resources/smartisan'

type FlatListType = FlatListProps<Line>

// 锤子 LyricsView 实测常量（LyricsView.java）
// 当前行 ColorUtil.lyricsSelecte = argb(255, 50, 90, 177)、16sp（dimen/bigLyrics）
// 其它行 @color/aboutSign = #FF5B5B5B、14sp（dimen/smallLyrics）
// 行占位 = 行高 + line_height(40dp)/2 = 20dp
const LRC_ACTIVE_COLOR = '#325AB1'
const LRC_NORMAL_COLOR = '#5B5B5B'
const LRC_ACTIVE_SIZE = 16
const LRC_NORMAL_SIZE = 14
const LRC_LINE_GAP = 20
// 上下遮罩各 70dp（iv_lyrics_top_mask / iv_lyrics_bottom_mask）
const MASK_HEIGHT = 70
// 页面底色 pageBg = #FBF8F8
const PAGE_BG = '#FBF8F8'
// 锤子 play_activity.xml：iv_lyrics_bg 是 0dp×0dp 且四边约束到 rotate_rl（宽高比 1:1 的正方形），
// ImageView 默认 scaleType=fitCenter，720×713 的位图按宽度铺满正方形。
// 实测：位图宽 = 屏宽时，渲染出的圆盘（含模糊边缘）占屏宽 0.852；
// 锤子官方截图上同一张图的圆盘占屏宽 0.804 → 位图渲染宽 = 0.804 / 0.852 ≈ 0.944 屏宽
const BG_SIZE_RATIO = 0.944

// 用多段半透明叠层模拟「pageBg → 透明」的线性渐变，避免引入渐变库
const EdgeMask = memo(({ position }: { position: 'top' | 'bottom' }) => {
  const steps = useMemo(() => {
    const layers: { h: number, color: string }[] = []
    const count = 10
    for (let i = 0; i < count; i++) {
      const alpha = 1 - i / (count - 1) * 0.92
      layers.push({
        h: MASK_HEIGHT / count,
        color: `rgba(251, 248, 248, ${alpha.toFixed(3)})`,
      })
    }
    return position == 'top' ? layers : layers.slice().reverse()
  }, [position])

  return (
    <View pointerEvents="none" style={{ ...styles.mask, [position]: 0 }}>
      {steps.map((layer, index) => (
        <View key={index} style={{ height: layer.h, backgroundColor: layer.color }} />
      ))}
    </View>
  )
})

interface LineProps {
  line: Line
  lineNum: number
  activeLine: number
  onLayout: (lineNum: number, height: number, width: number) => void
}
const LrcLine = memo(({ line, lineNum, activeLine, onLayout }: LineProps) => {
  const textAlign = useSettingValue('playDetail.style.align')
  const active = activeLine == lineNum

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    onLayout(lineNum, nativeEvent.layout.height, nativeEvent.layout.width)
  }

  // textBreakStrategy="simple" 用于解决某些设备上字体被截断的问题
  return (
    <View style={styles.line} onLayout={handleLayout}>
      <Text
        style={{ ...styles.lineText, textAlign }}
        textBreakStrategy="simple"
        color={active ? LRC_ACTIVE_COLOR : LRC_NORMAL_COLOR}
        size={active ? LRC_ACTIVE_SIZE : LRC_NORMAL_SIZE}
      >{line.text}</Text>
      {
        line.extendedLyrics.map((lrc, index) => {
          return (
            <Text
              style={{ ...styles.lineTranslationText, textAlign }}
              textBreakStrategy="simple"
              key={index}
              color={LRC_NORMAL_COLOR}
              size={LRC_NORMAL_SIZE - 2}
            >{lrc}</Text>
          )
        })
      }
    </View>
  )
}, (prevProps, nextProps) => {
  return prevProps.line === nextProps.line &&
    prevProps.activeLine != prevProps.lineNum &&
    nextProps.activeLine != nextProps.lineNum
})
const wait = async() => new Promise(resolve => setTimeout(resolve, 100))

export default () => {
  const lyricLines = useLrcSet()
  const { line } = useLrcPlay()
  const flatListRef = useRef<FlatList>(null)
  const playLineRef = useRef<PlayLineType>(null)
  const isPauseScrollRef = useRef(true)
  const scrollTimoutRef = useRef<NodeJS.Timeout | null>(null)
  const delayScrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const lineRef = useRef({ line: 0, prevLine: 0 })
  const isFirstSetLrc = useRef(true)
  const scrollInfoRef = useRef<NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'] | null>(null)
  const listLayoutInfoRef = useRef<{ spaceHeight: number, lineHeights: number[] }>({ spaceHeight: 0, lineHeights: [] })
  const scrollCancelRef = useRef<(() => void) | null>(null)
  const isShowLyricProgressSetting = useSettingValue('playDetail.isShowLyricProgressSetting')
  const { width: winWidth } = useWindowSize()
  const bgSize = useMemo(() => Math.round(winWidth * BG_SIZE_RATIO), [winWidth])

  const handleScrollToActive = (index = lineRef.current.line) => {
    if (index < 0) return
    if (flatListRef.current) {
      if (scrollInfoRef.current && lineRef.current.line - lineRef.current.prevLine == 1) {
        let offset = listLayoutInfoRef.current.spaceHeight
        for (let lineIdx = 0; lineIdx < index; lineIdx++) {
          offset += listLayoutInfoRef.current.lineHeights[lineIdx]
        }
        offset += (listLayoutInfoRef.current.lineHeights[index] ?? 0) / 2
        try {
          scrollCancelRef.current = scrollTo(flatListRef.current, scrollInfoRef.current, offset - scrollInfoRef.current.layoutMeasurement.height * 0.42, 600, () => {
            scrollCancelRef.current = null
          })
        } catch {}
      } else {
        if (scrollCancelRef.current) {
          scrollCancelRef.current()
          scrollCancelRef.current = null
        }
        try {
          flatListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.42,
          })
        } catch {}
      }
    }
  }

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollInfoRef.current = nativeEvent
    if (isPauseScrollRef.current) {
      playLineRef.current?.updateScrollInfo(nativeEvent)
    }
  }
  const handleScrollBeginDrag = () => {
    isPauseScrollRef.current = true
    playLineRef.current?.setVisible(true)
    if (delayScrollTimeout.current) {
      clearTimeout(delayScrollTimeout.current)
      delayScrollTimeout.current = null
    }
    if (scrollTimoutRef.current) {
      clearTimeout(scrollTimoutRef.current)
      scrollTimoutRef.current = null
    }
    if (scrollCancelRef.current) {
      scrollCancelRef.current()
      scrollCancelRef.current = null
    }
  }

  const onScrollEndDrag = () => {
    if (!isPauseScrollRef.current) return
    if (scrollTimoutRef.current) clearTimeout(scrollTimoutRef.current)
    scrollTimoutRef.current = setTimeout(() => {
      playLineRef.current?.setVisible(false)
      scrollTimoutRef.current = null
      isPauseScrollRef.current = false
      if (!playerState.isPlay) return
      handleScrollToActive()
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (delayScrollTimeout.current) {
        clearTimeout(delayScrollTimeout.current)
        delayScrollTimeout.current = null
      }
      if (scrollTimoutRef.current) {
        clearTimeout(scrollTimoutRef.current)
        scrollTimoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    listLayoutInfoRef.current.lineHeights = []
    lineRef.current.prevLine = 0
    lineRef.current.line = 0
    if (!flatListRef.current) return
    flatListRef.current.scrollToOffset({
      offset: 0,
      animated: false,
    })
    if (!lyricLines.length) return
    playLineRef.current?.updateLyricLines(lyricLines)
    requestAnimationFrame(() => {
      if (isFirstSetLrc.current) {
        isFirstSetLrc.current = false
        setTimeout(() => {
          isPauseScrollRef.current = false
          handleScrollToActive()
        }, 100)
      } else {
        if (delayScrollTimeout.current) clearTimeout(delayScrollTimeout.current)
        delayScrollTimeout.current = setTimeout(() => {
          handleScrollToActive(0)
        }, 100)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lyricLines])

  useEffect(() => {
    if (line < 0) return
    lineRef.current.prevLine = lineRef.current.line
    lineRef.current.line = line
    if (!flatListRef.current || isPauseScrollRef.current) return

    if (line - lineRef.current.prevLine != 1) {
      handleScrollToActive()
      return
    }

    delayScrollTimeout.current = setTimeout(() => {
      delayScrollTimeout.current = null
      handleScrollToActive()
    }, 600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line])

  useEffect(() => {
    requestAnimationFrame(() => {
      playLineRef.current?.updateLayoutInfo(listLayoutInfoRef.current)
      playLineRef.current?.updateLyricLines(lyricLines)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowLyricProgressSetting])

  const handleScrollToIndexFailed: FlatListType['onScrollToIndexFailed'] = (info) => {
    void wait().then(() => {
      handleScrollToActive(info.index)
    })
  }

  const handleLineLayout = useCallback<LineProps['onLayout']>((lineNum, height) => {
    listLayoutInfoRef.current.lineHeights[lineNum] = height
    playLineRef.current?.updateLayoutInfo(listLayoutInfoRef.current)
  }, [])

  const handleSpaceLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    listLayoutInfoRef.current.spaceHeight = nativeEvent.layout.height
    playLineRef.current?.updateLayoutInfo(listLayoutInfoRef.current)
  }, [])

  const handlePlayLine = useCallback((time: number) => {
    playLineRef.current?.setVisible(false)
    global.app_event.setProgress(time)
  }, [])

  const renderItem: FlatListType['renderItem'] = ({ item, index }) => {
    return (
      <LrcLine line={item} lineNum={index} activeLine={line} onLayout={handleLineLayout} />
    )
  }
  const getkey: FlatListType['keyExtractor'] = (item, index) => `${index}${item.text}`

  const spaceComponent = useMemo(() => (
    <View style={styles.space} onLayout={handleSpaceLayout}></View>
  ), [handleSpaceLayout])

  return (
    <View style={styles.root}>
      {/* 锤子歌词页：静态遮罩位图居中铺底（mask_playing_lyric.png 本身是圆盘，非运行时模糊） */}
      <View pointerEvents="none" style={styles.bgWrap}>
        <RNImage source={SmartisanImages.playingLyricMask} style={{ width: bgSize, height: bgSize }} resizeMode="contain" />
      </View>
      <FlatList
        data={lyricLines}
        renderItem={renderItem}
        keyExtractor={getkey}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={spaceComponent}
        ListFooterComponent={spaceComponent}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        initialNumToRender={Math.max(line + 10, 10)}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onScroll={handleScroll}
      />
      <EdgeMask position="top" />
      <EdgeMask position="bottom" />
      { isShowLyricProgressSetting ? <PlayLine ref={playLineRef} onPlayLine={handlePlayLine} /> : null }
    </View>
  )
}

const styles = createStyle({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  bgWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    // 歌词左右 margin 4dp（lyrics_view 的 layout_marginStart/End）
    paddingLeft: 16,
    paddingRight: 16,
  },
  space: {
    paddingTop: '100%',
  },
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: MASK_HEIGHT,
    zIndex: 2,
  },
  line: {
    paddingTop: LRC_LINE_GAP / 2,
    paddingBottom: LRC_LINE_GAP / 2,
  },
  lineText: {
    textAlign: 'center',
  },
  lineTranslationText: {
    textAlign: 'center',
    paddingTop: 4,
  },
})
