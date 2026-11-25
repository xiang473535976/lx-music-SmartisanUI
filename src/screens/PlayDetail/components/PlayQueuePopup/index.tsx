import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FlatList, Image as RNImage, ScrollView, TouchableOpacity, View } from 'react-native'

import Popup, { type PopupProps, type PopupType } from '@/components/common/Popup'
import Text from '@/components/common/Text'
import EmptyView from '@/components/common/EmptyView'
import { SmartisanImages } from '@/resources/smartisan'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import playerState from '@/store/player/state'
import { getList } from '@/core/player/playInfo'
import { playList } from '@/core/player/player'

import SettingLyricProgress from '../SettingPopup/settings/SettingLyricProgress'
import SettingVolume from '../SettingPopup/settings/SettingVolume'
import SettingPlaybackRate from '../SettingPopup/settings/SettingPlaybackRate'
import SettingLrcFontSize from '../SettingPopup/settings/SettingLrcFontSize'
import SettingLrcAlign from '../SettingPopup/settings/SettingLrcAlign'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'
const HAMMER_RED = '#E64040'
const HAMMER_ACTIVE_BG = '#cdcdcd'

export interface PlayQueuePopupProps extends Omit<PopupProps, 'children' | 'title'> {
  direction: 'vertical' | 'horizontal'
}

export interface PlayQueuePopupType {
  show: () => void
}

/**
 * LX.Player.PlayMusic 是 LX.Music.MusicInfo | LX.Download.ListItem 的联合类型，
 * 前者直接带 name/singer/meta.picUrl，后者要经过 metadata.musicInfo 取。这里统一归一化。
 */
const getDisplayInfo = (musicInfo: LX.Player.PlayMusic) => {
  if ('metadata' in musicInfo) {
    const info = musicInfo.metadata.musicInfo
    return {
      id: info.id,
      name: info.name,
      singer: info.singer,
      picUrl: info.meta?.picUrl ?? null,
    }
  }
  return {
    id: musicInfo.id,
    name: musicInfo.name,
    singer: musicInfo.singer,
    picUrl: musicInfo.meta?.picUrl ?? null,
  }
}

/**
 * 读取当前播放队列。
 * 正常播放走 playInfo.playerListId 对应的列表；「稍后播放」走 tempPlayList。
 */
const readQueue = (): LX.Player.PlayMusicInfo[] => {
  if (playerState.playMusicInfo.isTempPlay) return [...playerState.tempPlayList]
  const listId = playerState.playInfo.playerListId
  if (!listId) return []
  return getList(listId).map(musicInfo => ({ musicInfo, listId, isTempPlay: false }))
}

const Row = memo(({ item, index, active, onPress }: {
  item: LX.Player.PlayMusicInfo
  index: number
  active: boolean
  onPress: (item: LX.Player.PlayMusicInfo, index: number) => void
}) => {
  const info = getDisplayInfo(item.musicInfo)
  return (
    <TouchableOpacity style={[styles.row, active ? styles.rowActive : null]} activeOpacity={0.6} onPress={() => { onPress(item, index) }}>
      {
        active
          ? <View style={styles.activeFlag}><Icon name="play-outline" size={14} color={HAMMER_RED} /></View>
          : <View style={styles.activeFlag}><Text size={12} color={HAMMER_SUB}>{index + 1}</Text></View>
      }
      <RNImage style={styles.pic} source={info.picUrl ? { uri: info.picUrl } : SmartisanImages.noCover} />
      <View style={styles.info}>
        <Text size={15} color={active ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1}>{info.name}</Text>
        <Text style={styles.sub} size={12} color={HAMMER_SUB} numberOfLines={1}>{info.singer}</Text>
      </View>
    </TouchableOpacity>
  )
})

const Queue = ({ onClose }: { onClose: () => void }) => {
  const t = useI18n()
  const [list, setList] = useState<LX.Player.PlayMusicInfo[]>(readQueue)
  const currentId = playerState.playMusicInfo.musicInfo?.id ?? null

  useEffect(() => {
    const update = () => { setList(readQueue()) }

    global.state_event.on('playMusicInfoChanged', update)
    global.state_event.on('playInfoChanged', update)
    global.state_event.on('playTempPlayListChanged', update)
    global.state_event.on('mylistToggled', update)

    return () => {
      global.state_event.off('playMusicInfoChanged', update)
      global.state_event.off('playInfoChanged', update)
      global.state_event.off('playTempPlayListChanged', update)
      global.state_event.off('mylistToggled', update)
    }
  }, [])

  const handlePlay = useCallback((item: LX.Player.PlayMusicInfo) => {
    const targetId = item.musicInfo.id
    if (targetId == null) return
    const listId = item.listId
    if (!listId) return
    const musics = getList(listId)
    const index = musics.findIndex(m => m.id == targetId)
    if (index < 0) {
      onClose()
      return
    }
    void playList(listId, index)
    onClose()
  }, [onClose])

  const renderItem = useCallback(({ item, index }: { item: LX.Player.PlayMusicInfo, index: number }) => {
    return <Row item={item} index={index} active={currentId != null && currentId == getDisplayInfo(item.musicInfo).id} onPress={handlePlay} />
  }, [currentId, handlePlay])

  return (
    list.length
      ? (
        <FlatList
          style={styles.list}
          data={list}
          keyExtractor={(item, index) => `${String(item.musicInfo.id)}-${item.listId}-${index}`}
          renderItem={renderItem}
          initialNumToRender={14}
          windowSize={8}
          removeClippedSubviews
        />
        )
      : <EmptyView text={t('no_item')} icon={null} paddingTop={60} />
  )
}

const Settings = ({ direction }: { direction: 'vertical' | 'horizontal' }) => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.settingsContent} onStartShouldSetResponder={() => true}>
        <SettingLyricProgress />
        <SettingVolume />
        <SettingPlaybackRate />
        <SettingLrcFontSize direction={direction} />
        <SettingLrcAlign />
      </View>
    </ScrollView>
  )
}

/**
 * 播放队列弹层：上半「队列」（当前列表 + 当前播放高亮 + 点击跳播），
 * 下半「设置」（原来的播放器设置，全部沿用）。
 * 播放页右上角的播放列表图标打开的就是这个。
 */
export default forwardRef<PlayQueuePopupType, PlayQueuePopupProps>(({ direction, ...props }, ref) => {
  const t = useI18n()
  const [visible, setVisible] = useState(false)
  const [tab, setTab] = useState<'queue' | 'setting'>('queue')
  const popupRef = useRef<PopupType>(null)

  const close = useCallback(() => { popupRef.current?.setVisible(false) }, [])

  useImperativeHandle(ref, () => ({
    show() {
      setTab('queue')
      if (visible) popupRef.current?.setVisible(true)
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          popupRef.current?.setVisible(true)
        })
      }
    },
  }))

  const tabs = useMemo(() => ([
    { id: 'queue' as const, label: t('play_queue_tab_list') },
    { id: 'setting' as const, label: t('play_queue_tab_setting') },
  ]), [t])

  return (
    visible
      ? (
        <Popup ref={popupRef} title={t('play_queue_title')} {...props}>
          <View style={styles.tabBar}>
            {tabs.map(item => {
              const active = tab === item.id
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.tabBtn, active ? styles.tabBtnActive : null]}
                  activeOpacity={0.6}
                  onPress={() => { setTab(item.id) }}
                >
                  <Text size={14} color={active ? '#ffffff' : HAMMER_TEXT} style={active ? styles.tabTextActive : undefined}>{item.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {tab == 'queue' ? <Queue onClose={close} /> : <Settings direction={direction} />}
        </Popup>
        )
      : null
  )
})

const styles = createStyle({
  tabBar: {
    flexDirection: 'row',
    height: 38,
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  tabBtn: {
    height: 26,
    paddingLeft: 14,
    paddingRight: 14,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: HAMMER_ACTIVE_BG,
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    height: 56,
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  rowActive: {
    backgroundColor: '#f2f2f2',
  },
  activeFlag: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pic: {
    width: 40,
    height: 40,
    borderRadius: 2,
    marginLeft: 4,
  },
  info: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 12,
  },
  sub: {
    marginTop: 3,
  },
  scrollView: {
    backgroundColor: '#ffffff',
  },
  settingsContent: {
    paddingBottom: 4,
  },
})
