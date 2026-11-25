import { forwardRef, useImperativeHandle, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'

export interface ActiveListNameProps {
  onShowBound: () => void
}
export interface ActiveListNameType {
  setBound: (id: string, name: string) => void
}

const HAMMER_SUB = '#939396'

export default forwardRef<ActiveListNameType, ActiveListNameProps>(({ onShowBound }, ref) => {
  const [currentListName, setCurrentListName] = useState('')

  useImperativeHandle(ref, () => ({
    setBound(id, name) {
      setCurrentListName(name)
    },
  }), [])

  return (
    <TouchableOpacity onPress={onShowBound} style={styles.currentList} activeOpacity={0.6}>
      <Text numberOfLines={1} style={styles.currentListText} size={14} color={HAMMER_SUB}>{currentListName}</Text>
    </TouchableOpacity>
  )
})


const styles = createStyle({
  currentList: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  currentListText: {
    flex: 1,
  },
})
