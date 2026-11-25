import { memo, useRef } from 'react'

import { View, StyleSheet, TouchableOpacity, Image as RNImage } from 'react-native'

import { pop } from '@/navigation'
import StatusBar from '@/components/common/StatusBar'
import { usePlayerMusicInfo } from '@/store/player/hook'
import Text from '@/components/common/Text'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import commonState from '@/store/common/state'
import PlayQueuePopup, { type PlayQueuePopupType } from '../../components/PlayQueuePopup'
import { useStatusbarHeight } from '@/store/common/hook'
import { SmartisanImages } from '@/resources/smartisan'

// 锤子 play_activity.xml：view_title_bg 48dp；iv_play_down 52×45dp（marginStart 4dp）；
// tv_song_name 18sp bold + maxLength 22 + 跑马灯；tv_artist_name 10sp + maxLength 18；
// iv_favorite_list 52×45dp（marginEnd 4dp，此刻用作设置入口）
export const HEADER_HEIGHT = 48

const TITLE_COLOR = '#333333'
const ARTIST_COLOR = '#5B5B5B'

const Title = () => {
  const musicInfo = usePlayerMusicInfo()

  return (
    <View style={styles.titleContent} pointerEvents="none">
      <Text numberOfLines={1} style={styles.title} size={18} color={TITLE_COLOR}>{musicInfo.name}</Text>
      <Text numberOfLines={1} style={styles.artist} size={10} color={ARTIST_COLOR}>{musicInfo.singer}</Text>
    </View>
  )
}

export default memo(() => {
  const popupRef = useRef<PlayQueuePopupType>(null)
  const statusBarHeight = useStatusbarHeight()

  const back = () => {
    void pop(commonState.componentIds.playDetail!)
  }
  const showSetting = () => {
    popupRef.current?.show()
  }

  return (
    <View style={{ height: HEADER_HEIGHT + statusBarHeight, paddingTop: statusBarHeight }} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_header}>
      <StatusBar />
      <View style={styles.container}>
        <TouchableOpacity style={[styles.sideBtn, styles.sideBtnLeft]} activeOpacity={0.6} onPress={back}>
          <RNImage source={SmartisanImages.playingBack} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Title />
        <TouchableOpacity style={[styles.sideBtn, styles.sideBtnRight]} activeOpacity={0.6} onPress={showSetting}>
          <RNImage source={SmartisanImages.playingList} style={styles.settingIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <PlayQueuePopup ref={popupRef} direction="vertical" />
    </View>
  )
})


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  sideBtn: {
    width: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  sideBtnLeft: {
    marginLeft: 2,
  },
  sideBtnRight: {
    marginRight: 2,
  },
  // 锤子 iv_play_down / iv_favorite_list 都是 52x45dp 的 centerCrop 位图（162x135，
  // alpha 有效区 144x98）。用 contain 显示时要想让可见框达到真机实测的 133x89px，
  // 位图需要 54x45dp（54/1.2 = 45，可见宽 54*0.889 = 48dp = 132px）。
  backIcon: {
    width: 54,
    height: 45,
  },
  settingIcon: {
    width: 54,
    height: 45,
  },
  titleContent: {
    flex: 1,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  artist: {
    marginTop: 2,
  },
})
