import { memo, useRef } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'

import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { navigations } from '@/navigation'
import { useComponentIds } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { LIST_IDS } from '@/config/constant'
import { SmartisanImages } from '@/resources/smartisan'
import { LOCAL_LIST_ID } from '@/core/localMusic'
import TimeoutExitEditModal, { type TimeoutExitEditModalType, useTimeInfo } from '@/components/TimeoutExitEditModal'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'
const HAMMER_RED = '#E64040'

const ACTION_SETTING = 'setting'

/**
 * 「我的」页面：底部第 5 个标签。
 * 锤子风格的个人中心：顶部品牌区 + 分组入口列表。
 */
const MENU_ITEMS = [
  { id: 'love', icon: 'love', label: 'list_name_love' },
  { id: 'local', icon: 'music_time', label: 'local_music_list_name' },
  { id: 'played', icon: 'list-order', label: 'mine_played_list' },
  { id: 'timeout', icon: 'playback-rate', label: 'mine_timeout_exit' },
  { id: 'api', icon: 'available_updates', label: 'setting_basic_source_user_api_btn' },
  { id: 'about', icon: 'help', label: 'setting_about' },
  { id: ACTION_SETTING, icon: 'setting', label: 'nav_setting' },
] as const

type MenuId = typeof MENU_ITEMS[number]['id']

export default memo(() => {
  const t = useI18n()
  const componentIds = useComponentIds()
  const homeId = componentIds.home

  const timeoutRef = useRef<TimeoutExitEditModalType>(null)
  const timeInfo = useTimeInfo()

  const handlePress = (id: MenuId) => {
    if (!homeId) return
    switch (id) {
      case 'love':
        navigations.pushListDetailScreen(homeId, LIST_IDS.LOVE, t('list_name_love'))
        return
      case 'local':
        navigations.pushListDetailScreen(homeId, LOCAL_LIST_ID, t('local_music_list_name'))
        return
      case 'played':
        navigations.pushPlayedListScreen(homeId)
        return
      case 'timeout':
        timeoutRef.current?.show()
        return
      case 'api':
        navigations.pushUserApiScreen(homeId)
        return
      case 'about':
        navigations.pushAboutScreen(homeId)
        return
      case ACTION_SETTING:
        navigations.pushSettingScreen(homeId)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.brand}>
          <Image source={SmartisanImages.appLogo} style={styles.brandLogo} resizeMode="contain" />
          <Text style={styles.brandName} size={18} color={HAMMER_TEXT}>{t('app_name')}</Text>
          <Text style={styles.brandVer} size={12} color={HAMMER_SUB}>v{process.versions.app}</Text>
        </View>
        <View style={styles.card}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, index == MENU_ITEMS.length - 1 ? styles.itemLast : null]}
              activeOpacity={0.6}
              onPress={() => { handlePress(item.id) }}
            >
              <View style={styles.iconContent}>
                <Icon name={item.icon} size={20} color={HAMMER_TEXT} />
              </View>
              <Text style={styles.text} size={15} color={HAMMER_TEXT}>{t(item.label)}</Text>
              {item.id == 'timeout' && timeInfo.active
                ? <Text style={styles.tip} size={12} color={HAMMER_RED}>{timeInfo.confirmText}</Text>
                : null}
              <Icon name="chevron-right" size={16} color="#c8c8c8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TimeoutExitEditModal ref={timeoutRef} timeInfo={timeInfo} />
    </View>
  )
})

const styles = createStyle({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scroll: {
    flex: 1,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
  },
  brandLogo: {
    width: 82,
    height: 82,
  },
  brandName: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  brandVer: {
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
  item: {
    flexDirection: 'row',
    height: 52,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  iconContent: {
    width: 26,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    paddingLeft: 14,
  },
  tip: {
    paddingRight: 6,
  },
})
