import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { type Source, type InitState } from '@/store/hotSearch/state'
import Button from '@/components/common/Button'
import { getList } from '@/core/hotSearch'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'

const SECTION_TITLE = '#5b5b5b'
const CHIP_BG = '#f4f4f4'
const CHIP_TEXT = '#4d4d4d'


interface ListProps {
  onSearch: (keyword: string) => void
}
export interface HotSearchType {
  show: (source: Source) => void
}


export type List = NonNullable<InitState['sourceList'][keyof InitState['sourceList']]>

const ListItem = ({ keyword, onSearch }: {
  keyword: string
  onSearch: (keyword: string) => void
}) => {
  return (
    <Button style={styles.button} onPress={() => { onSearch(keyword) }}>
      <Text color={CHIP_TEXT} size={13}>{keyword}</Text>
    </Button>
  )
}

export default forwardRef<HotSearchType, ListProps>((props, ref) => {
  // const [listType, setListType] = useState<SearchState['searchType']>('music')
  // const listRef = useRef<MusicListType>(null)
  const [list, setList] = useState<List>([])
  const t = useI18n()

  const isUnmountedRef = useRef(false)
  useEffect(() => {
    isUnmountedRef.current = false
    return () => {
      isUnmountedRef.current = true
    }
  }, [])

  useImperativeHandle(ref, () => ({
    show(source) {
      void getList(source).then((list) => {
        if (isUnmountedRef.current) return
        setList(list)
      })
    },
  }), [])

  return (
    list.length
      ? (
          <ScrollView>
            <View style={styles.titleBar}>
              <Text style={styles.title} size={13} color={SECTION_TITLE}>{t('search_hot_search')}</Text>
            </View>
            <View style={styles.listWrap}>
              <View style={styles.list}>
                {
                  list.map(keyword => <ListItem keyword={keyword} key={keyword} onSearch={props.onSearch} />)
                }
              </View>
            </View>
          </ScrollView>
        )
      : null
  )
})


const styles = createStyle({
  titleBar: {
    height: 26,
    justifyContent: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    marginLeft: -14,
    marginRight: -14,
    backgroundColor: '#ededed',
  },
  title: {
    fontWeight: 'bold',
  },
  listWrap: {
    backgroundColor: '#ffffff',
    marginLeft: -14,
    marginRight: -14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 4,
    paddingBottom: 14,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 8,
    backgroundColor: CHIP_BG,
  },
})
