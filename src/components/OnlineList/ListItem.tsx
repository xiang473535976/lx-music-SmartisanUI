import { memo, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { scaleSizeH } from '@/utils/pixelRatio'
import { LIST_ITEM_HEIGHT } from '@/config/constant'
import { createStyle, type RowInfo } from '@/utils/tools'

export const ITEM_HEIGHT = scaleSizeH(LIST_ITEM_HEIGHT)

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

const useQualityTag = (musicInfo: LX.Music.MusicInfoOnline) => {
  const t = useI18n()
  let text = ''
  if (musicInfo.meta._qualitys.flac24bit) {
    text = t('quality_lossless_24bit')
  } else if (musicInfo.meta._qualitys.flac ?? musicInfo.meta._qualitys.ape) {
    text = t('quality_lossless')
  } else if (musicInfo.meta._qualitys['320k']) {
    text = t('quality_high_quality')
  }

  return text
}

/**
 * 锤子风歌曲行（在线列表 / 排行榜 / 歌单详情共用）：
 * 左序号、曲名 15sp 深灰、副行「品质 · 来源 · 歌手」12sp 浅灰、右侧时长与三点菜单。
 */
export default memo(({ item, index, showSource, onPress, onLongPress, onShowMenu, selectedList, rowInfo, isShowAlbumName, isShowInterval }: {
  item: LX.Music.MusicInfoOnline
  index: number
  showSource?: boolean
  onPress: (item: LX.Music.MusicInfoOnline, index: number) => void
  onLongPress: (item: LX.Music.MusicInfoOnline, index: number) => void
  onShowMenu: (item: LX.Music.MusicInfoOnline, index: number, position: { x: number, y: number, w: number, h: number }) => void
  selectedList: LX.Music.MusicInfoOnline[]
  rowInfo: RowInfo
  isShowAlbumName: boolean
  isShowInterval: boolean
}) => {
  const isSelected = selectedList.includes(item)

  const moreButtonRef = useRef<TouchableOpacity>(null)
  const handleShowMenu = () => {
    if (moreButtonRef.current?.measure) {
      moreButtonRef.current.measure((fx, fy, width, height, px, py) => {
        // console.log(fx, fy, width, height, px, py)
        onShowMenu(item, index, { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
      })
    }
  }
  const qualityText = useQualityTag(item)

  const singer = `${item.singer}${isShowAlbumName && item.meta.albumName ? ` · ${item.meta.albumName}` : ''}`
  const sub = [qualityText, showSource ? item.source.toUpperCase() : '', singer].filter(Boolean).join(' · ')

  return (
    <View style={{ ...styles.listItem, width: rowInfo.rowWidth, height: ITEM_HEIGHT, backgroundColor: isSelected ? '#f2f2f2' : '#ffffff' }}>
      <TouchableOpacity style={styles.listItemLeft} activeOpacity={0.6} onPress={() => { onPress(item, index) }} onLongPress={() => { onLongPress(item, index) }}>
        <View style={styles.snWrap}>
          <Text size={13} color={HAMMER_SUB}>{index + 1}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text numberOfLines={1} size={15} color={HAMMER_TEXT}>{item.name}</Text>
          <Text style={styles.sub} size={12} color={HAMMER_SUB} numberOfLines={1}>{sub}</Text>
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
