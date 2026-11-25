import { memo } from 'react'

import { StyleSheet, View } from 'react-native'
import Text from '@/components/common/Text'
import ButtonPrimary from '@/components/common/ButtonPrimary'
import { useI18n } from '@/lang'

const HAMMER_TEXT = '#4d4d4d'


export interface ParseNameProps {
  fileName: string
  onNameChanged: (text: string) => void
  onSingerChanged: (text: string) => void
}

const parsePath = (fileName: string) => {
  return fileName.substring(0, fileName.lastIndexOf('.')).split('-').map(name => name.trim())
}

export default memo(({ fileName, onNameChanged, onSingerChanged }: ParseNameProps) => {
  const t = useI18n()
  const handleParseNameSinger = () => {
    const [name, singer] = parsePath(fileName)
    onNameChanged(name)
    if (singer) onSingerChanged(singer)
  }
  const handleParseSingerName = () => {
    const [singer, name] = parsePath(fileName)
    onSingerChanged(singer)
    if (name) onNameChanged(name)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label} size={13} color={HAMMER_TEXT}>{t('metadata_edit_modal_form_parse_name')}</Text>
      <View style={styles.btns}>
        <ButtonPrimary onPress={handleParseNameSinger}>
          <Text color={HAMMER_TEXT} size={13}>{t('metadata_edit_modal_form_parse_name_singer')}</Text>
        </ButtonPrimary>
        <ButtonPrimary onPress={handleParseSingerName}>
          <Text color={HAMMER_TEXT} size={13}>{t('metadata_edit_modal_form_parse_singer_name')}</Text>
        </ButtonPrimary>
      </View>
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
  btns: {
    flexDirection: 'row',
  },
})
