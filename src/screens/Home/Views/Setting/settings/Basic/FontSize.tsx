import { memo, useMemo } from 'react'

import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import ChoiceBar from '../../components/ChoiceBar'
import { useI18n } from '@/lang'
import { setFontSize } from '@/core/common'
import { useFontSize } from '@/store/common/hook'
import Text from '@/components/common/Text'
import { getTextSize } from '@/utils/pixelRatio'
import { createStyle } from '@/utils/tools'

const LIST = [
  {
    size: 0.8,
    name: 'setting_basic_font_size_80',
  },
  {
    size: 0.9,
    name: 'setting_basic_font_size_90',
  },
  {
    size: 1,
    name: 'setting_basic_font_size_100',
  },
  {
    size: 1.1,
    name: 'setting_basic_font_size_110',
  },
  {
    size: 1.2,
    name: 'setting_basic_font_size_120',
  },
  {
    size: 1.3,
    name: 'setting_basic_font_size_130',
  },
] as const

const SizeText = () => {
  const size = getTextSize(14) * useFontSize()
  const t = useI18n()

  return <Text style={{ fontSize: size }} color={'#E64040'}>{t('setting_basic_font_size_preview')}</Text>
}

export default memo(() => {
  const t = useI18n()
  const fontSize = useFontSize()

  const options = useMemo(() => {
    return LIST.map((item) => ({ id: String(item.size), label: t(item.name) }))
  }, [t])

  return (
    <SubTitle title={t('setting_basic_font_size')}>
      <View style={styles.preview}>
        <SizeText />
      </View>
      <ChoiceBar
        options={options}
        activeId={String(fontSize)}
        onChange={id => { setFontSize(Number(id) as typeof LIST[number]['size']) }}
      />
    </SubTitle>
  )
})

const styles = createStyle({
  preview: {
    justifyContent: 'center',
    paddingBottom: 8,
    height: 36,
  },
})
