import { memo } from 'react'
import { Image, TouchableOpacity } from 'react-native'

import Text from './Text'
import { SmartisanImages } from '@/resources/smartisan'
import { createStyle } from '@/utils/tools'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_DISABLED = '#b0b0b0'

export interface CheckRowProps {
  check: boolean
  label: string
  onChange: (check: boolean) => void
  disabled?: boolean
  /** 文字字号，默认 15，列表内嵌时可用 13 */
  textSize?: number
}

/**
 * 锤子风勾选行：整行可点，左侧文字，右侧方框（选中红勾）
 */
export default memo(({ check, label, onChange, disabled = false, textSize = 15 }: CheckRowProps) => {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={disabled ? 1 : 0.6}
      onPress={() => {
        if (disabled) return
        onChange(!check)
      }}
    >
      <Text
        size={textSize}
        color={disabled ? HAMMER_DISABLED : HAMMER_TEXT}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Image
        source={check ? SmartisanImages.checkboxOn : SmartisanImages.checkboxOff}
        style={[styles.checkbox, disabled && !check ? styles.checkboxDisabled : null]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})

const styles = createStyle({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    width: '100%',
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
  },
  checkboxDisabled: {
    opacity: 0.4,
  },
})
