import { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createStyle } from '@/utils/tools'
import { type ListInfoItem } from '@/store/songlist/state'
import Text from '@/components/common/Text'
import { scaleSizeW } from '@/utils/pixelRatio'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import Image from '@/components/common/Image'

const gap = scaleSizeW(15)
// 锤子风配色
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'

export default memo(({ item, index, width, showSource, onPress }: {
  item: ListInfoItem
  index: number
  showSource: boolean
  width: number
  onPress: (item: ListInfoItem, index: number) => void
}) => {
  const itemWidth = width - gap
  const handlePress = () => {
    onPress(item, index)
  }
  return (
    item.source
      ? (
          <View style={{ ...styles.listItem, width: itemWidth }}>
            <View style={styles.listItemImg}>
              <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
                <Image url={item.img} nativeID={`${NAV_SHEAR_NATIVE_IDS.songlistDetail_pic}_from_${item.id}`} style={{ width: itemWidth, height: itemWidth, borderRadius: 4 }} />
                { showSource ? <Text style={styles.sourceLabel} size={9} color="#fff" >{item.source}</Text> : null }
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
              <Text style={styles.listItemTitle} size={13} color={HAMMER_TEXT} numberOfLines={ 2 }>{item.name}</Text>
            </TouchableOpacity>
            { item.play_count ? <Text style={styles.listItemCount} size={11} color={HAMMER_SUB} numberOfLines={1}>{item.play_count}</Text> : null }
            {/* <Text>{JSON.stringify(item)}</Text> */}
          </View>
        )
      : <View style={{ ...styles.listItem, width: itemWidth }} />
  )
})

const styles = createStyle({
  listItem: {
    // width: 90,
    margin: 10,
  },
  listItemImg: {
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  sourceLabel: {
    paddingLeft: 4,
    paddingBottom: 2,
    paddingRight: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  listItemTitle: {
    // overflow: 'hidden',
    marginBottom: 2,
    lineHeight: 18,
  },
  listItemCount: {
    marginBottom: 5,
  },
})
