import { memo } from 'react'

import Button, { type BtnProps } from '@/components/common/Button'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

export interface ButtonProps extends BtnProps {
  size?: number
}

// 锤子风描边按钮（shape_btn_edit_selector：白底 + 0.5dp 灰边 + 4dp 圆角）
export default memo(({ disabled, size = 13, onPress, children }: ButtonProps) => {
  return (
    <Button style={disabled ? { ...styles.button, ...styles.buttonDisabled } : styles.button} onPress={onPress} disabled={disabled}>
      <Text size={size} color={disabled ? '#b0b0b0' : '#4d4d4d'} style={styles.text}>{children}</Text>
    </Button>
  )
})

const styles = createStyle({
  button: {
    height: 30,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccdcdbdb',
    backgroundColor: '#ffffff',
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
