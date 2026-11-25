import { forwardRef, useImperativeHandle, useState } from 'react'
import { View, ScrollView } from 'react-native'

import { createStyle } from '@/utils/tools'
import { type Position } from './ListMenu'
import ListItem, { type ListItemProps } from './ListItem'
import EmptyView from '@/components/common/EmptyView'
import { useI18n } from '@/lang'
import { type BoardItem } from '@/store/leaderboard/state'

export interface ListProps {
  list: BoardItem[]
  activeId: string
  onBoundChange: (listId: string) => void
  onShowMenu: (info: { listId: string, name: string, index: number }, position: Position) => void
}
export interface ListType {
  hideMenu: () => void
}

/**
 * 榜单列表。
 * 榜单数据以前靠 ref 的 setList 从外面灌进来，但弹层关闭时子树被 RN Modal 卸载，
 * 灌数据那次调用落空，打开时永远是空的 —— 改成受控 props 由父级直接渲染。
 */
export default forwardRef<ListType, ListProps>(({ list, activeId, onBoundChange, onShowMenu }, ref) => {
  const t = useI18n()
  const [longPressIndex, setLongPressIndex] = useState(-1)

  useImperativeHandle(ref, () => ({
    hideMenu() {
      setLongPressIndex(-1)
    },
  }), [])

  const handleShowMenu: ListItemProps['onShowMenu'] = (listId, name, index, position: Position) => {
    setLongPressIndex(index)
    onShowMenu({ listId, name, index }, position)
  }

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>
      {
        list.length
          ? (
              <View>
                {
                  list.map((item, index) => {
                    return (
                      <ListItem
                        key={item.id}
                        item={item}
                        index={index}
                        longPressIndex={longPressIndex}
                        activeId={activeId}
                        onShowMenu={handleShowMenu}
                        onBoundChange={() => { onBoundChange(item.id) }}
                      />
                    )
                  })
                }
              </View>
            )
          : <EmptyView text={t('loading')} icon="list-order" paddingTop={40} />
      }
    </ScrollView>
  )
})


const styles = createStyle({
  scrollView: {
    flexShrink: 1,
  },
})
