import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'

type ShareType = LX.AppSetting['common.shareType']

export default memo(() => {
  const t = useI18n()
  const shareType = useSettingValue('common.shareType')

  const options = useMemo(() => {
    return [
      {
        id: 'system',
        label: t('setting_basic_share_type_system'),
      },
      {
        id: 'clipboard',
        label: t('setting_basic_share_type_clipboard'),
      },
    ]
  }, [t])

  return (
    <SubTitle title={t('setting_basic_share_type')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={shareType}
          onChange={id => { updateSetting({ 'common.shareType': id as ShareType }) }}
        />
      </View>
    </SubTitle>
  )
})
