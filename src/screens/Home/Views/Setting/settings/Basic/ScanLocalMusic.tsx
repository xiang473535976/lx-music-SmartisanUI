import { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import Text from '@/components/common/Text'
import Loading from '@/components/common/Loading'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { scanLocalMusic } from '@/core/localMusic'
import { setScanning, useScanning } from '@/screens/LocalMusic/action'
import { createStyle } from '@/utils/tools'

// 锤子设置行实测：行高 56dp，左侧图标 + 单行文字 + 右侧箭头
export const SETTING_ROW_HEIGHT = 56

/**
 * 扫描本地音乐。
 *
 * 本地音乐不再单独成页：扫描结果写入「本地音乐」用户列表，
 * 在「我的列表」页顶部的列表切换条里就能看到。
 */
export default memo(() => {
  const t = useI18n()
  const scanning = useScanning()

  const handlePress = () => {
    if (scanning) return
    setScanning(true)
    void scanLocalMusic().finally(() => { setScanning(false) })
  }

  return (
    <TouchableOpacity
      style={styles.content}
      activeOpacity={0.6}
      disabled={scanning}
      onPress={handlePress}
    >
      <Icon name="music_time" size={18} color={'#E64040'} />
      <Text style={styles.label} size={15} color="#4d4d4d">{t('list_scan_local_music')}</Text>
      {
        scanning
          ? <Loading size={16} color={'#E64040'} />
          : <Icon name="chevron-right" size={15} color="#c4c4c4" style={styles.arrow} />
      }
    </TouchableOpacity>
  )
})

const styles = createStyle({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SETTING_ROW_HEIGHT,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ededed',
  },
  label: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  arrow: {
    marginLeft: 'auto',
  },
})
