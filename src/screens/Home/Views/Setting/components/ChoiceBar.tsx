import { memo } from 'react'

import { TouchableOpacity, View } from 'react-native'

import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

export interface ChoiceOption {
  id: string
  label: string
}

export interface ChoiceBarProps {
  options: ChoiceOption[]
  activeId: string
  onChange: (id: string) => void
  /** true = 自动换行（多行选项），false = 单行横排 */
  wrap?: boolean
}

/**
 * 锤子风分段选择控件：白底 0.5 灰边圆角 4dp，选中项灰底白字加粗。
 * 用于设置页里「从若干选项里选一个」的场景（字号、抽屉位置、音质、歌词位置等）。
 */
export default memo(({ options, activeId, onChange, wrap = true }: ChoiceBarProps) => {
  return (
    <View style={wrap ? styles.wrap : styles.row}>
      {
        options.map(option => {
          const active = option.id == activeId
          return (
            <TouchableOpacity
              key={option.id}
              style={active ? { ...styles.item, ...styles.itemActive } : styles.item}
              activeOpacity={0.6}
              onPress={() => { if (!active) onChange(option.id) }}
            >
              <Text size={13} color={active ? '#ffffff' : '#4d4d4d'} style={active ? styles.textActive : undefined}>{option.label}</Text>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
})

const styles = createStyle({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    height: 30,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccdcdbdb',
    backgroundColor: '#ffffff',
  },
  itemActive: {
    backgroundColor: '#cdcdcd',
    borderColor: '#cdcdcd',
  },
  textActive: {
    fontWeight: 'bold',
  },
})
