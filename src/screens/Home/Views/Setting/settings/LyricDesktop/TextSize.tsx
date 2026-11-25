import { memo, useCallback, useState } from 'react'
import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import Slider, { type SliderProps } from '../../components/Slider'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { setDesktopLyricTextSize } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'


export default memo(() => {
  const t = useI18n()
  const fontSize = useSettingValue('desktopLyric.style.fontSize')
  const [sliderSize, setSliderSize] = useState(fontSize)
  const [isSliding, setSliding] = useState(false)
  const handleSlidingStart = useCallback<NonNullable<SliderProps['onSlidingStart']>>(() => {
    setSliding(true)
  }, [])
  const handleValueChange = useCallback<NonNullable<SliderProps['onValueChange']>>(value => {
    setSliderSize(value)
  }, [])
  const handleSlidingComplete = useCallback<NonNullable<SliderProps['onSlidingComplete']>>(value => {
    if (fontSize == value) return
    void setDesktopLyricTextSize(value).then(() => {
      updateSetting({ 'desktopLyric.style.fontSize': value })
    }).finally(() => {
      setSliding(false)
    })
  }, [fontSize])

  return (
    <SubTitle title={t('setting_lyric_desktop_text_size')}>
      <View style={styles.content}>
        <Text style={styles.value} size={15}>{isSliding ? sliderSize : fontSize}</Text>
        <Slider
          minimumValue={100}
          maximumValue={500}
          onSlidingComplete={handleSlidingComplete}
          onValueChange={handleValueChange}
          onSlidingStart={handleSlidingStart}
          step={2}
          value={fontSize}
        />
      </View>
    </SubTitle>
  )
})

const styles = createStyle({
  content: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  value: {
    width: 54,
    color: '#E64040',
    fontWeight: 'bold',
  },
})
