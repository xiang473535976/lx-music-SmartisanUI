import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { setDesktopLyricTextPosition } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'

type Y_TYPE = LX.AppSetting['desktopLyric.textPosition.y']

const Y_LIST = [
  'top',
  'center',
  'bottom',
] as const

export default memo(() => {
  const t = useI18n()
  const y = useSettingValue('desktopLyric.textPosition.y')

  const options = useMemo(() => {
    return Y_LIST.map(id => ({ id, label: t(`setting_lyric_desktop_text_y_${id}`) }))
  }, [t])

  const setPosition = (id: string) => {
    void setDesktopLyricTextPosition(null, id as Y_TYPE).then(() => {
      updateSetting({ 'desktopLyric.textPosition.y': id as Y_TYPE })
    })
  }

  return (
    <SubTitle title={t('setting_lyric_desktop_text_y')}>
      <View>
        <ChoiceBar options={options} activeId={y} onChange={setPosition} />
      </View>
    </SubTitle>
  )
})
