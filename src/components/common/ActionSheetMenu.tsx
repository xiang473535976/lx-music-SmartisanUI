import { useRef, useImperativeHandle, forwardRef, useState, type ComponentProps } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import Modal, { type ModalType } from '@/components/common/Modal'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'

export interface ActionItem {
  action: string
  label: string
  icon: ComponentProps<typeof Icon>['name']
  disabled?: boolean
}

export interface ActionSheetMenuType {
  show: (items: ActionItem[], onPress: (action: string) => void) => void
  update: (items: ActionItem[]) => void
}

// 锤子风底部操作弹层：4 列图标栅格（参考锤子 MoreMenuBottomDialog）
export default forwardRef<ActionSheetMenuType>((_props, ref) => {
  const t = useI18n()
  const modalRef = useRef<ModalType>(null)
  const [items, setItems] = useState<ActionItem[]>([])
  const [onPress, setOnPress] = useState<{ fn: ((action: string) => void) | null }>({ fn: null })

  useImperativeHandle(ref, () => ({
    show(actionItems, press) {
      setItems(actionItems)
      setOnPress({ fn: press })
      modalRef.current?.setVisible(true)
    },
    update(actionItems) {
      setItems(actionItems)
    },
  }))

  const hide = () => {
    modalRef.current?.setVisible(false)
  }

  const handlePress = (action: string) => {
    hide()
    onPress.fn?.(action)
  }

  return (
    <Modal ref={modalRef} bgColor="rgba(50,50,50,.2)">
      <View style={styles.overlay}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title} size={14} color="#5b5b5b">{t('select_operation')}</Text>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.6} onPress={hide}>
              <Text size={13} color="#5b5b5b">{t('back')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.grid}>
            {items.map(item => (
              <TouchableOpacity
                key={item.action}
                style={styles.cell}
                activeOpacity={0.6}
                disabled={item.disabled}
                onPress={() => { handlePress(item.action) }}
              >
                <View style={{ opacity: item.disabled ? 0.3 : 1 }}>
                  <Icon name={item.icon} size={24} color="#5b5b5b" />
                </View>
                <Text style={{ marginTop: 8, opacity: item.disabled ? 0.3 : 1 }} size={11} color="#939396" numberOfLines={1}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
})

const styles = createStyle({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  backBtn: {
    position: 'absolute',
    right: 12,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    paddingBottom: 20,
  },
  cell: {
    width: '25%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
})
