import { memo } from 'react'

import { StyleSheet, View } from 'react-native'
import type { InputProps } from '@/components/common/Input'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_LINE = '#ccdcdbdb'

export interface InputItemProps extends InputProps {
  value: string
  label: string
  onChanged: (text: string) => void
}

export default memo(({ value, label, onChanged, ...props }: InputItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label} size={13} color={HAMMER_TEXT}>{label}</Text>
      <Input
        value={value}
        onChangeText={onChanged}
        style={{ ...styles.input, backgroundColor: '#ffffff' }}
        {...props}
       />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    height: 32,
    paddingLeft: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
})
