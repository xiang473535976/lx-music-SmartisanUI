import { useCallback } from 'react'
import Text from '@/components/common/Text'
import { View, TouchableOpacity } from 'react-native'
import { confirmDialog, createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useUserApiList, state as userApiState } from '@/store/userApi'
import { useSettingValue } from '@/store/setting/hook'
import { removeUserApi, setUserApiAllowShowUpdateAlert } from '@/core/userApi'
import CheckRow from '@/components/common/CheckRow'
import EmptyView from '@/components/common/EmptyView'
import settingState from '@/store/setting/state'
import apiSourceInfo from '@/utils/musicSdk/api-source-info'
import { setApiSource } from '@/core/apiSource'

const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#4d4d4d'
const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

const formatVersionName = (version: string) => {
  return /^\d/.test(version) ? `v${version}` : version
}

const ListItem = ({ item, activeId, onRemove, onChangeAllowShowUpdateAlert }: {
  item: LX.UserApi.UserApiInfo
  activeId: string
  onRemove: (id: string, name: string) => void
  onChangeAllowShowUpdateAlert: (id: string, enabled: boolean) => void
}) => {
  const t = useI18n()
  const active = activeId == item.id
  const changeAllowShowUpdateAlert = (check: boolean) => {
    onChangeAllowShowUpdateAlert(item.id, check)
  }
  const handleRemove = () => {
    onRemove(item.id, item.name)
  }
  const meta = [item.version ? formatVersionName(item.version) : '', item.author ?? ''].filter(Boolean).join(' · ')

  return (
    <View style={styles.listItem}>
      <View style={styles.listItemLeft}>
        <View style={styles.nameRow}>
          <Text size={15} color={active ? HAMMER_RED : HAMMER_TEXT} numberOfLines={1} style={styles.name}>{item.name}</Text>
          <Text size={12} color={HAMMER_SUB} numberOfLines={1}>{meta}</Text>
        </View>
        {
          item.description ? (
            <Text size={12} color={HAMMER_SUB} style={styles.desc} numberOfLines={2}>{item.description}</Text>
          ) : null
        }
        <CheckRow check={item.allowShowUpdateAlert} label={t('user_api_allow_show_update_alert')} onChange={changeAllowShowUpdateAlert} textSize={13} />
      </View>
      <TouchableOpacity style={styles.removeBtn} activeOpacity={0.6} onPress={handleRemove}>
        <Text size={13} color={HAMMER_SUB} style={styles.removeText}>{t('delete')}</Text>
      </TouchableOpacity>
    </View>
  )
}

/**
 * 自定义源列表（锤子风）：白底、发丝分隔线、右侧描边「移除」小按钮。
 * 抽取成纯列表后供自定义源独立页复用，不再自己带滚动容器。
 */
export default () => {
  const userApiList = useUserApiList()
  const apiSource = useSettingValue('common.apiSource')
  const t = useI18n()

  const handleRemove = useCallback(async(id: string, name: string) => {
    const confirm = await confirmDialog({
      message: global.i18n.t('user_api_remove_tip', { name }),
      cancelButtonText: global.i18n.t('cancel_button_text_2'),
      confirmButtonText: global.i18n.t('confirm_button_text'),
      bgClose: false,
    })
    if (!confirm) return
    void removeUserApi([id]).finally(() => {
      if (settingState.setting['common.apiSource'] == id) {
        let backApiId = apiSourceInfo.find(api => !api.disabled)?.id
        if (!backApiId) backApiId = userApiState.list[0]?.id
        setApiSource(backApiId ?? '')
      }
    })
  }, [])
  const handleChangeAllowShowUpdateAlert = useCallback((id: string, enabled: boolean) => {
    void setUserApiAllowShowUpdateAlert(id, enabled)
  }, [])

  if (!userApiList.length) {
    return <EmptyView text={t('user_api_empty')} icon="available_updates" />
  }

  return (
    <View>
      {
        userApiList.map((item) => {
          return (
            <ListItem
              key={item.id}
              item={item}
              activeId={apiSource}
              onRemove={handleRemove}
              onChangeAllowShowUpdateAlert={handleChangeAllowShowUpdateAlert}
            />
          )
        })
      }
    </View>
  )
}


const styles = createStyle({
  listItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: HAMMER_LINE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemLeft: {
    paddingRight: 10,
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    flexShrink: 1,
    paddingRight: 8,
  },
  desc: {
    marginTop: 2,
  },
  removeBtn: {
    flexGrow: 0,
    flexShrink: 0,
    height: 26,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccdcdbdb',
    backgroundColor: '#ffffff',
  },
  removeText: {
  },
})
