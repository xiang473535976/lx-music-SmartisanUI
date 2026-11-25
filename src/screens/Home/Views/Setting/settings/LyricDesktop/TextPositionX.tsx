import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { setDesktopLyricTextPosition } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'

type X_TYPE = LX.AppSetting['desktopLyric.textPosition.x']

const X_LIST = [
  'left',
  'center',
  'right',
] as const

export default memo(() => {
  const t = useI18n()
  const x = useSettingValue('desktopLyric.textPosition.x')

  const options = useMemo(() => {
    return X_LIST.map(id => ({ id, label: t(`setting_lyric_desktop_text_x_${id}`) }))
  }, [t])

  const setPosition = (id: string) => {
    void setDesktopLyricTextPosition(id as X_TYPE, null).then(() => {
      updateSetting({ 'desktopLyric.textPosition.x': id as X_TYPE })
    })
  }

  return (
    <SubTitle title={t('setting_lyric_desktop_text_x')}>
      <View>
        <ChoiceBar options={options} activeId={x} onChange={setPosition} />
      </View>
    </SubTitle>
  )
})
