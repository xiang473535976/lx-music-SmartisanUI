import { useMemo } from 'react'

import { View } from 'react-native'
import Text from '@/components/common/Text'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import styles from './style'
import ChoiceBar from '@/screens/Home/Views/Setting/components/ChoiceBar'

type Align_Type = LX.AppSetting['playDetail.style.align']

const ALIGN_LIST = [
  'left',
  'center',
  'right',
] as const

export default () => {
  const t = useI18n()
  const align = useSettingValue('playDetail.style.align')
  const options = useMemo(() => {
    return ALIGN_LIST.map(id => ({ id, label: t(`play_detail_setting_lrc_align_${id}`) }))
  }, [t])

  const setPosition = (id: string) => {
    updateSetting({ 'playDetail.style.align': id as Align_Type })
  }

  return (
    <View style={styles.container}>
      <Text size={13} color={'#4d4d4d'} style={styles.title}>{t('play_detail_setting_lrc_align')}</Text>
      <ChoiceBar options={options} activeId={align} onChange={setPosition} />
    </View>
  )
}
