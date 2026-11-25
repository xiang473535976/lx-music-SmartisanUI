import { useRef, useImperativeHandle, forwardRef } from 'react'
import { useI18n } from '@/lang'
import type { Position } from '@/components/common/Menu'
import ActionSheetMenu, { type ActionSheetMenuType, type ActionItem } from '@/components/common/ActionSheetMenu'
import { hasDislike } from '@/core/dislikeList'
import { hasMusicUrlByMusic } from '@/utils/data'

export interface SelectInfo {
  musicInfo: LX.Music.MusicInfoOnline
  selectedList: LX.Music.MusicInfoOnline[]
  index: number
  single: boolean
}
const initSelectInfo = {}

const hasUrlCache = async(musicInfo: LX.Music.MusicInfo) => {
  return hasMusicUrlByMusic(musicInfo)
}
export interface ListMenuProps {
  onPlay: (selectInfo: SelectInfo) => void
  onPlayLater: (selectInfo: SelectInfo) => void
  onAdd: (selectInfo: SelectInfo) => void
  onCopyName: (selectInfo: SelectInfo) => void
  onMusicSourceDetail: (selectInfo: SelectInfo) => void
  onRemoveCache: (selectInfo: SelectInfo) => void
  onDislikeMusic: (selectInfo: SelectInfo) => void
}
export interface ListMenuType {
  show: (selectInfo: SelectInfo, position?: Position) => void
}

export type {
  Position,
}

export default forwardRef<ListMenuType, ListMenuProps>((props: ListMenuProps, ref) => {
  const t = useI18n()
  const menuRef = useRef<ActionSheetMenuType>(null)
  const selectInfoRef = useRef<SelectInfo>(initSelectInfo as SelectInfo)

  useImperativeHandle(ref, () => ({
    show(selectInfo) {
      selectInfoRef.current = selectInfo
      const { items, menu } = handleSetMenu(selectInfo.musicInfo)
      menuRef.current?.show(items, handleMenuPress)
      void hasUrlCache(selectInfo.musicInfo).then((has_url_cache) => {
        const target = menu.find(m => m.action == 'removeCache')
        if (target && target.disabled != !has_url_cache) {
          target.disabled = !has_url_cache
          menuRef.current?.update([...menu])
        }
      })
    },
  }))

  const handleSetMenu = (musicInfo: LX.Music.MusicInfo) => {
    const menu: ActionItem[] = [
      { action: 'play', label: t('play'), icon: 'play' },
      { action: 'playLater', label: t('play_later'), icon: 'play-outline' },
      { action: 'add', label: t('add_to'), icon: 'add-music' },
      { action: 'copyName', label: t('copy_name'), icon: 'share' },
      { action: 'musicSourceDetail', label: t('music_source_detail'), icon: 'help' },
      { action: 'removeCache', disabled: true, label: t('list_remove_cache'), icon: 'eraser' },
      { action: 'dislike', label: t('dislike'), disabled: hasDislike(musicInfo), icon: 'thumbs-up' },
    ]
    return { items: menu, menu }
  }

  const handleMenuPress = (action: string) => {
    const selectInfo = selectInfoRef.current
    switch (action) {
      case 'play':
        props.onPlay(selectInfo)
        break
      case 'playLater':
        props.onPlayLater(selectInfo)
        break
      case 'add':
        props.onAdd(selectInfo)
        break
      case 'copyName':
        props.onCopyName(selectInfo)
        break
      case 'musicSourceDetail':
        props.onMusicSourceDetail(selectInfo)
        break
      case 'removeCache':
        props.onRemoveCache(selectInfo)
        break
      case 'dislike':
        props.onDislikeMusic(selectInfo)
        break
      default:
        break
    }
  }

  return <ActionSheetMenu ref={menuRef} />
})
