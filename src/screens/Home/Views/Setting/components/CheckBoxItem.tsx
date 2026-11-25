import { memo, useCallback } from 'react'

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { createStyle, tipDialog } from '@/utils/tools'
import type { CheckBoxProps } from '@/components/common/CheckBox'
import { SmartisanImages } from '@/resources/smartisan'


/**
 * 锤子风设置行：整行可点，左侧文案（可带帮助图标），右侧勾选/未选。
 * 行高 56dp，白底 + 发丝分隔线，与锤子音乐的列表行一致。
 */
export default memo(({ check, label, children, onChange, helpTitle, helpDesc, disabled = false }: CheckBoxProps) => {
  const handlePress = useCallback(() => {
    if (disabled) return
    onChange?.(!check)
  }, [disabled, onChange, check])

  const handleShowHelp = useCallback(() => {
    void tipDialog({
      title: helpTitle ?? '',
      message: helpDesc,
      btnText: global.i18n.t('understand'),
    })
  }, [helpTitle, helpDesc])

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={disabled ? 1 : 0.6}
      onPress={handlePress}
    >
      <View style={styles.labelWrap}>
        {label ? <Text size={15} color={disabled ? '#b0b0b0' : '#4d4d4d'}>{label}</Text> : children}
        {
          (helpTitle ?? helpDesc)
            ? (
                <TouchableOpacity style={styles.helpBtn} onPress={handleShowHelp}>
                  <Icon size={15} name="help" color="#b0b0b0" />
                </TouchableOpacity>
              )
            : null
        }
      </View>
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
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ededed',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 10,
  },
  helpBtn: {
    marginLeft: 6,
    padding: 3,
  },
  checkbox: {
    width: 22,
    height: 22,
  },
  checkboxDisabled: {
    opacity: 0.4,
  },
})
