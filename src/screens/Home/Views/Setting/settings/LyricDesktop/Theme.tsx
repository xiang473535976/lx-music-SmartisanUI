import { updateSetting } from '@/core/common'
import { setDesktopLyricColor } from '@/core/desktopLyric'
import { useI18n } from '@/lang'
import { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'

import SubTitle from '../../components/SubTitle'
import { createStyle } from '@/utils/tools'
import { useSettingValue } from '@/store/setting/hook'

const themes = [
  ['#08e664', 'rgba(0,0,0,0.6)'],
  ['#fffa12', 'rgba(0,0,0,0.6)'],
  ['#019ce4', 'rgba(0,0,0,0.6)'],
  ['#ff1222', 'rgba(0,0,0,0.6)'],
  ['#ef6976', 'rgba(0,0,0,0.6)'],
  ['#c851d4', 'rgba(0,0,0,0.6)'],
  ['#ffa600', 'rgba(0,0,0,0.6)'],
  ['#000000', '#ffffff'],
  ['#ffffff', 'rgba(0,0,0,0.6)'],
] as const
type Theme = typeof themes[number]

// 锤子风：颜色块 28dp 圆角 4dp，选中加红色描边
const HAMMER_RED = '#E64040'
const BORDER_COLOR = '#ccdcdbdb'

const ThemeItem = ({ color, active, change }: {
  color: Theme
  active: boolean
  change: (color: Theme) => void
}) => {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={() => { change(color) }}>
      <View style={active ? { ...styles.colorContent, ...styles.colorContentActive } : styles.colorContent}>
        <View style={{ ...styles.image, backgroundColor: color[0] }}></View>
      </View>
    </TouchableOpacity>
  )
}

export default memo(() => {
  const t = useI18n()
  const activeColor = useSettingValue('desktopLyric.style.lyricPlayedColor')

  const setThemeDesktopLyric = (color: Theme) => {
    void setDesktopLyricColor(null, color[0], color[1]).then(() => {
      updateSetting({ 'desktopLyric.style.lyricPlayedColor': color[0], 'desktopLyric.style.lyricShadowColor': color[1] })
    })
  }

  return (
    <SubTitle title={t('setting_lyric_desktop_theme')}>
      <View style={styles.list}>
        {
          themes.map((c, i) => <ThemeItem key={i.toString()} color={c} active={activeColor == c[0]} change={setThemeDesktopLyric} />)
        }
      </View>
    </SubTitle>
  )
})

const styles = createStyle({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    marginRight: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  colorContent: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorContentActive: {
    borderWidth: 1.5,
    borderColor: HAMMER_RED,
  },
  image: {
    width: 22,
    height: 22,
    borderRadius: 2,
  },
})
