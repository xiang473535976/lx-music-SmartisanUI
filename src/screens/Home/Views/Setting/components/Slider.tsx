import { memo } from 'react'

import HammerSlider, { type SliderProps } from '@/components/common/HammerSlider'

export type {
  SliderProps,
}

/**
 * 设置项滑杆。
 * 原实现用 @react-native-community/slider（系统 SeekBar），thumb 太小、轨道太细，
 * 在设置页里几乎看不清。改用与播放页顶部进度条完全一致的自绘样式。
 * 外层 SubTitle 已有 14dp 内边距，所以关掉进度带自带的左右留白。
 */
export default memo(({ value, minimumValue, maximumValue, onSlidingStart, onSlidingComplete, onValueChange, step }: SliderProps) => {
  return (
    <HammerSlider
      value={value}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      onSlidingStart={onSlidingStart}
      onSlidingComplete={onSlidingComplete}
      onValueChange={onValueChange}
      step={step}
      padded={false}
    />
  )
})
