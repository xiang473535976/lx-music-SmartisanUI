import { useRef, useImperativeHandle, forwardRef, useState, useCallback, memo, useEffect } from 'react'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import Dialog, { type DialogType } from '@/components/common/Dialog'
import { FlatList, ScrollView, TouchableOpacity, View, type FlatListProps as _FlatListProps } from 'react-native'
import { scaleSizeH } from '@/utils/pixelRatio'
import { Icon } from '@/components/common/Icon'
import { useHorizontalMode, useUnmounted } from '@/utils/hooks'
import { useI18n } from '@/lang'
import EmptyView from '@/components/common/EmptyView'
import Button from '@/components/common/Button'
import { useSourceListI18n } from '@/components/SourceSelector'
import { searchMusic } from '@/utils/musicSdk'
import { toNewMusicInfo } from '@/utils'
import { handleShowMusicSourceDetail, handleToggleSource } from './listAction'
import playerState from '@/store/player/state'
import { LIST_IDS } from '@/config/constant'
import { addTempPlayList } from '@/core/player/tempPlayList'
import { playNext } from '@/core/player/player'

type FlatListProps = _FlatListProps<LX.Music.MusicInfoOnline>
const ITEM_HEIGHT = scaleSizeH(56)

// 锤子风配色
const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'
const HAMMER_ACTIVE_BG = '#cdcdcd'
const HAMMER_BTN_BORDER = '#ccdcdbdb'


const Tabs = <T extends LX.OnlineSource>({ list, source, onChangeSource }: {
  list: T[]
  source: T | ''
  onChangeSource: (source: T) => void
}) => {
  const list_t = useSourceListI18n(list)
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <ScrollView ref={scrollViewRef} style={styles.tabContainer} keyboardShouldPersistTaps={'always'} horizontal showsHorizontalScrollIndicator={false}>
      {
        list_t.map(s => (
          <TouchableOpacity
            style={{ ...styles.tabButton, backgroundColor: source == s.action ? HAMMER_ACTIVE_BG : 'transparent' }}
            onPress={() => {
              onChangeSource(s.action as T)
            }}
            key={s.action}
            activeOpacity={0.6}
          >
            <Text size={14} style={source == s.action ? styles.tabButtonTextActive : styles.tabButtonText} color={source == s.action ? '#ffffff' : HAMMER_TEXT}>{s.label}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  )
}

const Empty = ({ loading, error, onReload }: { loading: boolean, error: boolean, onReload: () => void }) => {
  const t = useI18n()
  const label = loading
    ? t('list_loading')
    : error
      ? t('list_error')
      : t('no_item')
  return (
    error
      ? (
          <View style={styles.noitem}>
            <Text onPress={onReload} size={13} color={HAMMER_SUB}>{label}</Text>
          </View>
        )
      : <EmptyView text={label} icon={loading ? 'music_time' : null} />
  )
}

const ListItem = memo(({ info, onPlay, onOpenDetail }: {
  info: LX.Music.MusicInfoOnline
  onPlay: (info: LX.Music.MusicInfoOnline) => void
  onOpenDetail: (info: LX.Music.MusicInfoOnline) => void
}) => {
  return (
    <View style={{ ...styles.listItem, height: ITEM_HEIGHT }} onStartShouldSetResponder={() => true}>
      <View style={styles.listItemInfo}>
        <Text color={HAMMER_TEXT} size={14} numberOfLines={1}>{info.name}</Text>
        <View style={styles.listItemAlbum}>
          <Text color={HAMMER_SUB} size={12} numberOfLines={1}>
            {info.singer}
            {
              info.meta.albumName ? (
                <Text color={HAMMER_SUB} size={12} numberOfLines={1}> ({info.meta.albumName})</Text>
              ) : null
            }
          </Text>
        </View>
      </View>
      <View style={styles.listItemLabel}>
        <Text style={styles.listItemLabelText} size={12} color={HAMMER_SUB}>{info.interval}</Text>
      </View>
      <View style={styles.listItemBtns}>
        <Button style={styles.listItemBtn} onPress={() => { onOpenDetail(info) }}>
          <Icon name="share" color="#939396" size={18} />
        </Button>
        <Button style={styles.listItemBtn} onPress={() => { onPlay(info) }}>
          <Icon name="play" color={HAMMER_RED} size={18} />
        </Button>
      </View>
    </View>
  )
}, (prevProps, nextProps) => {
  return prevProps.info === nextProps.info
})

const List = ({ source, lists, onPlay }: {
  source: LX.OnlineSource | ''
  lists: Partial<Record<LX.OnlineSource, LX.Music.MusicInfoOnline[]>>
  onPlay: (info: LX.Music.MusicInfoOnline) => void
}) => {
  const [list, setList] = useState<LX.Music.MusicInfoOnline[]>([])
  const isFirstRef = useRef(true)
  useEffect(() => {
    if (isFirstRef.current) {
      setList(lists[source as LX.OnlineSource] ?? [])
      isFirstRef.current = false
      return
    }
    requestAnimationFrame(() => {
      setList(lists[source as LX.OnlineSource] ?? [])
    })
  }, [lists, source])

  const openDetail = useCallback((musicInfo: LX.Music.MusicInfoOnline) => {
    void handleShowMusicSourceDetail(musicInfo)
  }, [])

  const renderItem = useCallback(({ item }: { item: LX.Music.MusicInfoOnline, index: number }) => {
    return <ListItem info={item} onPlay={onPlay} onOpenDetail={openDetail} />
  }, [onPlay, openDetail])
  const getkey = useCallback<NonNullable<FlatListProps['keyExtractor']>>(item => item.id, [])
  const getItemLayout = useCallback<NonNullable<FlatListProps['getItemLayout']>>((data, index) => {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
  }, [])

  return (
    <FlatList
      style={styles.list}
      maxToRenderPerBatch={4}
      windowSize={8}
      removeClippedSubviews={true}
      initialNumToRender={12}
      data={list}
      renderItem={renderItem}
      keyExtractor={getkey}
      getItemLayout={getItemLayout}
    />
  )
}

const SourceDetail = ({ info, onConfirm, toggleSource }: { info: LX.Music.MusicInfo, onConfirm: (info: LX.Music.MusicInfoOnline) => void, toggleSource: LX.Music.MusicInfoOnline | null }) => {
  const isHorizontalMode = useHorizontalMode()
  const t = useI18n()

  return isHorizontalMode ? (
    <View style={styles.detailContainer}>
      <View style={styles.detailContainerX}>
      <View style={styles.detailInfo}>
        <View style={styles.detailInfoName}>
          <Text style={styles.detailInfoNameText} color={HAMMER_TEXT} size={13} numberOfLines={2}>
            {info.name}
          </Text>
          <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_RED}>{info.source}</Text>
          <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_SUB}>{info.interval}</Text>
        </View>
        <View style={styles.listItemAlbum}>
          <Text color={HAMMER_SUB} size={12} numberOfLines={1}>
            {info.singer}
            {
              info.meta.albumName ? (
                <Text color={HAMMER_SUB} size={12} numberOfLines={1}> ({info.meta.albumName})</Text>
              ) : null
            }
          </Text>
        </View>
      </View>
      {
        toggleSource ? (
          <>
            <Text>→</Text>
            <View style={styles.detailInfo}>
              <View style={styles.detailInfoName}>
                <Text style={styles.detailInfoNameText} color={HAMMER_TEXT} size={13} numberOfLines={2}>
                  {toggleSource.name}
                </Text>
                <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_RED}>{toggleSource.source}</Text>
                <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_SUB}>{toggleSource.interval}</Text>
              </View>
              <View style={styles.listItemAlbum}>
                <Text color={HAMMER_SUB} size={12} numberOfLines={1}>
                  {toggleSource.singer}
                  {
                    toggleSource.meta.albumName ? (
                      <Text color={HAMMER_SUB} size={12} numberOfLines={1}> ({toggleSource.meta.albumName})</Text>
                    ) : null
                  }
                </Text>
              </View>
            </View>
          </>
        ) : null
      }
      </View>
      <Button
        onPress={() => {
          onConfirm(toggleSource!)
        }}
        style={!toggleSource ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        disabled={!toggleSource}
      >
        <Text size={14} color={toggleSource ? HAMMER_TEXT : '#b0b0b0'} style={styles.buttonText}>{t('music_toggle__confirm')}</Text>
      </Button>
    </View>
  ) : (
    <View style={styles.detailContainer}>
      <View style={styles.detailContainerY}>
        <View style={styles.detailInfo}>
          <View style={styles.detailInfoName}>
            <Text style={styles.detailInfoNameText} color={HAMMER_TEXT} size={14} numberOfLines={2}>
              {info.name}
            </Text>
            <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_RED}>{info.source}</Text>
            <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_SUB}>{info.interval}</Text>
          </View>
          <View style={styles.listItemAlbum}>
            <Text color={HAMMER_SUB} size={12} numberOfLines={1}>
              {info.singer}
              {
                info.meta.albumName ? (
                  <Text color={HAMMER_SUB} size={12} numberOfLines={1}> ({info.meta.albumName})</Text>
                ) : null
              }
            </Text>
          </View>
        </View>
        {
          toggleSource ? (
            <>
              <Text>↓</Text>
              <View style={styles.detailInfo}>
                <View style={styles.detailInfoName}>
                  <Text style={styles.detailInfoNameText} color={HAMMER_TEXT} size={14} numberOfLines={2}>
                    {toggleSource.name}
                  </Text>
                  <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_RED}>{toggleSource.source}</Text>
                  <Text style={styles.detailInfoLabelText} size={12} color={HAMMER_SUB}>{toggleSource.interval}</Text>
                </View>
                <View style={styles.listItemAlbum}>
                  <Text color={HAMMER_SUB} size={12} numberOfLines={1}>
                    {toggleSource.singer}
                    {
                      toggleSource.meta.albumName ? (
                        <Text color={HAMMER_SUB} size={12} numberOfLines={1}> ({toggleSource.meta.albumName})</Text>
                      ) : null
                    }
                  </Text>
                </View>
              </View>
            </>
          ) : null
        }
      </View>
      <Button
        onPress={() => {
          onConfirm(toggleSource!)
        }}
        style={(!toggleSource || toggleSource.id == info.id) ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        disabled={!toggleSource || toggleSource.id == info.id}
      >
        <Text size={14} color={(!toggleSource || toggleSource.id == info.id) ? '#b0b0b0' : HAMMER_TEXT} style={styles.buttonText}>{t('music_toggle__confirm')}</Text>
      </Button>
    </View>
  )
}


interface ModalType {
  show: (info: SelectInfo) => void
}
const initInfo = {}

const Modal = forwardRef<ModalType, {}>((props, ref) => {
  const infoRef = useRef<SelectInfo>(initInfo as SelectInfo)
  const [sourceInfo, setSourceInfo] = useState<{
    sourceInfo: LX.OnlineSource[]
    lists: Partial<Record<LX.OnlineSource, LX.Music.MusicInfoOnline[]>>
    loading: boolean
    error: boolean
  }>({ sourceInfo: [], lists: {}, loading: false, error: false })
  const [source, setSource] = useState<LX.OnlineSource | ''>('')
  const dialogRef = useRef<DialogType>(null)
  const isUnmountedRef = useUnmounted()
  const [toggleSource, setToggleSource] = useState<LX.Music.MusicInfoOnline | null>(null)

  const handlePlay = useCallback((musicInfo: LX.Music.MusicInfoOnline) => {
    setToggleSource(musicInfo)
    const isPlaying = !!playerState.playMusicInfo.musicInfo
    addTempPlayList([{ listId: LIST_IDS.PLAY_LATER, musicInfo, isTop: true }])
    if (isPlaying) void playNext()
  }, [])

  const loadData = useCallback((selectInfo: SelectInfo = infoRef.current) => {
    setSourceInfo({ sourceInfo: [], lists: {}, loading: true, error: false })
    searchMusic({
      name: selectInfo.musicInfo.name,
      singer: selectInfo.musicInfo.singer,
      source: '',
    }).then((result: Array<{ source: LX.OnlineSource, list: LX.Music.MusicInfoOnline[] }>) => {
      if (isUnmountedRef.current) return
      const tags: LX.OnlineSource[] = []
      const lists: Partial<Record<LX.OnlineSource, LX.Music.MusicInfoOnline[]>> = {}
      for (const s of result) {
        tags.push(s.source)
        lists[s.source] = s.list.map(s => toNewMusicInfo(s) as LX.Music.MusicInfoOnline)
      }
      setSourceInfo({ sourceInfo: tags, lists, loading: false, error: false })
      if (tags.length) setSource(tags[0])
    }).catch(() => {
      if (isUnmountedRef.current) return
      setSourceInfo({ ...sourceInfo, error: true })
    })
  }, [isUnmountedRef, sourceInfo])
  useImperativeHandle(ref, () => ({
    show(info) {
      infoRef.current = info
      setSource('')
      loadData(info)
      requestAnimationFrame(() => {
        dialogRef.current?.setVisible(true)
      })
    },
  }))

  const confirmToggleSource = useCallback(async(musicInfo: LX.Music.MusicInfoOnline) => {
    const isClose = await handleToggleSource(infoRef.current.listId, infoRef.current.musicInfo, musicInfo)
    if (isClose) dialogRef.current?.setVisible(false)
  }, [])

  return (
    <Dialog ref={dialogRef}>
      <View style={styles.container}>
        {
          sourceInfo.sourceInfo.length
            ? (<>
                <Tabs
                  list={sourceInfo.sourceInfo}
                  source={source}
                  onChangeSource={setSource}
                />
                <List
                  source={source}
                  lists={sourceInfo.lists}
                  onPlay={handlePlay}
                />
              </>)
            : <Empty loading={sourceInfo.loading} error={sourceInfo.error} onReload={loadData} />
        }
        <SourceDetail info={infoRef.current.musicInfo} onConfirm={confirmToggleSource} toggleSource={toggleSource} />
      </View>
    </Dialog>
  )
})

export interface SelectInfo {
  musicInfo: LX.Music.MusicInfo
  listId: string
}
export interface MusicToggleModalType {
  show: (listInfo: SelectInfo) => void
}

export default forwardRef<MusicToggleModalType, {}>((props, ref) => {
  const musicAddModalRef = useRef<ModalType>(null)
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show(musicInfo) {
      if (visible) musicAddModalRef.current?.show(musicInfo)
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          musicAddModalRef.current?.show(musicInfo)
        })
      }
    },
  }))

  return (
    visible
      ? <Modal ref={musicAddModalRef} />
      : null
  )
})


const styles = createStyle({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    width: 600,
    maxWidth: '100%',
  },
  tabContainer: {
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 6,
  },
  tabButton: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 32,
  },
  tabButtonText: {
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  tabButtonTextActive: {
    textAlign: 'center',
    paddingHorizontal: 2,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
    flexShrink: 1,
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  // sn: {
  //   width: 38,
  //   // fontSize: 12,
  //   textAlign: 'center',
  //   // backgroundColor: 'rgba(0,0,0,0.2)',
  //   paddingLeft: 3,
  //   paddingRight: 3,
  // },
  listItemInfo: {
    flexGrow: 1,
    flexShrink: 1,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    paddingLeft: 15,
    paddingRight: 5,
  },
  listItemAlbum: {
    flexDirection: 'row',
    marginTop: 3,
  },
  listItemLabel: {
    flex: 0,
  },
  listItemLabelText: {
    paddingHorizontal: 5,
  },
  listItemBtns: {
    flex: 0,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
  },
  listItemBtn: {
    padding: 8,
  },

  detailContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  detailContainerY: {
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    gap: 5,
  },
  detailContainerX: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    gap: 5,
    alignItems: 'center',
  },
  detailInfo: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'column',
    // width: '50%',
    justifyContent: 'center',
  },
  detailInfoName: {
    gap: 5,
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 1,
    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
  detailInfoNameText: {
    // backgroundColor: 'rgba(0,0,0,0.2)',
    flexShrink: 1,
    flexGrow: 0,
  },
  detailInfoLabelText: {
    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
  noitem: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 32,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_BTN_BORDER,
    backgroundColor: '#ffffff',
  },
  buttonDisabled: {
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
  },
  buttonText: {
    fontWeight: 'bold',
  },
})


