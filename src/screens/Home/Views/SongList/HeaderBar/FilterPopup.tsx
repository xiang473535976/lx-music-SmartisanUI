import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import Popup, { type PopupType } from '@/components/common/Popup'
import Text from '@/components/common/Text'
import { useSourceListI18n } from '@/components/SourceSelector'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import songlistState, { type Source } from '@/store/songlist/state'
import { createStyle } from '@/utils/tools'
import OpenListModal, { type ModalType as OpenListModalType } from './OpenList/Modal'
import { type SourceSelectorProps } from './SourceSelector'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'
const ACTIVE_BG = '#cdcdcd'
const ACTIVE_TEXT = '#ffffff'

export interface FilterPopupProps {
  onSourceChange: SourceSelectorProps['onSourceChange']
  onTagChange: (name: string, id: string) => void
}

export interface FilterPopupType {
  show: () => void
  setSource: (source: Source) => void
  setTagInfo: (source: Source, name: string, activeId: string) => void
}

/**
 * 歌单页顶栏右侧的「筛选」弹层：
 * 把原先挤在 38dp 顶栏里的音源选择与打开歌单收进底部弹层，顶栏只留排序与标签。
 */
export default forwardRef<FilterPopupType, FilterPopupProps>(({ onSourceChange, onTagChange }, ref) => {
  const t = useI18n()
  const popupRef = useRef<PopupType>(null)
  const openListModalRef = useRef<OpenListModalType>(null)
  const [source, setSource] = useState<Source>('kw')
  const [tagName, setTagName] = useState('')
  const [tagId, setTagId] = useState('')
  const sourceList = useSourceListI18n(songlistState.sources)
  const onTagChangeRef = useRef(onTagChange)
  onTagChangeRef.current = onTagChange

  useEffect(() => {
    const handleChange = (name: string, id: string) => {
      setTagName(name)
      setTagId(id)
      onTagChangeRef.current(name, id)
    }
    global.app_event.on('songlistTagInfoChange', handleChange)
    return () => {
      global.app_event.off('songlistTagInfoChange', handleChange)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    show() {
      popupRef.current?.setVisible(true)
    },
    setSource(next) {
      setSource(next)
    },
    setTagInfo(source, name, activeId) {
      setTagName(name)
      setTagId(activeId)
    },
  }))

  const handleSourcePress = (action: LX.OnlineSource | 'all') => {
    // 歌单页只支持具体音源，聚合项在这里没有意义
    if (action == 'all') return
    if (action == source) return
    setSource(action)
    onSourceChange(action)
  }

  const handleOpenId = (id: string) => {
    popupRef.current?.setVisible(false)
    navigations.pushSonglistDetailScreen(commonState.componentIds.home!, {
      play_count: undefined,
      id,
      author: '',
      name: '',
      img: undefined,
      desc: undefined,
      source,
    })
  }

  return (
    <Popup ref={popupRef} position="bottom" title={t('songlist_filter')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps={'always'}>
        <Text size={13} color={HAMMER_SUB} style={styles.label}>{t('songlist_filter_source')}</Text>
        <View style={styles.chips}>
          {
            sourceList.map(s => {
              const isActive = s.action == source
              return (
                <TouchableOpacity
                  key={s.action}
                  style={{ ...styles.chip, backgroundColor: isActive ? ACTIVE_BG : 'transparent' }}
                  activeOpacity={0.6}
                  onPress={() => { handleSourcePress(s.action) }}
                >
                  <Text
                    size={14}
                    numberOfLines={1}
                    style={isActive ? styles.chipTextActive : styles.chipText}
                    color={isActive ? ACTIVE_TEXT : HAMMER_TEXT}
                  >{s.label}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
        <View style={styles.divider} />
        <Text size={13} color={HAMMER_SUB} style={styles.label}>{t('songlist_filter_tag')}</Text>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.6}
          onPress={() => { global.app_event.showSonglistTagList(source, tagId) }}
        >
          <Text size={15} color={HAMMER_TEXT} style={styles.rowText}>{tagName}</Text>
          <Icon name="chevron-right" size={11} color={HAMMER_SUB} style={styles.arrow} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={() => { openListModalRef.current?.show(source) }}>
          <Text size={15} color={HAMMER_TEXT} style={styles.rowText}>{t('songlist_open')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <OpenListModal ref={openListModalRef} onOpenId={handleOpenId} />
    </Popup>
  )
})

const styles = createStyle({
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  label: {
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    height: 26,
    minWidth: 56,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
  },
  chipTextActive: {
    fontWeight: 'bold',
  },
  divider: {
    height: 0.5,
    backgroundColor: HAMMER_LINE,
    marginTop: 4,
    marginBottom: 4,
  },
  arrow: {
    marginLeft: 2,
    transform: [{ rotate: '90deg' }],
  },
  row: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
})
