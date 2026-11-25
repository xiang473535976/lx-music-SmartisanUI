import { forwardRef, useImperativeHandle, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Icon } from '@/components/common/Icon'
import { createStyle } from '@/utils/tools'
import SourceSelector, {
  type SourceSelectorType,
} from './SourceSelector'
import ActiveListName, { type ActiveListNameType } from './ActiveListName'
import BoardsPopup, { type BoardsPopupType } from './BoardsPopup'
import type { BoardItem } from '@/store/leaderboard/state'

const HAMMER_TEXT = '#4d4d4d'

export interface HeaderBarProps {
  boards: BoardItem[]
  activeBoardId: string
  onSourceChange: (source: LX.OnlineSource) => void
  onBoundChange: (id: string) => void
  onPlay: (id: string) => void
  onCollect: (id: string, name: string) => void
}

export interface HeaderBarType {
  setBound: (source: LX.OnlineSource, id: string, name: string) => void
}

/**
 * 排行榜顶栏：左音源选择、中当前榜单名、右「更多」按钮（榜单列表收进底部弹层）。
 */
export default forwardRef<HeaderBarType, HeaderBarProps>(({
  boards,
  activeBoardId,
  onSourceChange,
  onBoundChange,
  onPlay,
  onCollect,
}, ref) => {
  const activeListNameRef = useRef<ActiveListNameType>(null)
  const sourceSelectorRef = useRef<SourceSelectorType>(null)
  const boardsPopupRef = useRef<BoardsPopupType>(null)

  useImperativeHandle(ref, () => ({
    setBound(source, id, name) {
      sourceSelectorRef.current?.setSource(source)
      activeListNameRef.current?.setBound(id, name)
    },
  }), [])

  const showBoards = () => {
    boardsPopupRef.current?.show()
  }

  return (
    <View style={styles.currentList}>
      <SourceSelector ref={sourceSelectorRef} onSourceChange={onSourceChange} />
      <ActiveListName ref={activeListNameRef} onShowBound={showBoards} />
      <TouchableOpacity style={styles.boardBtn} activeOpacity={0.6} onPress={showBoards}>
        <Icon name="menu" size={18} color={HAMMER_TEXT} />
      </TouchableOpacity>
      <BoardsPopup
        ref={boardsPopupRef}
        boards={boards}
        activeBoardId={activeBoardId}
        onBoundChange={onBoundChange}
        onPlay={onPlay}
        onCollect={onCollect}
      />
    </View>
  )
})

const styles = createStyle({
  currentList: {
    flexDirection: 'row',
    height: 38,
    zIndex: 2,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
  },
  boardBtn: {
    width: 46,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
