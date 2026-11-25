import { forwardRef, useImperativeHandle, useRef } from 'react'

import Popup, { type PopupType } from '@/components/common/Popup'
import { useI18n } from '@/lang'
import BoardsList from '../../BoardsList'
import type { BoardItem } from '@/store/leaderboard/state'

export interface BoardsPopupProps {
  boards: BoardItem[]
  activeBoardId: string
  onBoundChange: (id: string) => void
  onPlay: (id: string) => void
  onCollect: (id: string, name: string) => void
}

export interface BoardsPopupType {
  show: () => void
}

/**
 * 排行榜顶栏右侧「榜单」弹层。
 * 榜单数据走 props 而不是命令式 setList：弹层关闭时 RN Modal 会把子树卸载，
 * 之前那个 setList 调用落在已卸载的 ref 上，导致打开后永远是空白。
 */
export default forwardRef<BoardsPopupType, BoardsPopupProps>(({
  boards,
  activeBoardId,
  onBoundChange,
  onPlay,
  onCollect,
}, ref) => {
  const t = useI18n()
  const popupRef = useRef<PopupType>(null)

  useImperativeHandle(ref, () => ({
    show() {
      popupRef.current?.setVisible(true)
    },
  }), [])

  // 选中某个榜单后先收起弹层，再让父级切换
  const handleBoundChange = (id: string) => {
    popupRef.current?.setVisible(false)
    onBoundChange(id)
  }

  return (
    <Popup ref={popupRef} position="bottom" title={t('leaderboard_board_select')}>
      <BoardsList
        list={boards}
        activeId={activeBoardId}
        onBoundChange={handleBoundChange}
        onPlay={onPlay}
        onCollect={onCollect}
      />
    </Popup>
  )
})
