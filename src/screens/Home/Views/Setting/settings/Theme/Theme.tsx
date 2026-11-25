import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { View, TouchableOpacity, type ImageSourcePropType } from 'react-native'
import { setTheme } from '@/core/theme'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'

import SubTitle from '../../components/SubTitle'
import { BG_IMAGES, getAllThemes, type LocalTheme } from '@/theme/themes'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { scaleSizeH } from '@/utils/pixelRatio'
import { Icon } from '@/components/common/Icon'
import ImageBackground from '@/components/common/ImageBackground'

// 锤子风：色块圆角 4dp + 细边框，选中用红色描边 + 红字
const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const BORDER_COLOR = '#ccdcdbdb'

const useActive = (id: string) => {
  const activeThemeId = useSettingValue('theme.id')
  const isActive = useMemo(() => activeThemeId == id, [activeThemeId, id])
  return isActive
}

const ThemeItem = ({ id, name, color, image, setTheme, showAll }: {
  id: string
  name: string
  color: string
  showAll: boolean
  image?: ImageSourcePropType
  setTheme: (id: string) => void
}) => {
  const isActive = useActive(id)

  return (
    showAll || isActive ? (
      <TouchableOpacity style={{ ...styles.item, width: scaleSizeH(ITEM_HEIGHT) }} activeOpacity={0.5} onPress={() => { setTheme(id) }}>
        <View style={{ ...styles.colorContent, width: scaleSizeH(COLOR_ITEM_HEIGHT), borderColor: isActive ? HAMMER_RED : BORDER_COLOR, borderWidth: isActive ? 1.5 : 0.5 }}>
          {
            image
              ? <ImageBackground style={{ ...styles.imageContent, width: scaleSizeH(IMAGE_HEIGHT), backgroundColor: color }}
                  imageStyle={{ borderRadius: 2 }}
                  source={image} />
              : <View style={{ ...styles.imageContent, width: scaleSizeH(IMAGE_HEIGHT), backgroundColor: color }}></View>
            }
        </View>
        <Text style={styles.name} size={12} color={isActive ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1}>{name}</Text>
      </TouchableOpacity>
    ) : null
  )
}

const MoreBtn = ({ showAll, setShowAll }: {
  showAll: boolean
  setShowAll: (showAll: boolean) => void
}) => {
  const t = useI18n()

  return (
    showAll ? null
      : (
          <TouchableOpacity style={styles.moreBtn} activeOpacity={0.5} onPress={() => { setShowAll(!showAll) }}>
            <Text size={13} color={HAMMER_RED} numberOfLines={1}>{t('setting_basic_theme_more_btn_show')}</Text>
            <Icon name="chevron-right" size={12} color={HAMMER_RED} />
          </TouchableOpacity>
        )

  )
}

interface ThemeInfo {
  themes: Readonly<LocalTheme[]>
  userThemes: LX.Theme[]
  dataPath: string
}
const initInfo: ThemeInfo = { themes: [], userThemes: [], dataPath: '' }
export default memo(() => {
  const [showAll, setShowAll] = useState(false)
  const t = useI18n()
  const [themeInfo, setThemeInfo] = useState(initInfo)
  const setThemeId = useCallback((id: string) => {
    requestAnimationFrame(() => {
      setTheme(id)
    })
  }, [])

  useEffect(() => {
    void getAllThemes().then(setThemeInfo)
  }, [])

  return (
    <SubTitle title={t('setting_basic_theme')}>
      <View style={styles.list}>
        {
          themeInfo.themes.map(({ id, config }) => {
            return <ThemeItem
              key={id}
              color={config.themeColors['c-theme']}
              image={config.extInfo['bg-image'] ? BG_IMAGES[config.extInfo['bg-image']] : undefined}
              showAll={showAll}
              id={id}
              name={t(`theme_${id}`)}
              setTheme={setThemeId} />
          })
        }
        {
          themeInfo.userThemes.map(({ id, name, config }) => {
            return <ThemeItem
              key={id}
              color={config.themeColors['c-theme']}
              showAll={showAll}
              id={id}
              name={name}
              setTheme={setThemeId} />
          })
        }
        <MoreBtn showAll={showAll} setShowAll={setShowAll} />
      </View>
    </SubTitle>
  )
})

const ITEM_HEIGHT = 60
const COLOR_ITEM_HEIGHT = 34
const IMAGE_HEIGHT = 27
const styles = createStyle({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  item: {
    alignItems: 'center',
  },
  colorContent: {
    height: COLOR_ITEM_HEIGHT,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContent: {
    height: IMAGE_HEIGHT,
    borderRadius: 2,
  },
  name: {
    marginTop: 3,
  },
  moreBtn: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})
