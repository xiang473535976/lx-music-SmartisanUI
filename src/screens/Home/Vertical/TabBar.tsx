import { memo } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import Text from '@/components/common/Text'
import { TAB_MENUS, type TAB_ID_Type } from '@/config/constant'
import { useI18n } from '@/lang'
import { useNavActiveId } from '@/store/common/hook'
import commonAction from '@/store/common/action'
import { SmartisanImages } from '@/resources/smartisan'
import { createStyle } from '@/utils/tools'

// 锤子音乐底部标签栏实测（music_navigationbar.xml，1080x2400，密度 440 => 1dp = 2.75px）：
// 容器 64dp（我们用 55dp 以保留洛雪原有布局高度）；每个 tab 内 ImageView 42dp × 42dp
// scaleType=centerCrop，TextView 9sp bold；未选中 @color/tabbarTv #939396，
// 选中 @color/tabbarDownTv #E64040。选中态由 selector 换图（*_on.png），不是 tint。
const TAB_BAR_HEIGHT = 55
// 锤子是 64dp 容器 + 42dp 图标；我们沿用洛雪 55dp 容器，图标取 36dp：
// 「4dp 上留白 + 36dp 图标 + 1dp 间距 + 9sp 文字(≈12dp)」≈ 53dp，正好落在容器内。
// 位图画布 122×122、内容 bbox 84–103px，contain 铺 36dp 时可见字形约 25–30dp。
const ICON_SIZE = 36
const ACTIVE_COLOR = '#E64040'
const NORMAL_COLOR = '#939396'

// 用锤子原生 tabbar 位图替换原来的 icoMoon 字体图标。
// 位图画布 122×122，内容 alpha bbox 约 84–103px，直接铺 42dp 即可得到与锤子一致的观感；
// 选中/未选中是两张图（灰 209 / 红 230,64,64），不需要 tint。
interface TabIcon {
  normal: number
  active: number
}

// 锤子 tabbar 里没有「搜索」项，所以放大镜按 tabbar 系列位图的同一套灰度/红重新上色
// （tab_search.png 211 灰 / tab_search_on.png #E64040），避免借用标题栏的深灰 search.png 显得突兀。
const TAB_ICONS: Record<TAB_ID_Type, TabIcon> = {
  nav_search: { normal: SmartisanImages.tabSearch, active: SmartisanImages.tabSearchOn },
  nav_songlist: { normal: SmartisanImages.tabPlaylist, active: SmartisanImages.tabPlaylistOn },
  nav_top: { normal: SmartisanImages.tabSong, active: SmartisanImages.tabSongOn },
  nav_love: { normal: SmartisanImages.tabAlbum, active: SmartisanImages.tabAlbumOn },
  nav_mine: { normal: SmartisanImages.tabAbout, active: SmartisanImages.tabAboutOn },
}

export default memo(() => {
  const activeId = useNavActiveId()
  const t = useI18n()

  return (
    <View style={{
      ...styles.container,
      backgroundColor: '#ffffff',
      borderTopColor: '#ededed',
    }}>
      {TAB_MENUS.map(({ id }) => {
        const active = id === activeId
        const color = active ? ACTIVE_COLOR : NORMAL_COLOR
        const icon = TAB_ICONS[id]
        return (
          <TouchableOpacity
            key={id}
            style={styles.item}
            activeOpacity={0.6}
            onPress={() => { commonAction.setNavActiveId(id) }}
          >
            <Image
              source={active ? icon.active : icon.normal}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.label} size={9} color={color} numberOfLines={1}>{t(id)}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
})

const styles = createStyle({
  container: {
    width: '100%',
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    marginTop: 1,
    fontWeight: 'bold',
  },
})
