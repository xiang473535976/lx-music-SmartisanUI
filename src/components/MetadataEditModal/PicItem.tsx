import { memo, useCallback, useRef } from 'react'

import { TouchableOpacity, View } from 'react-native'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import Image from '@/components/common/Image'
import FileSelect, { type FileSelectType } from '@/components/common/FileSelect'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_RED = '#E64040'
const HAMMER_LINE = '#ededed'

export interface PicItemProps {
  value: string
  label: string
  onOnlineMatch: () => void
  onChanged: (text: string) => void
}

export default memo(({ value, label, onOnlineMatch, onChanged }: PicItemProps) => {
  const fileSelectRef = useRef<FileSelectType>(null)
  const handleRemoveFile = useCallback(() => {
    onChanged('')
  }, [onChanged])
  const handleShowSelectFile = useCallback(() => {
    fileSelectRef.current?.show({
      title: global.i18n.t('metadata_edit_modal_form_select_pic_title'),
      dirOnly: false,
      filter: ['jpg', 'jpeg', 'png'],
    }, (path) => {
      onChanged(path)
    })
  }, [onChanged])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label} size={13} color={HAMMER_TEXT}>{label}</Text>
        <View style={styles.btns}>
          <TouchableOpacity onPress={handleRemoveFile} activeOpacity={0.6}>
            <Text size={13} color={HAMMER_TEXT}>{global.i18n.t('metadata_edit_modal_form_remove_pic')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOnlineMatch} activeOpacity={0.6}>
            <Text size={13} color={HAMMER_RED}>{global.i18n.t('metadata_edit_modal_form_match_pic')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowSelectFile} activeOpacity={0.6}>
            <Text size={13} color={HAMMER_RED}>{global.i18n.t('metadata_edit_modal_form_select_pic')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.picContent}>
        <Image
          url={value}
          cache={false}
          style={{ ...styles.pic, borderColor: HAMMER_LINE }}
        />
      </View>
      <FileSelect ref={fileSelectRef} />
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
  picContent: {
    marginTop: 5,
    position: 'relative',
  },
  pic: {
    width: 140,
    height: 140,
    borderRadius: 4,
    borderWidth: 0.5,
    borderStyle: 'solid',
  },
})
