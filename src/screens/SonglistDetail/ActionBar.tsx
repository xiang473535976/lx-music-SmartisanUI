import { memo } from 'react'
import { View } from 'react-native'
import Button from '@/components/common/Button'

import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { handleCollect, handlePlay } from './listAction'
import songlistState from '@/store/songlist/state'
import { useI18n } from '@/lang'
import { useListInfo } from './state'

const HAMMER_RED = '#E64040'
const HAMMER_LINE = '#ededed'

export default memo(() => {
  const t = useI18n()
  const info = useListInfo()

  const handlePlayAll = () => {
    if (!songlistState.listDetailInfo.info.name) return
    void handlePlay(info.id, info.source, songlistState.listDetailInfo.list)
  }

  const handleCollection = () => {
    if (!songlistState.listDetailInfo.info.name) return
    void handleCollect(info.id, info.source, songlistState.listDetailInfo.info.name || info.name)
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleCollection} style={styles.controlBtn}>
        <Text size={14} style={styles.controlBtnText}>{t('collect_songlist')}</Text>
      </Button>
      <View style={styles.splitLine} />
      <Button onPress={handlePlayAll} style={styles.controlBtn}>
        <Text size={14} style={styles.controlBtnText}>{t('play_all')}</Text>
      </Button>
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'row',
    width: '100%',
    flexGrow: 0,
    flexShrink: 0,
    height: 44,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: HAMMER_LINE,
  },
  controlBtn: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnText: {
    textAlign: 'center',
    color: HAMMER_RED,
  },
  splitLine: {
    width: 0.5,
    height: 18,
    backgroundColor: HAMMER_LINE,
  },
})
