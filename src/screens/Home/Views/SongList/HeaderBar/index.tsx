import { forwardRef, useImperativeHandle, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Icon } from '@/components/common/Icon'
import SortTab, { type SortTabProps, type SortTabType } from './SortTab'
import FilterPopup, { type FilterPopupType } from './FilterPopup'
import { createStyle } from '@/utils/tools'
import { type SourceSelectorProps } from './SourceSelector'
import { type Source } from '@/store/songlist/state'

const HAMMER_TEXT = '#4d4d4d'

export interface HeaderBarProps {
  onSortChange: SortTabProps['onSortChange']
  onTagChange: (name: string, id: string) => void
  onSourceChange: SourceSelectorProps['onSourceChange']
}

export interface HeaderBarType {
  setSource: (source: Source, sortId: string, tagName: string, tagId: string) => void
}

/**
 * 歌单页顶栏：只保留排序分段与标签，音源选择与打开歌单收进右侧筛选弹层。
 */
export default forwardRef<HeaderBarType, HeaderBarProps>(({ onSortChange, onTagChange, onSourceChange }, ref) => {
  const sortTabRef = useRef<SortTabType>(null)
  const filterRef = useRef<FilterPopupType>(null)

  useImperativeHandle(ref, () => ({
    setSource(source, sortId, tagName, tagId) {
      sortTabRef.current?.setSource(source, sortId)
      filterRef.current?.setSource(source)
      filterRef.current?.setTagInfo(source, tagName, tagId)
    },
  }), [])


  return (
    <View style={styles.searchBar}>
      <SortTab ref={sortTabRef} onSortChange={onSortChange} />
      <TouchableOpacity style={styles.filterBtn} activeOpacity={0.6} onPress={() => { filterRef.current?.show() }}>
        <Icon name="menu" size={18} color={HAMMER_TEXT} />
      </TouchableOpacity>
      <FilterPopup ref={filterRef} onSourceChange={onSourceChange} onTagChange={onTagChange} />
    </View>
  )
})

const styles = createStyle({
  searchBar: {
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
  },
  filterBtn: {
    width: 46,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
