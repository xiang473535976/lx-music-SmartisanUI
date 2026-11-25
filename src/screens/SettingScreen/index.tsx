import { ScrollView, TouchableOpacity, View } from 'react-native'

import PageContent from '@/components/PageContent'
import PageHeader from '@/components/common/PageHeader'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { navigations, pop } from '@/navigation'
import { useComponentIds } from '@/store/common/hook'
import { SETTING_SCREENS, type SettingScreenIds } from '@/screens/Home/Views/Setting/Main'
import { createStyle } from '@/utils/tools'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

const TITLE_KEYS = {
  basic: 'setting_basic',
  player: 'setting_player',
  lyric_desktop: 'setting_lyric_desktop',
  search: 'setting_search',
  list: 'setting_list',
  data: 'setting_data',
} as const

const DESC_KEYS = {
  basic: 'setting_basic_desc',
  player: 'setting_player_desc',
  lyric_desktop: 'setting_lyric_desktop_desc',
  search: 'setting_search_desc',
  list: 'setting_list_desc',
  data: 'setting_data_desc',
} as const

const ITEM_ICONS: Record<SettingScreenIds, string> = {
  basic: 'setting',
  player: 'play-outline',
  lyric_desktop: 'lyric-on',
  search: 'search-2',
  list: 'list-order',
  data: 'available_updates',
}

/**
 * 设置独立页面（分类首屏）
 * 从「我的」里的「设置」入口 push 进来，首屏只列出 8 个分类，
 * 点某个分类再 push 到 SettingDetailScreen 看具体设置项 —— 避免 50 多项堆成一条长列表。
 */
export default ({ componentId }: { componentId: string }) => {
  const t = useI18n()
  const componentIds = useComponentIds()

  const handleBack = () => {
    void pop(componentId)
  }

  const handlePress = (id: SettingScreenIds) => {
    navigations.pushSettingDetailScreen(componentIds.home!, id)
  }

  return (
    <PageContent>
      <PageHeader title={t('nav_setting')} onBack={handleBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {SETTING_SCREENS.map((id, index) => (
            <TouchableOpacity
              key={id}
              style={{ ...styles.item, ...(index == SETTING_SCREENS.length - 1 ? styles.itemLast : null) }}
              activeOpacity={0.6}
              onPress={() => { handlePress(id) }}
            >
              <View style={styles.iconContent}>
                <Icon name={ITEM_ICONS[id]} size={20} color={HAMMER_TEXT} />
              </View>
              <View style={styles.textWrap}>
                <Text size={15} color={HAMMER_TEXT} numberOfLines={1}>{t(TITLE_KEYS[id])}</Text>
                <Text size={12} color={HAMMER_SUB} style={styles.desc} numberOfLines={1}>{t(DESC_KEYS[id])}</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#c8c8c8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </PageContent>
  )
}

const styles = createStyle({
  scroll: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
  item: {
    flexDirection: 'row',
    height: 62,
    paddingLeft: 14,
    paddingRight: 14,
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
  textWrap: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 10,
  },
  desc: {
    marginTop: 3,
  },
})
