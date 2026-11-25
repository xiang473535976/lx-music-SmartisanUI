import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { View, PanResponder, StyleSheet } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import { setVolume } from '@/plugins/player'
import { createStyle } from '@/utils/tools'

// 锤子 play_activity.xml L408-422：sb_volume 高 32dp、四周 margin 18/20/18/50dp，
// 底色 shape_about_card（圆角 4dp / 0.5px #d0d0d2 描边），thumb 是 playing_control_volume。
// 真机截图（ref_sm_play.png）实测（density 2.75，1dp = 2.75px）：
// 卡片 y2229–2316（高 88px = 32dp）、左右 x50–1029（margin 18dp）；卡底 (237,237,237)。
// thumb 是几乎撑满卡高的白色竖长胶囊：x67–122（56px = 20.4dp 宽）、y2232–2315（84px = 30.5dp 高），
// 内芯浅灰 #F2F2F2 x82–107（26px = 9.5dp 宽）、y2245–2302（58px = 21dp 高），圆角约 4dp。
// 注意：thumb 的 top 是相对 layer（高 TRACK_HEIGHT）而不是相对卡片，所以要用负偏移把它拉回卡片中心。
const BAR_HEIGHT = 32
const TRACK_HEIGHT = 4
const TRACK_RADIUS = 2
// 注意：锤子 colors.xml 里的 @color/seekBarN = #ccdcdbdb 是 Android 的 #AARRGGBB（alpha=0xcc），
// 而 React Native 的 8 位 hex 是 #RRGGBBAA，直接照抄会让 R/G/B 全错位（实测渲染成偏绿的 (208,222,221)）。
// 换算后应为 #dcdbdbcc：叠在卡底 #EDEDED 上得到 (223,222,222)，与锤子真机截图完全一致。
const TRACK_COLOR = '#dcdbdbcc'
const PLAYED_COLOR = '#8e8e8f'
const THUMB_WIDTH = 20
const THUMB_HEIGHT = 30
const THUMB_CORE_WIDTH = 9.5
const THUMB_CORE_HEIGHT = 21
const THUMB_RADIUS = 4
const CARD_COLOR = '#EDEDED'

export default memo(() => {
  const volume = useSettingValue('player.volume')
  const [dragVolume, setDragVolume] = useState<number | null>(null)
  const widthRef = useRef(0)
  const [barWidth, setBarWidth] = useState(0)

  const shown = dragVolume ?? volume

  const setByX = useCallback((x: number) => {
    if (!widthRef.current) return
    const v = Math.max(0, Math.min(1, x / widthRef.current))
    setDragVolume(v)
    void setVolume(v)
  }, [])

  const commit = useCallback((v: number | null) => {
    setDragVolume(null)
    if (v == null) return
    updateSetting({ 'player.volume': v })
  }, [])

  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: e => { setByX(e.nativeEvent.locationX) },
    onPanResponderMove: e => { setByX(e.nativeEvent.locationX) },
    onPanResponderRelease: e => { commit(Math.max(0, Math.min(1, e.nativeEvent.locationX / (widthRef.current || 1)))) },
    onPanResponderTerminate: () => { commit(null) },
  }), [commit, setByX])

  return (
    <View
      style={styles.container}
      onLayout={e => {
        widthRef.current = e.nativeEvent.layout.width
        setBarWidth(e.nativeEvent.layout.width)
      }}
      {...pan.panHandlers}
    >
      <View style={styles.layer}>
        <View style={[styles.track, { backgroundColor: TRACK_COLOR }]} />
        <View style={[styles.track, { width: `${shown * 100}%`, backgroundColor: PLAYED_COLOR }]} />
        <View style={[styles.thumb, { left: Math.max(1, Math.min(barWidth - THUMB_WIDTH - 1, barWidth * shown - THUMB_WIDTH / 2)) }]}>
          <View style={styles.thumbCore} />
        </View>
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    height: BAR_HEIGHT,
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d0d0d2',
    backgroundColor: CARD_COLOR,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  layer: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_RADIUS,
  },
  track: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    borderRadius: TRACK_RADIUS,
  },
  thumb: {
    position: 'absolute',
    top: (TRACK_HEIGHT - THUMB_HEIGHT) / 2,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: THUMB_RADIUS,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbCore: {
    width: THUMB_CORE_WIDTH,
    height: THUMB_CORE_HEIGHT,
    borderRadius: 2,
    backgroundColor: '#f2f2f2',
  },
})
