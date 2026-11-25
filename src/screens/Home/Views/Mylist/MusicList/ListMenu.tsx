import { useRef, useImperativeHandle, forwardRef, useState, type ComponentProps } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import Modal, { type ModalType } from '@/components/common/Modal'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { hasDislike } from '@/core/dislikeList'
import { existsFile } from '@/utils/fs'
import { hasMusicUrlByMusic } from '@/utils/data'
import { createStyle } from '@/utils/tools'
import type { Position } from '@/components/common/Menu'

export type { Position }

export interface SelectInfo {
  musicInfo: LX.Music.MusicInfo
  selectedList: LX.Music.MusicInfo[]
  index: number
  listId: string
  single: boolean
}

interface ActionItem {
  action: string
  label: string
  icon: ComponentProps<typeof Icon>['name']
  disabled?: boolean
}

export interface ListMenuProps {
  onPlay: (selectInfo: SelectInfo) => void
  onPlayLater: (selectInfo: SelectInfo) => void
  onAdd: (selectInfo: SelectInfo) => void
  onMove: (selectInfo: SelectInfo) => void
  onEditMetadata: (selectInfo: SelectInfo) => void
  onCopyName: (selectInfo: SelectInfo) => void
  onChangePosition: (selectInfo: SelectInfo) => void
  onToggleSource: (selectInfo: SelectInfo) => void
  onMusicSourceDetail: (selectInfo: SelectInfo) => void
  onRemoveCache: (selectInfo: SelectInfo) => void
  onDislikeMusic: (selectInfo: SelectInfo) => void
  onRemove: (selectInfo: SelectInfo) => void
}
export interface ListMenuType {
  show: (selectInfo: SelectInfo, position?: Position) => void
}

// 锤子风底部操作弹层：4 列图标栅格（参考锤子 MoreMenuBottomDialog）
const ACTION_ICONS: Record<string, ComponentProps<typeof Icon>['name']> = {
  play: 'play',
  playLater: 'play-outline',
  add: 'add-music',
  move: 'add_folder',
  editMetadata: 'comment',
  changePosition: 'list-order',
  toggleSource: 'available_updates',
  copyName: 'share',
  musicSourceDetail: 'help',
  removeCache: 'eraser',
  dislike: 'thumbs-up',
  remove: 'remove',
}

const hasEditMetadata = async(musicInfo: LX.Music.MusicInfo) => {
  if (musicInfo.source != 'local') return false
  return existsFile(musicInfo.meta.filePath)
}
const hasUrlCache = async(musicInfo: LX.Music.MusicInfo) => {
  return hasMusicUrlByMusic(musicInfo)
}

export default forwardRef<ListMenuType, ListMenuProps>((props, ref) => {
  const t = useI18n()
  const modalRef = useRef<ModalType>(null)
  const selectInfoRef = useRef<SelectInfo | null>(null)
  const [items, setItems] = useState<ActionItem[]>([])

  useImperativeHandle(ref, () => ({
    show(selectInfo) {
      selectInfoRef.current = selectInfo
      handleSetMenu(selectInfo.musicInfo)
      modalRef.current?.setVisible(true)
    },
  }))

  const handleSetMenu = (musicInfo: LX.Music.MusicInfo) => {
    const isLocal = musicInfo.source == 'local'
    let edit_metadata = false
    let has_url_cache = false
    const menu: ActionItem[] = [
      { action: 'play', label: t('play'), icon: ACTION_ICONS.play },
      { action: 'playLater', label: t('play_later'), icon: ACTION_ICONS.playLater },
      { action: 'add', label: t('add_to'), icon: ACTION_ICONS.add },
      { action: 'move', label: t('move_to'), icon: ACTION_ICONS.move },
      { action: 'changePosition', label: t('change_position'), icon: ACTION_ICONS.changePosition },
      { action: 'toggleSource', label: t('toggle_source'), icon: ACTION_ICONS.toggleSource },
      { action: 'copyName', label: t('copy_name'), icon: ACTION_ICONS.copyName },
      { action: 'musicSourceDetail', disabled: isLocal, label: t('music_source_detail'), icon: ACTION_ICONS.musicSourceDetail },
      { action: 'removeCache', disabled: !has_url_cache, label: t('list_remove_cache'), icon: ACTION_ICONS.removeCache },
      { action: 'dislike', disabled: hasDislike(musicInfo), label: t('dislike'), icon: ACTION_ICONS.dislike },
      { action: 'remove', label: t('delete'), icon: ACTION_ICONS.remove },
    ]
    if (isLocal) menu.splice(5, 0, { action: 'editMetadata', disabled: !edit_metadata, label: t('edit_metadata'), icon: ACTION_ICONS.editMetadata })
    setItems(menu)
    void Promise.all([isLocal ? hasEditMetadata(musicInfo) : Promise.resolve(false), hasUrlCache(musicInfo)]).then(([_edit_metadata, _has_url_cache]) => {
      let isUpdated = false
      if (edit_metadata != _edit_metadata) {
        edit_metadata = _edit_metadata
        const item = menu.find(m => m.action == 'editMetadata')
        if (item) item.disabled = !edit_metadata
        isUpdated = true
      }
      if (has_url_cache != _has_url_cache) {
        has_url_cache = _has_url_cache
        const item = menu.find(m => m.action == 'removeCache')
        if (item) item.disabled = !has_url_cache
        isUpdated = true
      }
      if (isUpdated) setItems([...menu])
    })
  }

  const hide = () => {
    modalRef.current?.setVisible(false)
  }

  const handleMenuPress = (action: string) => {
    const selectInfo = selectInfoRef.current
    if (!selectInfo) return
    hide()
    switch (action) {
      case 'play': props.onPlay(selectInfo); break
      case 'playLater': props.onPlayLater(selectInfo); break
      case 'add': props.onAdd(selectInfo); break
      case 'move': props.onMove(selectInfo); break
      case 'editMetadata': props.onEditMetadata(selectInfo); break
      case 'copyName': props.onCopyName(selectInfo); break
      case 'changePosition': props.onChangePosition(selectInfo); break
      case 'toggleSource': props.onToggleSource(selectInfo); break
      case 'musicSourceDetail': props.onMusicSourceDetail(selectInfo); break
      case 'removeCache': props.onRemoveCache(selectInfo); break
      case 'dislike': props.onDislikeMusic(selectInfo); break
      case 'remove': props.onRemove(selectInfo); break
      default: break
    }
  }

  return (
    <Modal ref={modalRef} bgColor="rgba(50,50,50,.2)">
      <View style={styles.overlay}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title} size={14} color="#5b5b5b">{t('select_operation')}</Text>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.6} onPress={hide}>
              <Text size={13} color="#5b5b5b">{t('back')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.grid}>
            {items.map(item => (
              <TouchableOpacity
                key={item.action}
                style={styles.cell}
                activeOpacity={0.6}
                disabled={item.disabled}
                onPress={() => { handleMenuPress(item.action) }}
              >
                <View style={{ opacity: item.disabled ? 0.3 : 1 }}>
                  <Icon name={item.icon} size={24} color="#5b5b5b" />
                </View>
                <Text style={{ marginTop: 8, opacity: item.disabled ? 0.3 : 1 }} size={11} color="#939396" numberOfLines={1}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
})

const styles = createStyle({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  backBtn: {
    position: 'absolute',
    right: 12,
    height: 26,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccdcdbdb',
    backgroundColor: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    paddingBottom: 20,
  },
  cell: {
    width: '25%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
})
