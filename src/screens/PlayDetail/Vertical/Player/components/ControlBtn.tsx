import { memo, useEffect, useState } from 'react'
import { TouchableOpacity, View, Image as RNImage } from 'react-native'
import { playNext, playPrev, togglePlay, collectMusic, uncollectMusic } from '@/core/player/player'
import { useIsPlay, usePlayerMusicInfo } from '@/store/player/hook'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { toast } from '@/utils/tools'
import { createStyle } from '@/utils/tools'
import { updateSetting } from '@/core/common'
import { MUSIC_TOGGLE_MODE_LIST, MUSIC_TOGGLE_MODE, LIST_IDS } from '@/config/constant'
import { getListMusics } from '@/core/list'
import { SmartisanImages } from '@/resources/smartisan'

// 锤子 play_activity.xml 里这些 ImageView 的尺寸（52/88/100/88/52dp）包含了位图自身的
// 透明留白（playing_play.png 是 256×261，实心圆只占约 73%；playing_prev.png 是 210×261，
// 实心圆只占约 66%），照抄会让整行超出屏宽。下面的数值是拿真机截图（1080px 宽，density 440）
// 逐像素量出可见圆直径后反算的 dp：模式 56px→60dp、上一首/下一首 146px→80dp、
// 播放 209px→92dp、收藏 106px→56dp。
const MODE_SIZE = 60
const SIDE_SIZE = 80
const PLAY_SIZE = 92
const FAV_SIZE = 56

const ModeBtn = memo(() => {
  const togglePlayMethod = useSettingValue('player.togglePlayMethod')
  const t = useI18n()

  const toggleNextPlayMode = () => {
    let index = MUSIC_TOGGLE_MODE_LIST.indexOf(togglePlayMethod)
    if (++index >= MUSIC_TOGGLE_MODE_LIST.length) index = 0
    const mode = MUSIC_TOGGLE_MODE_LIST[index]
    updateSetting({ 'player.togglePlayMethod': mode })
    let modeName: 'play_list_loop' | 'play_list_random' | 'play_list_order' | 'play_single_loop' | 'play_single'
    switch (mode) {
      case MUSIC_TOGGLE_MODE.listLoop:
        modeName = 'play_list_loop'
        break
      case MUSIC_TOGGLE_MODE.random:
        modeName = 'play_list_random'
        break
      case MUSIC_TOGGLE_MODE.list:
        modeName = 'play_list_order'
        break
      case MUSIC_TOGGLE_MODE.singleLoop:
        modeName = 'play_single_loop'
        break
      default:
        modeName = 'play_single'
        break
    }
    toast(t(modeName))
  }

  // 锤子原版截图里模式图标的字形灰度中位数是 106，而 playing_cycle_on/shuffle_on/repeat_on
  // 三张位图自身的字形灰度是 140–142（比锤子深灰浅约 35），所以这里用 tintColor 压到 #6A6A6A。
  // playing_list 自带白色圆角卡片底，不能染色，单独保留原色。
  const icon = (() => {
    switch (togglePlayMethod) {
      case MUSIC_TOGGLE_MODE.listLoop:
        return { source: SmartisanImages.playingCycleOn, tint: '#6A6A6A' }
      case MUSIC_TOGGLE_MODE.random:
        return { source: SmartisanImages.playingShuffleOn, tint: '#6A6A6A' }
      case MUSIC_TOGGLE_MODE.singleLoop:
        return { source: SmartisanImages.playingRepeatOn, tint: '#6A6A6A' }
      case MUSIC_TOGGLE_MODE.list:
        return { source: SmartisanImages.playingList, tint: undefined }
      default:
        return { source: SmartisanImages.playingRepeatOn, tint: '#6A6A6A' }
    }
  })()

  return (
    <TouchableOpacity style={{ ...styles.btn, width: MODE_SIZE, height: MODE_SIZE }} activeOpacity={0.6} onPress={toggleNextPlayMode}>
      <RNImage
        source={icon.source}
        style={{ width: MODE_SIZE, height: MODE_SIZE, tintColor: icon.tint }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})

const FavBtn = memo(() => {
  const musicInfo = usePlayerMusicInfo()
  const [isLove, setIsLove] = useState(false)

  useEffect(() => {
    let cancelled = false
    void getListMusics(LIST_IDS.LOVE).then(list => {
      if (cancelled) return
      setIsLove(list.some(m => m.id == musicInfo.id))
    })
    return () => { cancelled = true }
  }, [musicInfo.id])

  const handlePress = () => {
    if (isLove) {
      uncollectMusic()
      setIsLove(false)
    } else {
      collectMusic()
      setIsLove(true)
    }
  }

  return (
    <TouchableOpacity style={{ ...styles.btn, width: FAV_SIZE, height: FAV_SIZE }} activeOpacity={0.6} onPress={handlePress}>
      <RNImage
        source={isLove ? SmartisanImages.playingHeartOn : SmartisanImages.playingHeartOff}
        style={{ width: FAV_SIZE, height: FAV_SIZE }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
})

export default memo(() => {
  const isPlay = useIsPlay()

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <ModeBtn />
      </View>
      <TouchableOpacity style={{ ...styles.btn, width: SIDE_SIZE, height: SIDE_SIZE }} activeOpacity={0.6} onPress={() => { void playPrev() }}>
        <RNImage source={SmartisanImages.playingPrev} style={{ width: SIDE_SIZE, height: SIDE_SIZE }} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.btn, width: PLAY_SIZE, height: PLAY_SIZE }} activeOpacity={0.6} onPress={togglePlay}>
        <RNImage
          source={isPlay ? SmartisanImages.playingPause : SmartisanImages.playingPlay}
          style={{ width: PLAY_SIZE, height: PLAY_SIZE }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.btn, width: SIDE_SIZE, height: SIDE_SIZE }} activeOpacity={0.6} onPress={() => { void playNext() }}>
        <RNImage source={SmartisanImages.playingNext} style={{ width: SIDE_SIZE, height: SIDE_SIZE }} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.right}>
        <FavBtn />
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    // 锤子 music_play 的 marginBottom 是 30dp（比 marginTop 大），按钮行整体略偏上
    marginTop: 18,
    marginBottom: 30,
  },
  left: {
    flexGrow: 0,
    flexShrink: 0,
  },
  right: {
    flexGrow: 0,
    flexShrink: 0,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
