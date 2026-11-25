import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'

export default memo(() => {
  const t = useI18n()
  const addMusicLocationType = useSettingValue('list.addMusicLocationType')

  const options = useMemo(() => {
    return [
      { id: 'top', label: t('setting_list_add_music_location_type_top') },
      { id: 'bottom', label: t('setting_list_add_music_location_type_bottom') },
    ]
  }, [t])

  return (
    <SubTitle title={t('setting_list_add_music_location_type')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={addMusicLocationType}
          onChange={id => { updateSetting({ 'list.addMusicLocationType': id as LX.AddMusicLocationType }) }}
        />
      </View>
    </SubTitle>
  )
})
