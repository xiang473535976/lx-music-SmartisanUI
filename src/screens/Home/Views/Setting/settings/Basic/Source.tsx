import { memo, useCallback, useMemo } from 'react'

import { Image, TouchableOpacity, View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import { createStyle } from '@/utils/tools'
import { setApiSource } from '@/core/apiSource'
import { useI18n } from '@/lang'
import apiSourceInfo from '@/utils/musicSdk/api-source-info'
import { useSettingValue } from '@/store/setting/hook'
import { useStatus, useUserApiList } from '@/store/userApi'
import Button from '../../components/Button'
import { navigations } from '@/navigation'
import { useComponentIds } from '@/store/common/hook'
import Text from '@/components/common/Text'
import { SmartisanImages } from '@/resources/smartisan'

// 锤子风：白底行、发丝分隔线、右侧红色勾选
const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

const apiSourceList = apiSourceInfo.map(api => ({
  id: api.id,
  name: api.name,
  disabled: api.disabled,
}))

const Item = ({ id, name, desc, statusLabel, active, change }: {
  id: string
  name: string
  desc?: string
  statusLabel?: string
  active: boolean
  change: (id: string) => void
}) => {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={() => { change(id) }}>
      <View style={styles.rowInfo}>
        <Text size={15} color={active ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1}>
          {name}
          {desc ? <Text size={12} color={HAMMER_SUB}>  {desc}</Text> : null}
          {statusLabel ? <Text size={12} color={HAMMER_RED}>  {statusLabel}</Text> : null}
        </Text>
      </View>
      {active ? <Image source={SmartisanImages.checkboxOn} style={styles.checkIcon} resizeMode="contain" /> : null}
    </TouchableOpacity>
  )
}

export default memo(() => {
  const t = useI18n()
  const list = useMemo(() => apiSourceList.map(s => ({
    // @ts-expect-error
    name: t(`setting_basic_source_${s.id}`) || s.name,
    id: s.id,
  })), [t])
  const setApiSourceId = useCallback((id: string) => {
    setApiSource(id)
  }, [])
  const userApiListRaw = useUserApiList()
  const apiStatus = useStatus()
  const apiSourceSetting = useSettingValue('common.apiSource')
  const componentIds = useComponentIds()
  const userApiList = useMemo(() => {
    const getApiStatus = () => {
      let status
      if (apiStatus.status) status = t('setting_basic_source_status_success')
      else if (apiStatus.message == 'initing') status = t('setting_basic_source_status_initing')
      else status = t('setting_basic_source_status_failed')

      return status
    }
    return userApiListRaw.map(api => {
      const statusLabel = api.id == apiSourceSetting ? `[${getApiStatus()}]` : ''
      return {
        id: api.id,
        name: api.name,
        label: `${api.name}${statusLabel}`,
        desc: [/^\d/.test(api.version) ? `v${api.version}` : api.version].filter(Boolean).join(', '),
        statusLabel,
      }
    })
  }, [userApiListRaw, apiStatus, apiSourceSetting, t])

  const handleShow = () => {
    if (!componentIds.home) return
    navigations.pushUserApiScreen(componentIds.home)
  }

  return (
    <SubTitle title={t('setting_basic_source')}>
      <View style={styles.list}>
        {
          list.map(({ id, name }) => <Item name={name} id={id} key={id} active={apiSourceSetting == id} change={setApiSourceId} />)
        }
        {
          userApiList.map(({ id, name, desc, statusLabel }) => <Item name={name} desc={desc} statusLabel={statusLabel} id={id} key={id} active={apiSourceSetting == id} change={setApiSourceId} />)
        }
      </View>
      <View style={styles.btn}>
        <Button onPress={handleShow}>{t('setting_basic_source_user_api_btn')}</Button>
      </View>
    </SubTitle>
  )
})

const styles = createStyle({
  list: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft: -14,
    marginRight: -14,
  },
  btn: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  rowInfo: {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
  },
})
