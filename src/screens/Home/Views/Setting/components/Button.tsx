import { memo } from 'react'

import Button, { type BtnProps } from '@/components/common/Button'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

type ButtonProps = BtnProps

/**
 * 锤子风描边按钮：白底 + 4dp 圆角 + 0.5px 浅灰边 + #4d4d4d 文字。
 * 对应锤子的 shape_btn_edit_selector。
 */
export default memo(({ disabled, onPress, children }: ButtonProps) => {
  return (
    <Button
      style={disabled ? [styles.button, styles.buttonDisabled] : styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      <Text size={14} color={disabled ? '#b0b0b0' : '#4d4d4d'} style={styles.text}>{children}</Text>
    </Button>
  )
})

const styles = createStyle({
  button: {
    height: 30,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccdcdbdb',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  buttonDisabled: {
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
  },
  text: {
    fontWeight: 'bold',
  },
})
