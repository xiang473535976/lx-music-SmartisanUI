import { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'

export default memo(({ onConfirm, onHide, dirOnly }: {
  onConfirm: () => void
  onHide: () => void
  dirOnly: boolean
}) => {
  const t = useI18n()

  return (
    <View style={{ ...styles.footer, backgroundColor: '#ffffff' }}>
      <Button style={styles.footerBtn} onPress={onHide}>
        <Text size={14} color={'#4d4d4d'} style={styles.footerBtnText}>{t('cancel')}</Text>
      </Button>
      {dirOnly
        ? (
          <>
            <View style={styles.splitLine} />
            <Button style={styles.footerBtn} onPress={onConfirm}>
              <Text size={14} color={'#E64040'} style={styles.footerBtnText}>{t('confirm')}</Text>
            </Button>
          </>
          )
        : null
      }
    </View>
  )
})

const styles = StyleSheet.create({
  footer: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: '#ededed',
    backgroundColor: '#ffffff',
  },
  footerBtn: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnText: {
    fontWeight: 'bold',
  },
  splitLine: {
    width: 0.5,
    height: 18,
    backgroundColor: '#ededed',
  },
})
