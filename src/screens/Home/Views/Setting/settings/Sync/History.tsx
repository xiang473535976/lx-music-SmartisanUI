import { memo, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
// import { gzip, ungzip } from 'pako'
import { Icon } from '@/components/common/Icon'

import Button from '../../components/Button'
import { getSyncHostHistory, removeSyncHostHistory, setSyncHost } from '@/plugins/sync/data'
import Popup, { type PopupType } from '@/components/common/Popup'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { createStyle } from '@/utils/tools'

type SyncHistoryItem = Awaited<ReturnType<typeof getSyncHostHistory>>[number]

const HistoryListItem = ({ item, index, onRemove, onSelect }: {
  item: SyncHistoryItem
  index: number
  onRemove: (index: number) => void
  onSelect: (index: number) => void
}) => {
  const handleSetHost = () => {
    onSelect(index)
    // setHost({
    //   host: item.host,
    //   port: item.port,
    // })
    // setSyncHost({
    //   host: item.host,
    //   port: item.port,
    // })
  }
  const handleRemove = () => {
    onRemove(index)
  }

  return (
    <View style={{ ...styles.listItem, borderBottomColor: '#ededed' }}>
      <TouchableOpacity style={styles.listName} onPress={handleSetHost}>
        <Text numberOfLines={1}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRemove} style={styles.listBtn}>
        <Icon name="remove" color={'#939396'} size={12} />
      </TouchableOpacity>
    </View>
  )
}

interface HistoryListProps {
  onSelect: (item: SyncHistoryItem) => void
}
interface HistoryListType {
  show: () => void
}
const HistoryList = forwardRef<HistoryListType, HistoryListProps>(({ onSelect }, ref) => {
  const popupRef = useRef<PopupType>(null)
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState<SyncHistoryItem[]>([])
  // const isUnmountedRef = useRef(true)
  const t = useI18n()

  const handleShow = () => {
    popupRef.current?.setVisible(true)
    requestAnimationFrame(() => {
      void getSyncHostHistory().then(historyList => {
        setList([...historyList])
      })
    })
  }
  useImperativeHandle(ref, () => ({
    show() {
      if (visible) handleShow()
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          handleShow()
        })
      }
    },
  }))

  const handleSelect = useCallback((index: number) => {
    popupRef.current?.setVisible(false)
    onSelect(list[index])
  }, [list, onSelect])

  const handleRemove = useCallback((index: number) => {
    void removeSyncHostHistory(index)
    const newList = [...list]
    newList.splice(index, 1)
    setList(newList)
  }, [list])


  return (
    visible
      ? (
          <Popup ref={popupRef} title={t('setting_sync_history_title')}>
            <ScrollView style={styles.list}>
              {
                list.length
                  ? list.map((item, index) => (
                      <HistoryListItem
                        item={item}
                        index={index}
                        onRemove={handleRemove}
                        key={item}
                        onSelect={handleSelect}
                      />
                  ))
                  : <Text style={styles.tipText} color={'#939396'}>{t('setting_sync_history_empty')}</Text>
              }
            </ScrollView>
          </Popup>
        )
      : null
  )
})

export default memo(({ setHost }: {
  setHost: (host: string) => void
}) => {
  const t = useI18n()
  const isEnableSync = useSettingValue('sync.enable')
  const listRef = useRef<HistoryListType>(null)

  const showPopup = () => {
    listRef.current?.show()
  }

  const handleSelect = (item: SyncHistoryItem) => {
    setHost(item)
    void setSyncHost(item)
  }

  return (
    <>
      <View style={styles.btn}>
        <Button disabled={isEnableSync} onPress={showPopup}>{t('setting_sync_history')}</Button>
      </View>
      <HistoryList ref={listRef} onSelect={handleSelect} />
    </>
  )
})

const styles = createStyle({
  btn: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipText: {
    textAlign: 'center',
    marginTop: 15,
  },
  list: {
    flexShrink: 1,
    flexGrow: 0,
    paddingLeft: 14,
    paddingRight: 14,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingLeft: 2,
    paddingRight: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
  },
  listName: {
    flex: 1,
  },
  listBtn: {
    padding: 8,
  },
})
