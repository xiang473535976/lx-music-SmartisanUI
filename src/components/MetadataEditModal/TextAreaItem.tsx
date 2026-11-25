import { memo, useCallback } from 'react'

import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { InputProps } from '@/components/common/Input'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_LINE = '#ccdcdbdb'

export interface TextAreaItemProps extends InputProps {
  value: string
  label: string
  onOnlineMatch?: () => void
  onChanged?: (text: string) => void
}

export default memo(({ value, label, onOnlineMatch, onChanged, style, ...props }: TextAreaItemProps) => {
  const handleRemove = useCallback(() => {
    onChanged?.('')
  }, [onChanged])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label} size={13} color={HAMMER_TEXT}>{label}</Text>
        {
          onChanged ? (
            <View style={styles.btns}>
              <TouchableOpacity onPress={handleRemove} activeOpacity={0.6}>
                <Text size={13} color={HAMMER_TEXT}>{global.i18n.t('metadata_edit_modal_form_remove_lyric')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onOnlineMatch} activeOpacity={0.6}>
                <Text size={13} color={'#E64040'}>{global.i18n.t('metadata_edit_modal_form_match_lyric')}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      </View>
      <Input
        value={value}
        onChangeText={onChanged}
        scrollEnabled={false}
        textAlignVertical='top'
        multiline
        style={StyleSheet.compose({ ...styles.textarea, backgroundColor: '#ffffff' }, style)}
        {...props}
       />
    </View>
  )
})

const styles = createStyle({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  btns: {
    flexDirection: 'row',
    gap: 15,
  },
  textarea: {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 6,
    paddingBottom: 6,
    height: 'auto',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
})
