import { memo, useRef, useState } from 'react'
import { PanResponder, View } from 'react-native'

import { createStyle } from '@/utils/tools'

export interface SliderProps {
  value: number
  minimumValue: number
  maximumValue: number
  onSlidingStart?: (value: number) => void
  onSlidingComplete?: (value: number) => void
  onValueChange?: (value: number) => void
  step?: number
  // 播放页的进度带两侧留 12/10dp；设置页外层已有 14dp 内边距，这里关掉避免双重留白
  padded?: boolean
}

// 轨道规格沿用播放页顶部进度条（PlayDetail/Vertical/Player/components/PlayInfo.tsx）：
// 6dp 圆角轨道 #DFDEDE + 已播放段 #8E8E8F。
// 但设置页是白底，所以不画播放页那条 27dp 的 #EDEDED 底带，thumb 也从白色改成
// 看得清的中性灰 #A0A0A0（白 thumb 在白底上只剩描边，等于看不见）。
const ROW_HEIGHT = 27
const BAR_HEIGHT = 6
const BAR_RADIUS = 3
const TRACK_COLOR = '#DFDEDE'
const PLAYED_COLOR = '#8E8E8F'
const DOT_COLOR = '#A0A0A0'
const DOT_WIDTH = 9
const DOT_HEIGHT = 15

const clamp = (value: number) => {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export default memo((props: SliderProps) => {
  const { value, minimumValue, maximumValue, padded = true } = props
  const [draging, setDraging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)

  // PanResponder 只创建一次，所有取值都走 ref，避免闭包捕获到旧的 props
  const propsRef = useRef(props)
  propsRef.current = props
  const widthRef = useRef(0)
  const dragRef = useRef({ draging: false, startX: 0, startProgress: 0, dragProgress: 0 })

  const progressToValue = (progress: number) => {
    const { minimumValue, maximumValue, step } = propsRef.current
    let result = minimumValue + clamp(progress) * (maximumValue - minimumValue)
    // step 以 minimumValue 为基准取整（与原 SeekBar 行为一致）
    if (step != null && step > 0) result = minimumValue + Math.round((result - minimumValue) / step) * step
    if (result < minimumValue) return minimumValue
    if (result > maximumValue) return maximumValue
    return result
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        const progress = clamp(evt.nativeEvent.locationX / (widthRef.current || 1))
        dragRef.current = { draging: true, startX: 0, startProgress: progress, dragProgress: progress }
        setDragProgress(progress)
        setDraging(true)
        propsRef.current.onSlidingStart?.(progressToValue(progress))
        propsRef.current.onValueChange?.(progressToValue(progress))
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!dragRef.current.draging) return
        const progress = clamp(dragRef.current.startProgress + (gestureState.dx - dragRef.current.startX) / (widthRef.current || 1))
        dragRef.current.dragProgress = progress
        setDragProgress(progress)
        propsRef.current.onValueChange?.(progressToValue(progress))
      },
      onPanResponderRelease: () => {
        if (dragRef.current.draging) {
          dragRef.current.draging = false
          propsRef.current.onSlidingComplete?.(progressToValue(dragRef.current.dragProgress))
        }
        setDraging(false)
      },
      onPanResponderTerminate: () => {
        if (dragRef.current.draging) {
          dragRef.current.draging = false
          propsRef.current.onSlidingComplete?.(progressToValue(dragRef.current.dragProgress))
        }
        setDraging(false)
      },
    }),
  ).current

  const range = maximumValue - minimumValue
  const shownProgress = draging ? dragProgress : (range > 0 ? clamp((value - minimumValue) / range) : 0)

  return (
    <View style={[styles.container, padded ? null : styles.containerFlush]}>
      <View
        style={styles.barWrap}
        onLayout={(e) => { widthRef.current = e.nativeEvent.layout.width }}
      >
        <View style={styles.bar}>
          <View style={[styles.layer, styles.track]} />
          <View style={[styles.layer, styles.played, { width: `${shownProgress * 100}%` }]}>
            <View style={styles.dot} />
          </View>
        </View>
        <View style={styles.pressBar} {...panResponder.panHandlers} />
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    height: ROW_HEIGHT,
    paddingLeft: 12,
    paddingRight: 10,
    justifyContent: 'center',
  },
  containerFlush: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  barWrap: {
    width: '100%',
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
  track: {
    width: '100%',
    backgroundColor: TRACK_COLOR,
  },
  played: {
    backgroundColor: PLAYED_COLOR,
  },
  dot: {
    position: 'absolute',
    right: -DOT_WIDTH / 2,
    top: (BAR_HEIGHT - DOT_HEIGHT) / 2,
    width: DOT_WIDTH,
    height: DOT_HEIGHT,
    borderRadius: DOT_WIDTH / 2,
    backgroundColor: DOT_COLOR,
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
