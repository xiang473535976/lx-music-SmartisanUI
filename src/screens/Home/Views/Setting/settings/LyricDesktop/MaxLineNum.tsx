import { memo, useCallback, useState } from 'react'
import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import Slider, { type SliderProps } from '../../components/Slider'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { setDesktopLyricMaxLineNum } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'


export default memo(() => {
  const t = useI18n()
  const maxLineNum = useSettingValue('desktopLyric.maxLineNum')
  const [sliderSize, setSliderSize] = useState(maxLineNum)
  const [isSliding, setSliding] = useState(false)
  const handleSlidingStart = useCallback<NonNullable<SliderProps['onSlidingStart']>>(() => {
    setSliding(true)
  }, [])
  const handleValueChange = useCallback<NonNullable<SliderProps['onValueChange']>>(value => {
    setSliderSize(value)
  }, [])
  const handleSlidingComplete = useCallback<NonNullable<SliderProps['onSlidingComplete']>>(value => {
    if (maxLineNum == value) return
    void setDesktopLyricMaxLineNum(value).then(() => {
      updateSetting({ 'desktopLyric.maxLineNum': value })
    }).finally(() => {
      setSliding(false)
    })
  }, [maxLineNum])

  return (
    <SubTitle title={t('setting_lyric_desktop_maxlineNum')}>
      <View style={styles.content}>
        <Text style={styles.value} size={15}>{isSliding ? sliderSize : maxLineNum}</Text>
        <Slider
          minimumValue={1}
          maximumValue={8}
          onSlidingComplete={handleSlidingComplete}
          onValueChange={handleValueChange}
          onSlidingStart={handleSlidingStart}
          step={1}
          value={maxLineNum}
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
