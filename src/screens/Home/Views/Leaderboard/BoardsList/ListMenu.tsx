import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react'
import { useI18n } from '@/lang'
import type { Position } from '@/components/common/Menu'
import ActionSheetMenu, { type ActionSheetMenuType } from '@/components/common/ActionSheetMenu'

export interface SelectInfo {
  listId: string
  name: string
  index: number
}
const initSelectInfo = {}

export interface ListMenuProps {
  onPlay: (selectInfo: SelectInfo) => void
  onCollect: (selectInfo: SelectInfo) => void
  onHideMenu: () => void
}
export interface ListMenuType {
  show: (selectInfo: SelectInfo, position?: Position) => void
}

export type {
  Position,
}

export default forwardRef<ListMenuType, ListMenuProps>((props, ref) => {
  const t = useI18n()
  const menuRef = useRef<ActionSheetMenuType>(null)
  const selectInfoRef = useRef<SelectInfo>(initSelectInfo as SelectInfo)

  useImperativeHandle(ref, () => ({
    show(selectInfo) {
      selectInfoRef.current = selectInfo
      menuRef.current?.show(menus, handleMenuPress)
    },
  }))

  const menus = useMemo(() => [
    { action: 'play', label: t('play'), icon: 'play' as const },
    { action: 'collect', label: t('collect'), icon: 'love' as const },
  ], [t])

  const handleMenuPress = (action: string) => {
    const selectInfo = selectInfoRef.current
    switch (action) {
      case 'play':
        props.onPlay(selectInfo)
        break
      case 'collect':
        props.onCollect(selectInfo)
        break
      default:
        break
    }
    props.onHideMenu()
  }

  return <ActionSheetMenu ref={menuRef} />
})
