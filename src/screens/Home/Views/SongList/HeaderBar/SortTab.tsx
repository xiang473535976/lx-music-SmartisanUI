import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import songlistState, { type SortInfo, type Source } from '@/store/songlist/state'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

export interface SortTabProps {
  onSortChange: (id: string) => void
}

export interface SortTabType {
  setSource: (source: Source, activeTab: SortInfo['id']) => void
}

const ACTIVE_BG = '#cdcdcd'
const ACTIVE_TEXT = '#ffffff'
const TEXT_COLOR = '#4d4d4d'

/**
 * 锤子风分段控件：选中项为灰色实底 + 白字加粗，未选中为白底深灰字。
 */
export default forwardRef<SortTabType, SortTabProps>(({ onSortChange }, ref) => {
  const [sortList, setSortList] = useState<SortInfo[]>([])
  const [activeId, setActiveId] = useState<SortInfo['id']>('')
  const t = useI18n()
  const scrollViewRef = useRef<ScrollView>(null)

  useImperativeHandle(ref, () => ({
    setSource(source, activeTab) {
      scrollViewRef.current?.scrollTo({ x: 0 })
      setSortList(songlistState.sortList[source]!)
      setActiveId(activeTab)
    },
  }))

  const sorts = useMemo(() => {
    return sortList.map(s => ({ label: t(`songlist_${s.tid}`), id: s.id }))
  }, [sortList, t])

  const handleSortChange = (id: string) => {
    onSortChange(id)
    setActiveId(id)
  }

  return (
    <View style={styles.wrap}>
      <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps={'always'} horizontal showsHorizontalScrollIndicator={false}>
        {
          sorts.map(s => {
            const isActive = activeId == s.id
            return (
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: isActive ? ACTIVE_BG : 'transparent' }}
                onPress={() => { handleSortChange(s.id) }}
                activeOpacity={0.6}
                key={s.id}
              >
                <Text
                  style={isActive ? styles.buttonTextActive : styles.buttonText}
                  size={14}
                  color={isActive ? ACTIVE_TEXT : TEXT_COLOR}
                >{s.label}</Text>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    </View>
  )
})


const styles = createStyle({
  wrap: {
    flexGrow: 1,
    flexShrink: 1,
  },
  container: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    alignItems: 'stretch',
  },
  button: {
    height: 38,
    justifyContent: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  buttonText: {},
  buttonTextActive: {
    fontWeight: 'bold',
  },
})
