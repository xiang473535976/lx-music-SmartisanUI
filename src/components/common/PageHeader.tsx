import { memo } from 'react'
import { Image as RNImage, StyleSheet, TouchableOpacity, View } from 'react-native'

import StatusBar from '@/components/common/StatusBar'
import Text from '@/components/common/Text'
import { SmartisanImages } from '@/resources/smartisan'
import { useStatusbarHeight } from '@/store/common/hook'
import { createStyle } from '@/utils/tools'

// 锤子标题栏高度（music_toolbar.xml / play_activity.xml view_title_bg 均 48dp）
export const HEADER_HEIGHT = 48

const HAMMER_LINE = '#ededed'

/**
 * 二级页统一标题栏：返回箭头（自绘 chevron 位图）+ 居中 18sp bold 标题，
 * 可选右侧操作位。全站二级页共用，避免各页各写一套导致箭头尺寸/形态不一致。
 */
export default memo(({
  title,
  onBack,
  rightSlot,
}: {
  title: string
  onBack: () => void
  rightSlot?: React.ReactNode
}) => {
  const statusBarHeight = useStatusbarHeight()

  return (
    <View style={{
      ...styles.header,
      height: HEADER_HEIGHT + statusBarHeight,
      paddingTop: statusBarHeight,
      backgroundColor: '#ffffff',
      borderBottomColor: HAMMER_LINE,
    }}>
      <StatusBar />
      <View style={styles.row}>
        <TouchableOpacity style={[styles.sideBtn, styles.sideBtnLeft]} activeOpacity={0.6} onPress={onBack}>
          <RNImage source={SmartisanImages.playingBackArrow} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.titleWrap} pointerEvents="none">
          <Text size={18} style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.sideBtnRight}>{rightSlot}</View>
      </View>
    </View>
  )
})

const styles = createStyle({
  header: {
    width: '100%',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideBtn: {
    width: 56,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  sideBtnLeft: {
    marginLeft: 2,
  },
  sideBtnRight: {
    // titleWrap 是 absolute 定位、不占 flex 空间，
    // 右侧槽位需要自己顶到最右边，否则会紧贴在返回按钮后面
    marginLeft: 'auto',
    marginRight: 2,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
})
