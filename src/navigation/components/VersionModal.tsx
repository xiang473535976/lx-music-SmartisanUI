import { useMemo, useState, useEffect, memo } from 'react'
import { View, ScrollView } from 'react-native'

import { compareVer, sizeFormate } from '@/utils'

import Button from '@/components/common/Button'
import { updateApp } from '@/utils/version'
import { createStyle } from '@/utils/tools'
import { type VersionInfo } from '@/store/version/state'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { useVersionDownloadProgressUpdated, useVersionInfo, useVersionInfoIgnoreVersionUpdated } from '@/store/version/hook'
import ModalContent from './ModalContent'
import { checkUpdate, downloadUpdate, hideModal, setIgnoreVersion } from '@/core/version'

const VersionItem = ({ version, desc }: VersionInfo) => {
  return (
    <View style={styles.versionItem}>
      <Text style={styles.label}>v{version}</Text>
      <Text selectable style={styles.desc}>{desc}</Text>
    </View>
  )
}

const Content = memo(({ title, newVersionInfo }: {
  title: string
  newVersionInfo: VersionInfo | null
}) => {
  const t = useI18n()

  const history = useMemo(() => {
    if (!newVersionInfo?.history) return []
    let arr = []
    for (const ver of newVersionInfo?.history) {
      if (compareVer(currentVer, ver.version) < 0) arr.push(ver)
    }
    return arr
  }, [newVersionInfo])

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.content} keyboardShouldPersistTaps={'always'}>
        <Text style={styles.label}>{t('version_label_latest_ver')}{newVersionInfo?.version}</Text>
        <Text style={styles.label}>{t('version_label_current_ver')}{currentVer}</Text>
        {
          newVersionInfo?.desc
            ? (
                <View>
                  <Text style={styles.label}>{t('version_label_change_log')}</Text>
                  <View style={{ paddingLeft: 10, marginTop: 5 }}>
                    <Text selectable style={styles.desc}>{newVersionInfo.desc}</Text>
                  </View>
                </View>
              )
            : null
        }
        {
          history.length
            ? (
                <View style={styles.history}>
                  <Text style={styles.label}>{t('version_label_history')}</Text>
                  <View style={{ paddingLeft: 10, marginTop: 5 }}>
                    {history.map((item, index) => <VersionItem key={index} version={item.version} desc={item.desc} />)}
                  </View>
                </View>
              )
            : null
        }
      </ScrollView>
    </View>
  )
})

const currentVer = process.versions.app
const VersionModal = ({ componentId }: { componentId: string }) => {
  const t = useI18n()
  const versionInfo = useVersionInfo()
  const progress = useVersionDownloadProgressUpdated()
  const ignoreVersion = useVersionInfoIgnoreVersionUpdated()
  const [ignoreBtn, setIgnoreBtn] = useState({ text: t('version_btn_ignore'), show: true, disabled: false })
  const [closeBtnText, setCloseBtnText] = useState(t('version_btn_close'))
  const [confirmBtn, setConfirmBtn] = useState({ text: '', show: true, disabled: false })
  const [title, setTitle] = useState('')
  const [tip, setTip] = useState('')


  useEffect(() => {
    let ignoreBtnConfig = { ...ignoreBtn }
    if (versionInfo.isLatest) {
      setTitle(t('version_title_latest'))
      setTip('')
      ignoreBtnConfig.show = false
      setConfirmBtn({ text: t('version_btn_new'), show: false, disabled: true })
      setCloseBtnText(t('version_btn_close'))
    } else if (versionInfo.isUnknown) {
      setTitle(t('version_title_unknown'))
      setTip(t('version_tip_unknown'))
      ignoreBtnConfig.show = false
      setConfirmBtn({ text: t('version_btn_failed'), show: true, disabled: false })
      setCloseBtnText(t('version_btn_close'))
    } else {
      switch (versionInfo.status) {
        case 'downloading':
          setTitle(t('version_title_new'))
          setTip(t('version_btn_downloading', {
            total: sizeFormate(progress.total),
            current: sizeFormate(progress.current),
            progress: progress.total ? (progress.current / progress.total * 100).toFixed(2) : '0',
          }))
          if (ignoreBtnConfig.show) ignoreBtnConfig.show = false
          if (!confirmBtn.disabled) setConfirmBtn({ text: t('version_btn_update'), show: true, disabled: true })
          setCloseBtnText(t('version_btn_min'))
          break
        case 'downloaded':
          setTitle(t('version_title_update'))
          setTip('')
          if (ignoreBtnConfig.show) ignoreBtnConfig.show = false
          setConfirmBtn({ text: t('version_btn_update'), show: true, disabled: false })
          setCloseBtnText(t('version_btn_close'))
          break
        case 'checking':
          setTitle(t('version_title_checking'))
          setTip('')
          ignoreBtnConfig.show = false
          setConfirmBtn({ text: t('version_btn_new'), show: false, disabled: true })
          setCloseBtnText(t('version_btn_close'))
          break
        case 'error':
          setTitle(t('version_title_failed'))
          setTip(t('version_tip_failed'))
          ignoreBtnConfig.show = true
          ignoreBtnConfig.disabled = false
          setConfirmBtn({ text: t('version_btn_failed'), show: true, disabled: false })
          setCloseBtnText(t('version_btn_close'))
          break
        // case 'idle':
        //   break
        default:
          setTitle(t('version_title_new'))
          setTip('')
          ignoreBtnConfig.show = true
          ignoreBtnConfig.disabled = false
          setConfirmBtn({ text: t('version_btn_new'), show: true, disabled: false })
          // setTip(t('version_btn_new'))
          setCloseBtnText(t('version_btn_close'))
          break
      }
    }
    ignoreBtnConfig.text = t(ignoreVersion == versionInfo.newVersion?.version ? 'version_btn_ignore_cancel' : 'version_btn_ignore')
    setIgnoreBtn(ignoreBtnConfig)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, versionInfo, ignoreVersion, progress])

  const handleCancel = () => {
    hideModal(componentId)
  }
  const handleIgnore = () => {
    setIgnoreVersion(ignoreVersion != versionInfo.newVersion!.version ? versionInfo.newVersion!.version : null)
    // handleCancel()
  }

  const handleConfirm = () => {
    if (versionInfo.isLatest || versionInfo.isUnknown) {
      void checkUpdate()
    } else if (versionInfo.status == 'downloaded') {
      void updateApp()
    } else if (versionInfo.status == 'idle' || versionInfo.status == 'error') {
      downloadUpdate()
    }
  }

  return (
    <ModalContent>
      <Content title={title} newVersionInfo={versionInfo.newVersion} />
      { tip.length ? <Text style={styles.tip} color={HAMMER_RED}>{tip}</Text> : null }
      <View style={styles.btns}>
        {
          ignoreBtn.show
            ? (
                <Button disabled={ignoreBtn.disabled} style={ignoreBtn.disabled ? { ...styles.btn, ...styles.btnDisabled } : styles.btn} onPress={handleIgnore}>
                  <Text size={14} color={ignoreBtn.disabled ? '#b0b0b0' : '#4d4d4d'} style={styles.btnText}>{ignoreBtn.text}</Text>
                </Button>
              )
            : null
        }
        <Button style={styles.btn} onPress={handleCancel}>
          <Text size={14} color="#4d4d4d" style={styles.btnText}>{closeBtnText}</Text>
        </Button>
        {
          confirmBtn.show
            ? (
                <Button disabled={confirmBtn.disabled} style={confirmBtn.disabled ? { ...styles.btn, ...styles.btnDisabled } : styles.btn} onPress={handleConfirm}>
                  <Text size={14} color={confirmBtn.disabled ? '#b0b0b0' : '#4d4d4d'} style={styles.btnText}>{confirmBtn.text}</Text>
                </Button>
              )
            : null
        }
      </View>
    </ModalContent>
  )
}

const HAMMER_RED = '#E64040'
const HAMMER_LINE = '#ccdcdbdb'

const styles = createStyle({
  main: {
    flexShrink: 1,
    marginTop: 15,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 20,
  },
  content: {
    flexGrow: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  history: {
    marginTop: 15,
  },
  versionItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#4d4d4d',
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#939396',
  },
  tip: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    fontSize: 13,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingLeft: 14,
    paddingRight: 14,
  },
  btn: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
    marginRight: 10,
  },
  btnDisabled: {
    backgroundColor: '#fafafa',
    borderColor: '#e5e5e5',
  },
  btnText: {
    fontWeight: 'bold',
  },
})

export default VersionModal

