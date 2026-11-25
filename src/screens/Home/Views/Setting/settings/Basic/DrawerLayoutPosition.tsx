import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'

export default memo(() => {
  const t = useI18n()
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')

  const options = useMemo(() => {
    return [
      {
        id: 'left',
        label: t('setting_basic_drawer_layout_position_left'),
      },
      {
        id: 'right',
        label: t('setting_basic_drawer_layout_position_right'),
      },
    ]
  }, [t])

  return (
    <SubTitle title={t('setting_basic_drawer_layout_position')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={drawerLayoutPosition}
          onChange={id => { updateSetting({ 'common.drawerLayoutPosition': id as LX.AppSetting['common.drawerLayoutPosition'] }) }}
        />
      </View>
    </SubTitle>
  )
})
