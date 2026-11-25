import { createStyle } from '@/utils/tools'
import { View } from 'react-native'
import MusicList from './MusicList'

/**
 * 「我的列表」页。
 * 早期列表切换与管理都塞在左侧抽屉里（点「管理列表」才拉出来），
 * 现在切换用顶部 chip 条、管理用「更多」弹层，抽屉整个去掉。
 */
export default () => {
  return (
    <View style={styles.container}>
      <MusicList />
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
})
