import { addListMusics, createList, getListMusics, setFetchingListStatus } from '@/core/list'
import listState from '@/store/list/state'
import settingState from '@/store/setting/state'
import { log } from '@/utils/log'
import { toast } from '@/utils/tools'
import { formatPlayTime2 } from '@/utils'
import { setLocalMusicAddTimes } from '@/core/localMusicMeta'
import { compareByPinyin } from '@/utils/pinyin'
import { requestAudioPermission, scanMusic, type ScannerMusic } from '@/utils/nativeModules/musicScanner'

/** 本地音乐列表 ID（用户列表） */
export const LOCAL_LIST_ID = 'local_music'

/**
 * 把 MediaStore 扫描结果转换为 LX 的本地歌曲信息
 */
export const buildLocalMusicInfoByScanner = (music: ScannerMusic): LX.Music.MusicInfoLocal => {
  const index = music.path.lastIndexOf('.')
  const fileName = music.path.substring(music.path.lastIndexOf('/') + 1)
  return {
    id: music.path,
    name: music.title || (index > -1 ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName),
    singer: music.artist ?? '',
    source: 'local',
    interval: music.duration > 0 ? formatPlayTime2(Math.round(music.duration / 1000)) : null,
    meta: {
      albumName: music.album ?? '',
      filePath: music.path,
      songId: music.path,
      picUrl: '',
      ext: index > -1 ? music.path.substring(index + 1) : '',
    },
  }
}

/**
 * 获取本地音乐列表（create 为 true 时不存在则创建）
 */
export const getLocalMusicList = async(create = true): Promise<LX.List.UserListInfo | null> => {
  let listInfo = listState.userList.find(l => l.id == LOCAL_LIST_ID)
  if (!listInfo && create) {
    await createList({ id: LOCAL_LIST_ID, name: global.i18n.t('local_music_list_name') })
    listInfo = listState.userList.find(l => l.id == LOCAL_LIST_ID)
  }
  return listInfo ?? null
}

/**
 * 读取本地音乐列表内的歌曲（列表还不存在时返回空数组）
 */
export const getLocalSongs = async(): Promise<LX.Music.MusicInfoLocal[]> => {
  const listInfo = await getLocalMusicList(false)
  if (!listInfo) return []
  const songs = await getListMusics(listInfo.id) as LX.Music.MusicInfoLocal[]
  // 列表里已有的歌曲补齐添加时间（MediaStore 的 dateAdded 在扫描时写入，这里兜底）
  setLocalMusicAddTimes(songs.map(song => ({ filePath: song.meta.filePath })))
  return songs
}

export interface ScanLocalMusicResult {
  /** 设备上扫描到的歌曲总数 */
  total: number
  /** 本次新增的歌曲数 */
  added: number
}

/**
 * 扫描设备本地音乐并添加到本地音乐列表（已存在的歌曲不会重复添加）
 */
export const scanLocalMusic = async(): Promise<ScanLocalMusicResult | null> => {
  const listInfo = await getLocalMusicList()
  if (!listInfo) {
    toast(global.i18n.t('list_scan_local_music_failed_tip'), 'long')
    return null
  }
  setFetchingListStatus(listInfo.id, true)
  try {
    const granted = await requestAudioPermission()
    if (!granted) {
      toast(global.i18n.t('list_scan_local_music_permission_tip'), 'long')
      return null
    }
    const musics = await scanMusic()
    // 记录文件的添加时间（用于「添加时间」排序）
    setLocalMusicAddTimes(musics.map(m => ({ filePath: m.path, addTime: m.dateAdded * 1000 })))
    if (!musics.length) {
      toast(global.i18n.t('list_scan_local_music_empty_tip'), 'long')
      return { total: 0, added: 0 }
    }
    const existIds = new Set((await getListMusics(listInfo.id)).map(m => m.id))
    const newMusics = musics.filter(m => !existIds.has(m.path)).map(buildLocalMusicInfoByScanner)
    if (!newMusics.length) {
      toast(global.i18n.t('list_scan_local_music_no_new_tip', { total: musics.length }), 'long')
      return { total: musics.length, added: 0 }
    }
    await addListMusics(listInfo.id, newMusics, settingState.setting['list.addMusicLocationType'])
    toast(global.i18n.t('list_scan_local_music_success_tip', { total: newMusics.length }), 'long')
    return { total: musics.length, added: newMusics.length }
  } catch (err: any) {
    log.error(err?.stack ?? String(err))
    toast(global.i18n.t('list_scan_local_music_failed_tip'), 'long')
    return null
  } finally {
    setFetchingListStatus(listInfo.id, false)
  }
}

export const UNKNOWN_ARTIST = ''

export interface LocalMusicGroup {
  key: string
  name: string
  songs: LX.Music.MusicInfoLocal[]
}

const groupSongs = (songs: LX.Music.MusicInfoLocal[], getKey: (song: LX.Music.MusicInfoLocal) => string, unknownName: string): LocalMusicGroup[] => {
  const map = new Map<string, LX.Music.MusicInfoLocal[]>()
  for (const song of songs) {
    const key = getKey(song).trim()
    const list = map.get(key)
    if (list) list.push(song)
    else map.set(key, [song])
  }
  return [...map.entries()].map(([key, list]) => ({
    key,
    name: key || unknownName,
    songs: list,
  })).sort((a, b) => {
    if (!a.key) return 1
    if (!b.key) return -1
    // 用拼音排序，中文艺术家/专辑名会排到对应拼音字母的位置（周杰伦 -> Z）
    return compareByPinyin(a.key, b.key)
  })
}

/**
 * 按艺术家分组
 */
export const groupByArtist = (songs: LX.Music.MusicInfoLocal[]): LocalMusicGroup[] => {
  return groupSongs(songs, song => song.singer, global.i18n.t('local_music_unknown_artist'))
}

/**
 * 按专辑分组
 */
export const groupByAlbum = (songs: LX.Music.MusicInfoLocal[]): LocalMusicGroup[] => {
  return groupSongs(songs, song => song.meta.albumName, global.i18n.t('local_music_unknown_album'))
}
