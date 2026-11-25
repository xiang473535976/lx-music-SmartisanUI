import { memo, useEffect, useState } from 'react'
import { Image, TouchableOpacity, type ImageStyle, type ViewStyle } from 'react-native'

import { SmartisanImages } from '@/resources/smartisan'
import { LIST_IDS } from '@/config/constant'
import { useIsPlay, usePlayerMusicInfo } from '@/store/player/hook'
import { collectMusic, playNext, playPrev, togglePlay, uncollectMusic } from '@/core/player/player'
import { getListMusics } from '@/core/list'

// 锤子音乐迷你条按钮（res/layout/music_tabbar_smartisan.xml 实测）：
// 收藏 48dp / 上一首 48dp / 播放 45dp / 下一首 48dp，
// 位图 playing_*.png 自带白色正圆底与投影，直接 contain 铺满即可。
const HEART_SIZE = 48
const SIDE_SIZE = 48
const PLAY_SIZE = 45

const btn = (size: number): ViewStyle => ({
  width: size,
  height: 58, // 整条 58dp，按钮垂直居中
  alignItems: 'center',
  justifyContent: 'center',
})
const img = (size: number): ImageStyle => ({
  width: size,
  height: size,
})

const FavoriteBtn = memo(() => {
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
    <TouchableOpacity style={btn(HEART_SIZE)} activeOpacity={0.6} onPress={handlePress}>
      <Image
        source={isLove ? SmartisanImages.playingHeartOn : SmartisanImages.playingHeartOff}
        style={img(HEART_SIZE)}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})

const PlayPrevBtn = memo(() => (
  <TouchableOpacity style={btn(SIDE_SIZE)} activeOpacity={0.5} onPress={() => { void playPrev() }}>
    <Image source={SmartisanImages.playingPrev} style={img(SIDE_SIZE)} resizeMode="contain" />
  </TouchableOpacity>
))

const PlayNextBtn = memo(() => (
  <TouchableOpacity style={btn(SIDE_SIZE)} activeOpacity={0.5} onPress={() => { void playNext() }}>
    <Image source={SmartisanImages.playingNext} style={img(SIDE_SIZE)} resizeMode="contain" />
  </TouchableOpacity>
))

const TogglePlayBtn = memo(() => {
  const isPlay = useIsPlay()

  return (
    <TouchableOpacity style={btn(PLAY_SIZE)} activeOpacity={0.5} onPress={togglePlay}>
      <Image
        source={isPlay ? SmartisanImages.playingPause : SmartisanImages.playingPlay}
        style={img(PLAY_SIZE)}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})

export default () => (
  <>
    <FavoriteBtn />
    <PlayPrevBtn />
    <TogglePlayBtn />
    <PlayNextBtn />
  </>
)
