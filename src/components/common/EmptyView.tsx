import { memo } from 'react'
import { View } from 'react-native'

import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

const HAMMER_SUB = '#939396'
const HAMMER_ICON = '#d8d8d8'

export interface EmptyViewProps {
  /** 提示文案 */
  text: string
  /** 上方图标（icoMoon 名），传 null 表示只显示文字 */
  icon?: string | null
  /** 图标尺寸 */
  iconSize?: number
  /** 顶部留白，默认 92dp；传 0 表示完全居中 */
  paddingTop?: number
}

/**
 * 全站统一的空列表占位。
 *
 * 锤子风格的列表空态是「居中一行灰字」，为了不显突兀，
 * 这里额外在文字上方放一个更浅的灰色图标作为视觉锚点。
 */
export default memo(({ text, icon = 'music_time', iconSize = 46, paddingTop = 92 }: EmptyViewProps) => {
  return (
    <View style={[styles.container, { paddingTop }]}>
      {
        icon
          ? <Icon name={icon} size={iconSize} color={HAMMER_ICON} />
          : null
      }
      <Text size={13} color={HAMMER_SUB} style={styles.text}>{text}</Text>
    </View>
  )
})

const styles = createStyle({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 14,
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: 'center',
  },
})
