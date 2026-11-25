import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import { Icon } from '@/components/common/Icon'
import MorePopup, { type MorePopupType } from './MorePopup'
import { useActiveListId, useListFetching, useMyList } from '@/store/list/hook'
import { createStyle, toast } from '@/utils/tools'
import { getListPrevSelectId, getListRecentId, saveListRecentId } from '@/utils/data'
import { setActiveList } from '@/core/list'
import { getLocalMusicList, LOCAL_LIST_ID } from '@/core/localMusic'
import { LIST_IDS } from '@/config/constant'
import listState from '@/store/list/state'
import Text from '@/components/common/Text'
import { handleRemove } from '../MyList/listAction'
import { type ListActionsType } from '../MyList'

export interface ActiveListProps {
  onShowSearchBar: () => void
  onScrollToTop?: () => void
  listActionsRef?: React.RefObject<ListActionsType>
}
export interface ActiveListType {
  setVisibleBar: (visible: boolean) => void
}

// 锤子风分段单选：横向排列，选中项灰色实底 + 白字加粗（与歌单页「最新/最热」一致）
const ACTIVE_BG = '#cdcdcd'
const ACTIVE_TEXT = '#ffffff'
const TEXT_COLOR = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

// 顶部条只固定展示「试听列表」；我的收藏 / 本地音乐已迁到「我的」页的独立入口
const FIXED_IDS: string[] = [LIST_IDS.DEFAULT]
// 这两个列表不再出现在顶部条与「更多」弹层里，统一走「我的」页的独立页面
const HIDDEN_IDS: string[] = [LIST_IDS.LOVE, LOCAL_LIST_ID]

// 自定义列表长按删除的提示，只在会话里第一次触发，避免每次长按都弹。
let deleteTipShown = false

/**
 * 「我的列表」页顶部的列表切换条。
 *
 * 顶部条只放「试听列表」加一个「最近打开的自定义列表」，
 * 我的收藏 / 本地音乐已改为「我的」页的独立入口，其余自定义列表收进右侧「更多」弹层。
 */
export default forwardRef<ActiveListType, ActiveListProps>(({ onShowSearchBar, listActionsRef }, ref) => {
  const currentListId = useActiveListId()
  const lists = useMyList()
  const fetching = useListFetching(currentListId)
  const [visibleBar, setVisibleBar] = useState(true)
  const [recentId, setRecentId] = useState('')
  const scrollRef = useRef<ScrollView>(null)
  const morePopupRef = useRef<MorePopupType>(null)

  useImperativeHandle(ref, () => ({
    setVisibleBar(visible) {
      setVisibleBar(visible)
    },
  }))

  useEffect(() => {
    // 本地音乐是懒创建的用户列表，先确保它存在，顶部条才能稳定显示这一项
    void getLocalMusicList()
    void getListRecentId().then(setRecentId)
    // 只有在当前没有选中列表时才回退到上次选择的列表。
    // 「我的」页可以在进入本页前先用 setActiveList 指定列表（我的收藏 / 本地音乐），
    // 这里若无条件覆盖会把那个选择冲掉，表现为点进去还是上一个列表。
    if (listState.activeListId) return
    void getListPrevSelectId().then((id) => {
      setActiveList(id)
    })
  }, [])

  const fixedLists = FIXED_IDS.map(id => lists.find(l => l.id == id)).filter(Boolean) as LX.List.MyListInfo[]
  // 最近打开过的自定义列表（不属于固定项、也不是被隐藏的收藏/本地音乐时才单独占一个位置）
  const recentList = lists.find(l => l.id == recentId && !FIXED_IDS.includes(l.id) && !HIDDEN_IDS.includes(l.id))
  // 顶部条之外的自定义列表，交给「更多」弹层
  const otherLists = lists.filter(l => !FIXED_IDS.includes(l.id) && !HIDDEN_IDS.includes(l.id) && l.id != recentList?.id) as LX.List.UserListInfo[]
  const currentList = lists.find(l => l.id == currentListId)
  const currentIndex = lists.findIndex(l => l.id == currentListId)

  const handleSwitch = (id: string) => {
    if (!FIXED_IDS.includes(id)) saveListRecentId(id)
    setActiveList(id)
  }

  const renderSegment = (item: LX.List.MyListInfo) => {
    const isActive = currentListId == item.id
    const isFixed = FIXED_IDS.includes(item.id)
    return (
      <TouchableOpacity
        key={item.id}
        style={{ ...styles.segment, backgroundColor: isActive ? ACTIVE_BG : 'transparent' }}
        activeOpacity={0.6}
        onPress={() => { handleSwitch(item.id) }}
        onLongPress={isFixed ? undefined : () => {
          if (!deleteTipShown) {
            deleteTipShown = true
            toast('长按列表可删除')
          }
          handleRemove(item as LX.List.UserListInfo)
        }}
      >
        <Text
          style={isActive ? styles.segmentTextActive : styles.segmentText}
          size={14}
          numberOfLines={1}
          color={isActive ? ACTIVE_TEXT : TEXT_COLOR}
        >{item.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ ...styles.bar, opacity: visibleBar ? 1 : 0 }} pointerEvents={visibleBar ? 'auto' : 'none'}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {fixedLists.map(renderSegment)}
        {recentList ? renderSegment(recentList) : null}
      </ScrollView>
      <TouchableOpacity style={styles.searchBtn} activeOpacity={0.6} onPress={() => { morePopupRef.current?.show() }}>
        <Icon color={HAMMER_SUB} name="menu" size={18} />
      </TouchableOpacity>
      <MorePopup
        ref={morePopupRef}
        otherLists={otherLists}
        listInfo={currentList}
        fetching={fetching}
        onSwitchList={handleSwitch}
        onSearch={onShowSearchBar}
        onNew={() => { listActionsRef?.current?.newList(Math.max(currentIndex - 1, 0)) }}
        onRename={() => { if (currentList) listActionsRef?.current?.rename(currentList as LX.List.UserListInfo) }}
        onSort={() => { if (currentList) listActionsRef?.current?.sort(currentList) }}
        onDuplicateMusic={() => { if (currentList) listActionsRef?.current?.duplicateMusic(currentList) }}
        onSync={() => { if (currentList) listActionsRef?.current?.sync(currentList as LX.List.UserListInfo) }}
        onImport={() => { if (currentList) listActionsRef?.current?.importList(currentList, currentIndex) }}
        onExport={() => { if (currentList) listActionsRef?.current?.exportList(currentList, currentIndex) }}
        onRemove={() => { if (currentList) listActionsRef?.current?.remove(currentList as LX.List.UserListInfo) }}
      />
    </View>
  )
})

const styles = createStyle({
  bar: {
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 4,
  },
  segment: {
    height: 26,
    minWidth: 56,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
  },
  segmentTextActive: {
    fontWeight: 'bold',
  },
  searchBtn: {
    width: 46,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
