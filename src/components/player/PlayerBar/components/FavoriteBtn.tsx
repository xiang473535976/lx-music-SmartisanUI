import { memo, useEffect, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

import { SmartisanImages } from '@/resources/smartisan'
import { LIST_IDS } from '@/config/constant'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { collectMusic, uncollectMusic } from '@/core/player/player'
import { getListMusics } from '@/core/list'

// 锤子迷你条收藏按钮：48x58dp 点击区，图标 26dp
const BTN_WIDTH = 44
const ICON_SIZE = 26

const styles = StyleSheet.create({
  btn: {
    width: BTN_WIDTH,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default memo(() => {
  const musicInfo = usePlayerMusicInfo()
  const [isLove, setIsLove] = useState(false)

  useEffect(() => {
    const id = musicInfo.id
    if (!id) {
      setIsLove(false)
      return
    }
    let cancelled = false
    void getListMusics(LIST_IDS.LOVE).then(list => {
      if (cancelled) return
      setIsLove(list.some(m => m.id == id))
    })
    return () => { cancelled = true }
  }, [musicInfo.id])

  const handlePress = () => {
    if (!musicInfo.id) return
    if (isLove) {
      uncollectMusic()
      setIsLove(false)
    } else {
      collectMusic()
      setIsLove(true)
    }
  }

  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={handlePress}>
      <Image
        source={isLove ? SmartisanImages.heartOn : SmartisanImages.heartOff}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})
