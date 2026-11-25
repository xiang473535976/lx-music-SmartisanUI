import { memo, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { LIST_ITEM_HEIGHT } from '@/config/constant'
import { Icon } from '@/components/common/Icon'
import { createStyle, type RowInfo } from '@/utils/tools'
import { useAssertApiSupport } from '@/store/common/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import Text from '@/components/common/Text'

export const ITEM_HEIGHT = scaleSizeH(LIST_ITEM_HEIGHT)

const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

/**
 * 锤子风歌曲行：白底、左序号/红色播放标、曲名深灰 15sp、来源+歌手 12sp 浅灰、
 * 右侧时长灰字 + 三点菜单，行间发丝线。
 */
export default memo(({ item, index, activeIndex, onPress, onShowMenu, onLongPress, selectedList, rowInfo, isShowAlbumName, isShowInterval }: {
  item: LX.Music.MusicInfo
  index: number
  activeIndex: number
  onPress: (item: LX.Music.MusicInfo, index: number) => void
  onLongPress: (item: LX.Music.MusicInfo, index: number) => void
  onShowMenu: (item: LX.Music.MusicInfo, index: number, position: { x: number, y: number, w: number, h: number }) => void
  selectedList: LX.Music.MusicInfo[]
  rowInfo: RowInfo
  isShowAlbumName: boolean
  isShowInterval: boolean
}) => {
  const isSelected = selectedList.includes(item)
  const isSupported = useAssertApiSupport(item.source)
  const moreButtonRef = useRef<TouchableOpacity>(null)
  const handleShowMenu = () => {
    if (moreButtonRef.current?.measure) {
      moreButtonRef.current.measure((fx, fy, width, height, px, py) => {
        onShowMenu(item, index, { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
      })
    }
  }
  const active = activeIndex == index

  const singer = `${item.singer}${isShowAlbumName && item.meta.albumName ? ` · ${item.meta.albumName}` : ''}`

  return (
    <View style={{
      ...styles.listItem,
      width: rowInfo.rowWidth,
      height: ITEM_HEIGHT,
      backgroundColor: isSelected ? '#f2f2f2' : '#ffffff',
      opacity: isSupported ? 1 : 0.5,
    }}>
      <TouchableOpacity style={styles.listItemLeft} activeOpacity={0.6} onPress={() => { onPress(item, index) }} onLongPress={() => { onLongPress(item, index) }}>
        <View style={styles.snWrap}>
          {
            active
              ? <Icon name="play-outline" size={15} color={HAMMER_RED} />
              : <Text size={13} color={HAMMER_SUB}>{index + 1}</Text>
          }
        </View>
        <View style={styles.itemInfo}>
          <Text color={active ? HAMMER_RED : HAMMER_TEXT} size={15} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.sub} size={12} color={HAMMER_SUB} numberOfLines={1}>
            {singer}
          </Text>
        </View>
        {
          isShowInterval && item.interval ? (
            <Text size={12} color={HAMMER_SUB} numberOfLines={1}>{item.interval}</Text>
          ) : null
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={handleShowMenu} ref={moreButtonRef} style={styles.moreButton} activeOpacity={0.6}>
        <Icon name="dots-vertical" style={{ color: '#b0b0b0' }} size={14} />
      </TouchableOpacity>
    </View>
  )
}, (prevProps, nextProps) => {
  return !!(prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.isShowAlbumName === nextProps.isShowAlbumName &&
    prevProps.isShowInterval === nextProps.isShowInterval &&
    prevProps.activeIndex != nextProps.index &&
    nextProps.activeIndex != nextProps.index &&
    nextProps.selectedList.includes(nextProps.item) == prevProps.selectedList.includes(nextProps.item)
  )
})


const styles = createStyle({
  listItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 14,
    paddingRight: 4,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  listItemLeft: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  snWrap: {
    width: 26,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemInfo: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  sub: {
    marginTop: 3,
  },
  moreButton: {
    height: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
})
