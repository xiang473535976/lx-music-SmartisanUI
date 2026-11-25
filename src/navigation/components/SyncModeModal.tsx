import { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'

import Button from '@/components/common/Button'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import ModalContent from './ModalContent'
import syncState from '@/store/sync/state'
import CheckRow from '@/components/common/CheckRow'
import { setSyncModeComponentId } from '@/core/sync'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ccdcdbdb'
const HAMMER_TITLE = '#333333'

const styles = createStyle({
  main: {
    flexShrink: 1,
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15,
  },
  content: {
    flexGrow: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    marginRight: 15,
    fontWeight: 'bold',
  },
  btnGroup: {
    marginTop: 12,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 5,
  },
  btn: {
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
    backgroundColor: '#ffffff',
    marginRight: 12,
    minWidth: 100,
  },
  btnText: {
    fontWeight: 'bold',
  },
  tips: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
  tipTitle: {
    fontWeight: 'bold',
  },
  tip: {
    paddingBottom: 6,
    lineHeight: 18,
  },
})


const ListModeModal = () => {
  const t = useI18n()
  const [isOverwrite, setOverwrite] = useState(false)

  const handleSelectMode = (mode: LX.Sync.List.SyncMode) => {
    if (mode.startsWith('overwrite') && isOverwrite) mode += '_full'
    global.app_event.selectSyncMode({ type: 'list', mode })
  }

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.title} size={16} color={HAMMER_TITLE}>{t('sync__list_mode_title', { name: syncState.serverName })}</Text>
        <ScrollView style={styles.content} keyboardShouldPersistTaps={'always'}>
          <View style={{ ...styles.btnGroup, marginTop: 0 }}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_merge_tip')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('merge_local_remote') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_merge_btn_local_remote')}</Text>
              </Button>
              <Button style={styles.btn} onPress={() => { handleSelectMode('merge_remote_local') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_merge_btn_remote_local')}</Text>
              </Button>
            </View>
          </View>
          <View style={styles.btnGroup}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_overwrite_label')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('overwrite_local_remote') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_local_remote')}</Text>
              </Button>
              <Button style={styles.btn} onPress={() => { handleSelectMode('overwrite_remote_local') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_remote_local')}</Text>
              </Button>
            </View>
            <View>
              <CheckRow check={isOverwrite} onChange={setOverwrite} label={t('sync__mode_overwrite')} />
            </View>
          </View>
          <View style={styles.btnGroup}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_other_label')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('cancel') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_cancel')}</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.tips}>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_merge_tip')}</Text>
          {t('sync__list_mode_merge_tip_desc')}
        </Text>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_overwrite_tip')}</Text>
          {t('sync__list_mode_overwrite_tip_desc')}
        </Text>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_other_tip')}</Text>
          {t('sync__list_mode_other_tip_desc')}
        </Text>
      </View>
    </>
  )
}


const DislikeModeModal = () => {
  const t = useI18n()
  const handleSelectMode = (mode: LX.Sync.Dislike.SyncMode) => {
    global.app_event.selectSyncMode({ type: 'dislike', mode })
  }

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.title} size={16} color={HAMMER_TITLE}>{t('sync__dislike_mode_title', { name: syncState.serverName })}</Text>
        <ScrollView style={styles.content} keyboardShouldPersistTaps={'always'}>
          <View style={{ ...styles.btnGroup, marginTop: 0 }}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_merge_tip')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('merge_local_remote') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_merge_btn_local_remote')}</Text>
              </Button>
              <Button style={styles.btn} onPress={() => { handleSelectMode('merge_remote_local') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_merge_btn_remote_local')}</Text>
              </Button>
            </View>
          </View>
          <View style={styles.btnGroup}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_overwrite_label')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('overwrite_local_remote') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_local_remote')}</Text>
              </Button>
              <Button style={styles.btn} onPress={() => { handleSelectMode('overwrite_remote_local') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_remote_local')}</Text>
              </Button>
            </View>
          </View>
          <View style={styles.btnGroup}>
            <Text size={14} color={HAMMER_TEXT}>{t('sync__mode_other_label')}</Text>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={() => { handleSelectMode('cancel') }}>
                <Text size={13} color={HAMMER_TEXT} style={styles.btnText}>{t('sync__mode_overwrite_btn_cancel')}</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.tips}>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_merge_tip')}</Text>
          {t('sync__dislike_mode_merge_tip_desc')}
        </Text>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_overwrite_tip')}</Text>
          {t('sync__dislike_mode_overwrite_tip_desc')}
        </Text>
        <Text style={styles.tip} size={12} color={HAMMER_SUB}>
          <Text style={styles.tipTitle} size={12}>{t('sync__mode_other_tip')}</Text>
          {t('sync__dislike_mode_other_tip_desc')}
        </Text>
      </View>
    </>
  )
}

export default ({ componentId }: { componentId: string }) => {
  useEffect(() => {
    setSyncModeComponentId(componentId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModalContent>
      {
        syncState.type == 'list' ? <ListModeModal />
          : syncState.type == 'dislike' ? <DislikeModeModal />
            : null
      }
    </ModalContent>
  )
}
