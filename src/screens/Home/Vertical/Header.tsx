import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import StatusBar from '@/components/common/StatusBar'
import Text from '@/components/common/Text'
import { setNavActiveId } from '@/core/common'
import { useI18n } from '@/lang'
import { SmartisanImages } from '@/resources/smartisan'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { emitEditPress } from '@/screens/LocalMusic/editEvent'
import { createStyle } from '@/utils/tools'

// 锤子音乐标题栏实测（res/layout/music_toolbar.xml）：
// 高 48dp；左侧 tv_edit 高 30dp / minWidth 46dp / 圆角 4dp / 1.5px #ccdcdbdb 描边；
// 居中标题 18sp bold；右侧 iv_search 48x28dp，同样的描边按钮
const HEADER_HEIGHT = 48
const BTN_BORDER_COLOR = '#ccdcdbdb'
const BTN_TEXT_COLOR = '#4d4d4d'

// 本地音乐已改成独立页面（自带标题栏），底部标签这里不需要「编辑」入口
const EDIT_TABS: string[] = []

// 这些页面本身就是搜索页，不再重复显示搜索按钮
const NO_SEARCH_TABS: string[] = ['nav_search', 'nav_mine', 'nav_songlist', 'nav_top']

const HeaderBar = () => {
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  const showEdit = EDIT_TABS.includes(id)
  const showSearch = !NO_SEARCH_TABS.includes(id)

  return (
    <View style={{
      ...styles.outer,
      height: HEADER_HEIGHT + statusBarHeight,
      backgroundColor: '#ffffff',
      borderBottomColor: '#ededed',
    }}>
      <View style={{ height: statusBarHeight }} />
      <View style={styles.row}>
        {showEdit
          ? (
              <TouchableOpacity
                style={styles.editBtn}
                activeOpacity={0.6}
                onPress={() => { emitEditPress() }}
              >
                <Text size={13} color={BTN_TEXT_COLOR} style={styles.editText}>{t('smartisan_edit')}</Text>
              </TouchableOpacity>
            )
          : <View style={styles.editPlaceholder} />}
        <View style={styles.titleWrap} pointerEvents="none">
          <Text size={18} style={styles.title} numberOfLines={1}>{t(id)}</Text>
        </View>
        {showSearch
          ? (
              <TouchableOpacity
                style={styles.searchBtn}
                activeOpacity={0.6}
                onPress={() => { setNavActiveId('nav_search') }}
              >
                <Image source={SmartisanImages.search} style={styles.searchIcon} resizeMode="contain" />
              </TouchableOpacity>
            )
          : null}
      </View>
    </View>
  )
}

const Header = () => (
  <>
    <StatusBar />
    <HeaderBar />
  </>
)

const styles = createStyle({
  outer: {
    width: '100%',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  editBtn: {
    height: 30,
    minWidth: 46,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: BTN_BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    fontWeight: 'bold',
  },
  editPlaceholder: {
    width: 0,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  searchBtn: {
    marginLeft: 'auto',
    width: 48,
    height: 28,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: BTN_BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
})

export default Header
