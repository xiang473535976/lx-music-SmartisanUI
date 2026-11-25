import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { View, PanResponder, StyleSheet } from 'react-native'

import { useProgress } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { useBufferProgress } from '@/plugins/player'
import { useDrag } from '@/utils/hooks/useDrag'

// 数值全部按锤子真机截图（ref_sm_play.png，1080×2400）逐像素反算：
// 进度带 y254–326（高 74px ≈ 27dp），底色 #EDEDED，上下各一条 0.5px #D0D0D2 描边；
// 轨道 y282–298（高 17px ≈ 6dp），色 #DFDEDE，两端圆角；
// thumb 是白色椭圆 25×41px（≈9×15dp），左侧时间 x31–137、右侧时间 x929–1053，字形高 29px（= 14sp，Android TextView 默认值）。
const ROW_HEIGHT = 27
// 锤子 start_time/end_time 是 40dp，但那是 Android TextView 的固定宽度、文字不会换行；
// RN 的 Text 在 40dp 宽里放 14sp 的 "00:00" 会折成两行，所以放宽到 46dp 并加 numberOfLines={1}。
const TIME_WIDTH = 46
const BAR_HEIGHT = 6
const BAR_RADIUS = 3
const TRACK_COLOR = '#DFDEDE'
const BUFFER_COLOR = '#FFFFFF'
const PLAYED_COLOR = '#8E8E8F'
const DOT_COLOR = '#FFFFFF'
const TIME_COLOR = '#5B5B5B'
const DOT_WIDTH = 9
const DOT_HEIGHT = 15
const BAND_COLOR = '#EDEDED'
const BAND_BORDER = '#D0D0D2'

const PressBar = ({ onDragState, setDragProgress, onSetProgress }: {
  onDragState: (drag: boolean) => void
  setDragProgress: (progress: number) => void
  onSetProgress: (progress: number) => void
}) => {
  const { onLayout, onDragStart, onDragEnd, onDrag } = useDrag(onSetProgress, onDragState, setDragProgress)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt, gestureState) => {
        onDrag(gestureState.dx)
      },
      onPanResponderGrant: (evt, gestureState) => {
        onDragStart(gestureState.dx, evt.nativeEvent.locationX)
      },
      onPanResponderRelease: () => {
        onDragEnd()
      },
    }),
  ).current

  return <View onLayout={onLayout} style={styles.pressBar} {...panResponder.panHandlers} />
}

export default () => {
  const { maxPlayTimeStr, nowPlayTimeStr, progress, maxPlayTime } = useProgress()
  const buffered = useBufferProgress()
  const [draging, setDraging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)

  const durationRef = useRef(maxPlayTime)
  durationRef.current = maxPlayTime
  const onSetProgress = useCallback((value: number) => {
    global.app_event.setProgress(value * durationRef.current)
  }, [])

  const shownProgress = draging ? dragProgress : progress
  const dotStyle = useMemo(() => ({
    position: 'absolute' as const,
    right: -DOT_WIDTH / 2,
    top: (BAR_HEIGHT - DOT_HEIGHT) / 2,
    width: DOT_WIDTH,
    height: DOT_HEIGHT,
    borderRadius: DOT_WIDTH / 2,
    backgroundColor: DOT_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.10)',
  }), [])

  return (
    <View style={styles.container}>
      <Text style={styles.time} size={14} color={TIME_COLOR} numberOfLines={1}>{nowPlayTimeStr}</Text>
      <View style={styles.barWrap}>
        <View style={styles.bar}>
          <View style={[styles.layer, { width: '100%', backgroundColor: TRACK_COLOR }]} />
          <View style={[styles.layer, { width: `${Math.max(0, Math.min(1, shownProgress)) * 100}%`, backgroundColor: PLAYED_COLOR }]}>
            <View style={dotStyle} />
          </View>
        </View>
        <PressBar onDragState={setDraging} setDragProgress={setDragProgress} onSetProgress={onSetProgress} />
      </View>
      <Text style={styles.time} size={14} color={TIME_COLOR} numberOfLines={1}>{maxPlayTimeStr}</Text>
    </View>
  )
}

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: BAND_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BAND_BORDER,
  },
  time: {
    width: TIME_WIDTH,
    textAlign: 'center',
  },
  barWrap: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 6,
    marginRight: 6,
    height: ROW_HEIGHT,
    justifyContent: 'center',
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    overflow: 'visible',
  },
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
  },
  pressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: ROW_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0)',
  },
})
