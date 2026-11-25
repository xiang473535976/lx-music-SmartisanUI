import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import type { I18n } from '@/lang'
import { useI18n, langList } from '@/lang'
import { setLanguage } from '@/core/common'
import { useSettingValue } from '@/store/setting/hook'

export default memo(() => {
  const t = useI18n()
  const langId = useSettingValue('common.langId')

  const options = useMemo(() => {
    return langList.map(({ locale, name }) => ({ id: locale as string, label: name }))
  }, [])

  return (
    <SubTitle title={t('setting_basic_lang')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={langId as string}
          onChange={id => { setLanguage(id as I18n['locale']) }}
        />
      </View>
    </SubTitle>
  )
})
