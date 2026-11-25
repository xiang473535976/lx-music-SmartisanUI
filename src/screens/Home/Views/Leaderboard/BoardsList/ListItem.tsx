import { useCallback, useRef } from 'react'
import { View } from 'react-native'
import Text from '@/components/common/Text'
import Button, { type BtnType } from '@/components/common/Button'
import { createStyle } from '@/utils/tools'
import { type BoardItem } from '@/store/leaderboard/state'
import { Icon } from '@/components/common/Icon'

const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_LINE = '#ededed'

// index={index}
// longPressIndex={longPressIndex}
// activeId={activeId}
// showMenu={showMenu}
// onBoundChange={handleBoundChange}
export interface ListItemProps {
  item: BoardItem
  index: number
  longPressIndex: number
  activeId: string
  onShowMenu: (id: string, name: string, index: number, position: { x: number, y: number, w: number, h: number }) => void
  onBoundChange: (item: BoardItem) => void
}

export default ({ item, activeId, index, longPressIndex, onBoundChange, onShowMenu }: ListItemProps) => {
  const buttonRef = useRef<BtnType>(null)

  const setPosition = useCallback(() => {
    if (buttonRef.current?.measure) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        // console.log(fx, fy, width, height, px, py)
        onShowMenu(item.id, item.name, index, { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
      })
    }
  }, [index, item, onShowMenu])

  const active = activeId == item.id

  return (
    <Button
      ref={buttonRef}
      style={{ ...styles.button, backgroundColor: index == longPressIndex ? '#f2f2f2' : 'transparent' }}
      key={item.id} onLongPress={setPosition}
      onPress={() => { onBoundChange(item) }}
    >
      <View style={styles.iconWrap}>
        { active ? <Icon name="chevron-right" size={12} color={HAMMER_RED} /> : null }
      </View>
      <Text style={styles.listName} size={14} textBreakStrategy="simple" color={active ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1}>{item.name}</Text>
    </Button>
  )
}

const styles = createStyle({
  button: {
    paddingLeft: 8,
    paddingRight: 10,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  iconWrap: {
    width: 14,
  },
  listName: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 6,
  },
})
