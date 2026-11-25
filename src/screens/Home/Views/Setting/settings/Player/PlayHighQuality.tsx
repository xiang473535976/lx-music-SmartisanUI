import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { TRY_QUALITYS_LIST } from '@/core/music/utils'

export default memo(() => {
  const t = useI18n()
  const playQuality = useSettingValue('player.playQuality')

  const options = useMemo(() => {
    const list = [...TRY_QUALITYS_LIST, '128k'].reverse() as LX.Quality[]
    return list.map(q => ({ id: q, label: q }))
  }, [])

  return (
    <SubTitle title={t('setting_play_play_quality')}>
      <View>
        <ChoiceBar
          options={options}
          activeId={playQuality}
          onChange={id => { updateSetting({ 'player.playQuality': id as LX.Quality }) }}
        />
      </View>
    </SubTitle>
  )
})
