import { forwardRef, useImperativeHandle, useRef } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

import Popup, { type PopupType } from '@/components/common/Popup'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import musicSdk from '@/utils/musicSdk'
import { LIST_IDS } from '@/config/constant'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_DISABLED = '#c0c0c0'
const HAMMER_LINE = '#ededed'

export interface MorePopupProps {
  /** 顶部条之外的自定义列表，点一下切过去 */
  otherLists: LX.List.UserListInfo[]
  /** 当前选中的列表，用来决定哪些操作可用 */
  listInfo?: LX.List.MyListInfo
  /** 当前列表是否正在拉取数据 */
  fetching?: boolean
  onSwitchList: (id: string) => void
  onSearch: () => void
  onNew: () => void
  onRename: () => void
  onSort: () => void
  onDuplicateMusic: () => void
  onSync: () => void
  onImport: () => void
  onExport: () => void
  onRemove: () => void
}

export interface MorePopupType {
  show: () => void
}

interface RowProps {
  label: string
  disabled?: boolean
  active?: boolean
  onPress: () => void
}

const Row = ({ label, disabled, active, onPress }: RowProps) => {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={disabled ? 1 : 0.6}
      onPress={() => {
        if (disabled) return
        onPress()
      }}
    >
      <Text
        size={15}
        numberOfLines={1}
        color={disabled ? HAMMER_DISABLED : (active ? '#E64040' : HAMMER_TEXT)}
      >{label}</Text>
    </TouchableOpacity>
  )
}

/**
 * 「我的列表」顶部条右侧的「更多」弹层。
 *
 * 顶部条只放固定的三个列表 + 一个最近打开的列表，所以这里分三段：
 * 其他列表（切换 + 新建）、当前列表（搜索/重命名/排序/更新/移除）、数据（导入/导出/查重）。
 * 扫描本地音乐、添加本地歌曲属于设备级操作，已挪到 设置 → 数据与缓存。
 */
export default forwardRef<MorePopupType, MorePopupProps>((props, ref) => {
  const t = useI18n()
  const popupRef = useRef<PopupType>(null)
  const { listInfo, fetching, otherLists } = props

  useImperativeHandle(ref, () => ({
    show() {
      popupRef.current?.setVisible(true)
    },
  }), [])

  const isBuiltin = !listInfo || listInfo.id == LIST_IDS.DEFAULT || listInfo.id == LIST_IDS.LOVE
  const userList = isBuiltin ? null : listInfo as LX.List.UserListInfo
  // 拉取中、或源本身不支持时，更新不可用（与原来的列表菜单保持一致）
  const canSync = !!(userList?.source && musicSdk[userList.source]?.songList) && !fetching

  const run = (fn: () => void) => {
    popupRef.current?.setVisible(false)
    // 收起弹层后再执行，避免弹层盖住紧接着打开的对话框
    requestAnimationFrame(fn)
  }

  return (
    <Popup ref={popupRef} position="bottom" title={t('mylist_more_title')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text size={12} color={HAMMER_SUB} style={styles.sectionTitle}>{t('mylist_other_lists')}</Text>
        {
          otherLists.map(item => (
            <Row
              key={item.id}
              label={item.name}
              active={listInfo?.id == item.id}
              onPress={() => { run(() => { props.onSwitchList(item.id) }) }}
            />
          ))
        }
        <Row label={t('list_create')} onPress={() => { run(props.onNew) }} />

        <Text size={12} color={HAMMER_SUB} style={styles.sectionTitle}>{t('mylist_current_list')}</Text>
        <Row label={t('mylist_more_search')} onPress={() => { run(props.onSearch) }} />
        <Row label={t('list_rename')} disabled={isBuiltin} onPress={() => { run(props.onRename) }} />
        <Row label={t('list_sort')} onPress={() => { run(props.onSort) }} />
        <Row label={t('list_sync')} disabled={!canSync} onPress={() => { run(props.onSync) }} />
        <Row label={t('list_remove')} disabled={isBuiltin} onPress={() => { run(props.onRemove) }} />

        <Text size={12} color={HAMMER_SUB} style={styles.sectionTitle}>{t('mylist_data')}</Text>
        <Row label={t('list_import')} onPress={() => { run(props.onImport) }} />
        <Row label={t('list_export')} onPress={() => { run(props.onExport) }} />
        <Row label={t('lists__duplicate')} onPress={() => { run(props.onDuplicateMusic) }} />
      </ScrollView>
    </Popup>
  )
})

const styles = createStyle({
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    height: 46,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
})
