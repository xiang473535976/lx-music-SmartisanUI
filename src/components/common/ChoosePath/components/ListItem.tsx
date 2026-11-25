import { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { type RowInfo, createStyle } from '@/utils/tools'

export interface PathItem {
  name: string
  path: string
  isDir: boolean
  mtime?: Date
  desc?: string
  size?: number
  sizeText?: string
  disabled?: boolean
}

export default memo(({ item, onPress, rowInfo }: {
  item: PathItem
  onPress: (item: PathItem) => void
  rowInfo: RowInfo
}) => {

  // const moreButtonRef = useRef()
  // const handleShowMenu = useCallback(() => {
  //   if (moreButtonRef.current && moreButtonRef.current.measure) {
  //     moreButtonRef.current.measure((fx, fy, width, height, px, py) => {
  //       // console.log(fx, fy, width, height, px, py)
  //       showMenu(item, index, { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
  //     })
  //   }
  // }, [item, index, showMenu])

  return (
    <View style={{ ...styles.listItem, width: rowInfo.rowWidth }} onStartShouldSetResponder={() => true}>
      {
        item.disabled ? (
          <View style={{ ...styles.listItem, opacity: 0.3 }}>
            <View style={styles.itemInfo}>
              <Text style={styles.listItemTitleText}>{item.name}</Text>
              <Text style={styles.listItemDesc} size={12} color={'#939396'} numberOfLines={1}>{item.mtime ? new Date(item.mtime).toLocaleString() : item.desc}</Text>
            </View>
            {
              item.isDir ? null
                : <Text style={styles.size} size={12} color={'#939396'}>{item.sizeText}</Text>
            }
          </View>
        ) : (
          <TouchableOpacity style={styles.listItem} onPress={ () => { onPress(item) } }>
            <View style={styles.itemInfo}>
              <Text style={styles.listItemTitleText}>{item.name}</Text>
              <Text style={styles.listItemDesc} size={12} color={'#939396'} numberOfLines={1}>{item.mtime ? new Date(item.mtime).toLocaleString() : item.desc}</Text>
            </View>
            {
              item.isDir
                ? <Icon name="chevron-right" color={'#f4f4f4'} size={18} />
                : <Text style={styles.size} size={12} color={'#939396'}>{item.sizeText}</Text>
            }
          </TouchableOpacity>
        )
      }
    </View>
  )
})

const styles = createStyle({
  listItem: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
  },
  itemInfo: {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  listItemTitleText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.2)',
    flexGrow: 0,
    flexShrink: 1,
  },
  listItemDesc: {
    paddingTop: 2,
  },
  size: {
    marginLeft: 8,
  },
})

