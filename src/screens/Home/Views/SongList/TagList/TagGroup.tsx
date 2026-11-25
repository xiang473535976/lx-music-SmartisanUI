import { View } from 'react-native'

import Button from '@/components/common/Button'
import { type TagInfoItem } from '@/store/songlist/state'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'

// 锤子风配色
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_RED = '#E64040'
const CHIP_BG = '#f4f4f4'

export interface TagGroupProps {
  name: string
  list: TagInfoItem[]
  onTagChange: (name: string, id: string) => void
  activeId: string
}

export default ({ name, list, onTagChange, activeId }: TagGroupProps) => {
  return (
    <View>
      {
        name
          ? <Text style={styles.tagTypeTitle} color={HAMMER_SUB}>{name}</Text>
          : null
      }
      <View style={styles.tagTypeList}>
        {list.map(item => (
          activeId == item.id
            ? (
                <View style={{ ...styles.tagButton, borderColor: HAMMER_RED }} key={item.id}>
                  <Text style={styles.tagButtonText} color={HAMMER_RED}>{item.name}</Text>
                </View>
              )
            : (
                <Button
                  style={styles.tagButton}
                  key={item.id}
                  onPress={() => { onTagChange(item.name, item.id) }}
                >
                  <Text style={styles.tagButtonText} color={HAMMER_TEXT} >{item.name}</Text>
                </Button>
              )

        ))}
      </View>
    </View>
  )
}

const styles = createStyle({
  tagTypeTitle: {
    marginTop: 15,
    marginBottom: 10,
  },
  tagTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    backgroundColor: CHIP_BG,
    marginRight: 10,
    marginBottom: 10,
  },
  tagButtonText: {
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
})
