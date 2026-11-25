import { memo } from 'react'

import HammerSlider, { type SliderProps } from '@/components/common/HammerSlider'

export type {
  SliderProps,
}

/**
 * 播放详情页设置弹层里的滑杆（音量 / 播放速率 / 歌词字号）。
 * 统一使用与播放页顶部进度条一致的自绘样式。
 */
export default memo(({ value, minimumValue, maximumValue, onSlidingStart, onSlidingComplete, onValueChange, step }: SliderProps) => {
  // 原组件对 value 小于 minimumValue 的场景做过一次修正，这里保留该行为
  const handleValueChange = (value: number) => {
    if (onValueChange && minimumValue != null) onValueChange(Math.max(value, minimumValue))
  }

  return (
    <HammerSlider
      value={value}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      onSlidingStart={onSlidingStart}
      onSlidingComplete={onSlidingComplete}
      onValueChange={handleValueChange}
      step={step}
    />
  )
})
