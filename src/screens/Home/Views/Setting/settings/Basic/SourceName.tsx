import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'

type SourceNameType = LX.AppSetting['common.sourceNameType']

export default memo(() => {
  const t = useI18n()
  const sourceNameType = useSettingValue('common.sourceNameType')

  const options = useMemo(() => {
    return [
      {
        id: 'real',
        label: t('setting_basic_sourcename_real'),
      },
      {
        id: 'alias',
        label: t('setting_basic_sourcename_alias'),
      },
    ]
  }, [t])

  return (
    <SubTitle title={t('setting_basic_sourcename')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={sourceNameType}
          onChange={id => { updateSetting({ 'common.sourceNameType': id as SourceNameType }) }}
        />
      </View>
    </SubTitle>
  )
})
