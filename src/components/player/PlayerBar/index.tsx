import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { useKeyboard } from '@/utils/hooks'

import Pic from './components/Pic'
import Title from './components/Title'
import PlayInfo from './components/PlayInfo'
import ControlBtn from './components/ControlBtn'
import { useProgress } from '@/store/player/hook'
import { useSettingValue } from '@/store/setting/hook'
import { createStyle } from '@/utils/tools'


export default memo(({ isHome = false }: { isHome?: boolean }) => {
  const { keyboardShown } = useKeyboard()
  const autoHidePlayBar = useSettingValue('common.autoHidePlayBar')
  const progress = useProgress().progress

  const playerComponent = useMemo(() => (
    <View style={styles.container}>
      <Pic isHome={isHome} />
      <View style={styles.center}>
        <Title isHome={isHome} />
        <PlayInfo isHome={isHome} />
      </View>
      <View style={styles.right}>
        <ControlBtn />
      </View>
      <View
        style={{
          ...styles.progressFill,
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
        }}
      />
    </View>
  ), [isHome, progress])

  return autoHidePlayBar && keyboardShown ? null : playerComponent
})


const styles = createStyle({
  container: {
    width: '100%',
    height: 58,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
    // 锤子 shape_translucent_bg: corners radius 4dp + solid #80FFFFFF（半透明白叠在 tabbar 渐变上）
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // 锤子 activity_main.xml 的 view_m1（@color/listBg = #ededed）
    borderTopWidth: 0.5,
    borderTopColor: '#ededed',
    elevation: 10,
  },
  left: {
    flexGrow: 0,
    flexShrink: 0,
  },
  center: {
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 4,
    height: '100%',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 1.5,
    backgroundColor: '#E64040',
  },
})
