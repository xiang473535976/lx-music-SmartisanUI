import { memo } from 'react'
import { View } from 'react-native'

import ControlBtn from './components/ControlBtn'
import VolumeBar from './components/VolumeBar'
import { createStyle } from '@/utils/tools'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'

// 锤子播放页底部区：控制按钮行（循环 52 / 上一首 88 / 播放 100 / 下一首 88 / 收藏 52）→ 音量条 32dp
export default memo(() => {
  return (
    <View style={styles.container} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_player}>
      <ControlBtn />
      <VolumeBar />
    </View>
  )
})

const styles = createStyle({
  container: {
    flex: 0,
    width: '100%',
    paddingBottom: 10,
    flexDirection: 'column',
  },
})
