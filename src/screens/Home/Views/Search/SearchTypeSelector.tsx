import { useCallback, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { createStyle } from '@/utils/tools'
import { type SearchType } from '@/store/search/state'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import { getSearchSetting } from '@/utils/data'

const SEARCH_TYPE_LIST = [
  'music',
  'songlist',
] as const

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_ACTIVE_BG = '#cdcdcd'

/**
 * 搜索类型切换（歌曲 / 歌单）。
 * 视觉沿用锤子的分段单选：未选中透明底 + #4d4d4d 文字，选中 #cdcdcd 底 + 白色粗体。
 */
export default ({ style }: { style?: object }) => {
  const t = useI18n()
  const [type, setType] = useState<SearchType>('music')

  useEffect(() => {
    void getSearchSetting().then(info => {
      setType(info.type)
    })
  }, [])

  const list = useMemo(() => {
    return SEARCH_TYPE_LIST.map(id => ({ label: t(`search_type_${id}`), id }))
  }, [t])

  const handleTypeChange = useCallback((type: SearchType) => {
    setType(type)
    global.app_event.searchTypeChanged(type)
  }, [])

  return (
    <View style={[styles.container, style]}>
      {
        list.map(item => {
          const active = type == item.id
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.button, active ? styles.buttonActive : null]}
              activeOpacity={0.6}
              onPress={() => { handleTypeChange(item.id) }}
            >
              <Text
                size={14}
                color={active ? '#ffffff' : HAMMER_TEXT}
                style={active ? styles.buttonTextActive : undefined}
                numberOfLines={1}
              >{item.label}</Text>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  button: {
    height: 26,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: HAMMER_ACTIVE_BG,
  },
  buttonTextActive: {
    fontWeight: 'bold',
  },
})
