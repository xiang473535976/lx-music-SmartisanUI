import playerActions from '@/store/player/action'
import playerState from '@/store/player/state'
import { getPlayHistory, savePlayHistory } from '@/utils/data'


/**
 * 将歌曲添加到已播放列表
 * @param playMusicInfo playMusicInfo对象
 */
export const addPlayedList = (playMusicInfo: LX.Player.PlayMusicInfo) => {
  playerActions.addPlayedList(playMusicInfo)
}
/**
 * 将歌曲从已播放列表移除
 * @param index 歌曲位置
 */
export const removePlayedList = (index: number) => {
  playerActions.removePlayedList(index)
}
/**
 * 清空已播放列表
 */
export const clearPlayedList = () => {
  playerActions.clearPlayedList()
}

/**
 * 将歌曲添加到播放历史（持久化，与 playedList 分离）
 * @param playMusicInfo playMusicInfo对象
 */
export const addPlayHistory = (playMusicInfo: LX.Player.PlayMusicInfo) => {
  if (playMusicInfo.isTempPlay) return
  playerActions.addPlayHistory(playMusicInfo)
  savePlayHistory([...playerState.playHistory])
}
/**
 * 将歌曲从播放历史移除
 * @param index 歌曲位置
 */
export const removePlayHistory = (index: number) => {
  playerActions.removePlayHistory(index)
  savePlayHistory([...playerState.playHistory])
}
/**
 * 清空播放历史
 */
export const clearPlayHistory = () => {
  playerActions.clearPlayHistory()
  savePlayHistory([])
}
/**
 * 启动时恢复播放历史
 */
export const restorePlayHistory = async() => {
  const list = await getPlayHistory()
  if (list?.length) playerActions.setPlayHistory(list)
}
