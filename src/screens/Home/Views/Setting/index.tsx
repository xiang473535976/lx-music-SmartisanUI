import { useHorizontalMode } from '@/utils/hooks'
import Vertical from './Vertical'
import Horizontal from './Horizontal'

export type { SettingScreenIds } from './Main'

// 设置已经是独立页面（由「我的」push 进入的 SettingScreen），
// 返回操作交给 react-native-navigation 的 pop 处理，
// 这里不能再挂 hardwareBackPress 去切首页 Tab —— 否则按返回键只会换 Tab，页面不退出。
export default () => {
  const isHorizontalMode = useHorizontalMode()

  return isHorizontalMode
    ? <Horizontal />
    : <Vertical />
}
