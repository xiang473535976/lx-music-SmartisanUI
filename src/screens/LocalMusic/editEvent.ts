/**
 * 「编辑」按钮的轻量事件总线。
 *
 * 标题栏（Header）与列表页（歌曲 / 专辑 / 播放列表）不在同一棵组件树里，
 * 又不想把编辑态提升到全局 store，所以用一个模块级订阅表转达点击。
 */
type Listener = () => void

const listeners = new Set<Listener>()

export const emitEditPress = () => {
  for (const listener of listeners) listener()
}

export const onEditPress = (listener: Listener) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
