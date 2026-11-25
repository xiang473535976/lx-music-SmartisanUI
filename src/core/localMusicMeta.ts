import { getData, saveData } from '@/plugins/storage'
import playerState from '@/store/player/state'
import { throttle } from '@/utils/common'
import { log } from '@/utils/log'
import { compareByPinyin } from '@/utils/pinyin'

// 本地歌曲的评分、播放次数、添加时间等附加信息（MediaStore 里没有这些字段）
const STORAGE_KEY = '@local_music_meta'

export interface LocalMusicMeta {
  /** 评分 0-5，0 表示未评分 */
  rating: number
  /** 播放次数 */
  playCount: number
  /** 添加时间（毫秒时间戳），0 表示未知 */
  addTime: number
}

type MetaMap = Record<string, LocalMusicMeta>

const DEFAULT_META: LocalMusicMeta = { rating: 0, playCount: 0, addTime: 0 }

let metaMap: MetaMap = {}
let inited = false
let initPromise: Promise<void> | null = null

const listeners = new Set<() => void>()

const saveMetaThrottle = throttle(() => {
  void saveData(STORAGE_KEY, metaMap).catch((err: any) => {
    log.error(err?.stack ?? String(err))
  })
}, 2000)

const emit = () => {
  for (const listener of listeners) listener()
}

const ensureMeta = (filePath: string): LocalMusicMeta => {
  let meta = metaMap[filePath]
  if (!meta) {
    meta = { ...DEFAULT_META }
    metaMap[filePath] = meta
  }
  return meta
}

/**
 * 读取附加信息，并监听播放事件统计播放次数（需在启动时调用一次）
 */
export const initLocalMusicMeta = async(): Promise<void> => {
  if (!initPromise) {
    initPromise = getData<MetaMap>(STORAGE_KEY).then(data => {
      if (data && typeof data == 'object') metaMap = data
    }).catch((err: any) => {
      log.error(err?.stack ?? String(err))
    }).finally(() => {
      inited = true
    })
    global.app_event.on('playerLoadstart', () => {
      const musicInfo = playerState.playMusicInfo.musicInfo
      if (!musicInfo || !('source' in musicInfo) || musicInfo.source != 'local') return
      const filePath = musicInfo.meta.filePath
      if (!filePath) return
      addLocalMusicPlayCount(filePath)
    })
  }
  await initPromise
}

export const isLocalMusicMetaInited = () => inited

export const subscribeLocalMusicMeta = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getLocalMusicMeta = (filePath: string): LocalMusicMeta => metaMap[filePath] ?? DEFAULT_META

/**
 * 设置评分（0 表示取消评分）
 */
export const setLocalMusicRating = (filePath: string, rating: number) => {
  const meta = ensureMeta(filePath)
  const next = Math.max(0, Math.min(5, Math.round(rating)))
  if (meta.rating == next) return
  meta.rating = next
  saveMetaThrottle()
  emit()
}

/**
 * 播放次数 +1
 */
export const addLocalMusicPlayCount = (filePath: string) => {
  const meta = ensureMeta(filePath)
  meta.playCount++
  saveMetaThrottle()
  emit()
}

/**
 * 记录添加时间（仅在未知时写入，已有值不覆盖）
 * @param items addTime 为扫描到的 MediaStore dateAdded（毫秒），不传则用当前时间
 */
export const setLocalMusicAddTimes = (items: Array<{ filePath: string, addTime?: number }>) => {
  const now = Date.now()
  let changed = false
  for (const item of items) {
    if (!item.filePath) continue
    const meta = ensureMeta(item.filePath)
    if (meta.addTime) continue
    meta.addTime = item.addTime && item.addTime > 0 ? item.addTime : now
    changed = true
  }
  if (changed) {
    saveMetaThrottle()
    emit()
  }
}

export type LocalMusicSortType = 'name' | 'rating' | 'playCount' | 'addTime'

/**
 * 按评分/播放次数/添加时间排序（name 排序由 A-Z 分组列表负责，这里原样返回）
 */
export const sortLocalSongs = (songs: LX.Music.MusicInfoLocal[], sortType: LocalMusicSortType): LX.Music.MusicInfoLocal[] => {
  if (sortType == 'name') return songs
  const list = [...songs]
  list.sort((a, b) => {
    const metaA = getLocalMusicMeta(a.meta.filePath)
    const metaB = getLocalMusicMeta(b.meta.filePath)
    let diff = 0
    switch (sortType) {
      case 'rating':
        diff = metaB.rating - metaA.rating
        break
      case 'playCount':
        diff = metaB.playCount - metaA.playCount
        break
      default:
        diff = metaB.addTime - metaA.addTime
        break
    }
    return diff || compareByPinyin(a.name, b.name)
  })
  return list
}
