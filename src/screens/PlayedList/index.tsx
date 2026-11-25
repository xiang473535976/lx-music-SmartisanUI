import { memo, useCallback, useEffect, useState } from 'react'
import { FlatList, Image as RNImage, TouchableOpacity, View } from 'react-native'

import PageContent from '@/components/PageContent'
import PageHeader from '@/components/common/PageHeader'
import Text from '@/components/common/Text'
import EmptyView from '@/components/common/EmptyView'
import PlayerBar from '@/components/player/PlayerBar'
import { SmartisanImages } from '@/resources/smartisan'
import { useI18n } from '@/lang'
import { pop } from '@/navigation'
import { usePlayerMusicInfo } from '@/store/player/hook'
import playerState from '@/store/player/state'
import { getList } from '@/core/player/playInfo'
import { play, playListById } from '@/core/player/player'
import { clearPlayHistory } from '@/core/player/playedList'
import { confirmDialog, createStyle } from '@/utils/tools'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'
const HAMMER_RED = '#E64040'

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

const Row = memo(({ item, active, onPress }: {
  item: LX.Player.PlayMusicInfo
  active: boolean
  onPress: (item: LX.Player.PlayMusicInfo) => void
}) => {
  const info = getDisplayInfo(item.musicInfo)
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={() => { onPress(item) }}>
      <RNImage style={styles.pic} source={info.picUrl ? { uri: info.picUrl } : SmartisanImages.noCover} />
      <View style={styles.info}>
        <Text size={15} color={active ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1}>{info.name}</Text>
        <Text style={styles.sub} size={12} color={HAMMER_SUB} numberOfLines={1}>{info.singer}</Text>
      </View>
    </TouchableOpacity>
  )
})

/**
 * 播放历史页
 * 数据来自 playerState.playHistory —— 独立持久化的播放历史（见 core/player/playedList.ts 的 addPlayHistory）
 * 按播放顺序 push 到尾部，这里倒序展示，最新的在最上面。
 */
export default memo(({ componentId }: { componentId: string }) => {
  const t = useI18n()
  const currentMusicInfo = usePlayerMusicInfo()
  const [list, setList] = useState<LX.Player.PlayMusicInfo[]>(() => [...playerState.playHistory].reverse())

  useEffect(() => {
    const handleUpdate = (playedList: LX.Player.PlayMusicInfo[]) => {
      setList([...playedList].reverse())
    }

    global.state_event.on('playHistoryChanged', handleUpdate)

    return () => {
      global.state_event.off('playHistoryChanged', handleUpdate)
    }
  }, [])

  const handleBack = useCallback(() => {
    void pop(componentId)
  }, [componentId])

  const handlePlay = useCallback((item: LX.Player.PlayMusicInfo) => {
    const targetId = item.musicInfo.id
    const listMusics = getList(item.listId)
    if (listMusics.some(m => 'id' in m && m.id == targetId)) {
      void playListById(item.listId, String(targetId))
    } else {
      play()
    }
  }, [])

  const handleClear = useCallback(() => {
    void confirmDialog({
      message: t('mine_played_clear_tip'),
      confirmButtonText: t('list_remove_tip_button'),
    }).then(isClear => {
      if (!isClear) return
      clearPlayHistory()
    })
  }, [t])

  const currentId = currentMusicInfo.id == null ? null : String(currentMusicInfo.id)

  const renderItem = useCallback(({ item }: { item: LX.Player.PlayMusicInfo }) => {
    return <Row item={item} active={currentId != null && currentId == getDisplayInfo(item.musicInfo).id} onPress={handlePlay} />
  }, [currentId, handlePlay])

  return (
    <PageContent>
      <PageHeader
        title={t('mine_played_list')}
        onBack={handleBack}
        rightSlot={
          list.length ? (
            <TouchableOpacity style={styles.sideBtnRight} activeOpacity={0.6} onPress={handleClear}>
              <Text size={13} color={HAMMER_SUB}>{t('mine_played_clear')}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      {
        list.length
          ? <FlatList
            style={styles.list}
            data={list}
            keyExtractor={item => String(item.musicInfo.id) + item.listId}
            renderItem={renderItem}
            initialNumToRender={16}
            windowSize={8}
            removeClippedSubviews
          />
          : <EmptyView text={t('no_item')} />
      }
      <PlayerBar />
    </PageContent>
  )
})

const styles = createStyle({
  sideBtnRight: {
    width: 64,
    marginRight: 2,
  },
  list: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    height: 60,
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  pic: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#f2f2f2',
  },
  info: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 12,
  },
  sub: {
    marginTop: 3,
  },
})
