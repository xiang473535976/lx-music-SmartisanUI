import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import ConfirmAlert, { type ConfirmAlertType } from '@/components/common/ConfirmAlert'
import Text from '@/components/common/Text'
import { InteractionManager, View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import ChoiceBar from '@/screens/Home/Views/Setting/components/ChoiceBar'
import { getListMusics, setFetchingListStatus, updateListMusicPosition } from '@/core/list'
import { sortListMusicInfo } from './utils'

const Title = ({ title }: {
  title: string
}) => {
  return (
    <Text style={styles.title} size={16} color={'#333333'}>
      {title}
    </Text>
  )
}

export interface FormType {
  reset: () => void
  getForm: () => ([FieldName | undefined, FieldType | undefined])
}
const fieldNames = ['name', 'singer', 'album', 'time', 'source'] as const
const fieldTypes = ['up', 'down', 'random'] as const
type FieldName = typeof fieldNames[number]
type FieldType = typeof fieldTypes[number]
const Form = forwardRef<FormType, {}>((props, ref) => {
  const t = useI18n()
  const [name, setName] = useState<FieldName>()
  const [type, setType] = useState<FieldType>()
  useImperativeHandle(ref, () => ({
    reset() {
      setName(undefined)
      setType(undefined)
    },
    getForm() {
      return [name, type]
    },
  }))

  return (
    <View>
      <View style={styles.formSection}>
        <Text size={13} color={'#939396'}>{t('list_sort_modal_by_field')}</Text>
        <ChoiceBar
          options={fieldNames.map(n => ({ id: n, label: t(`list_sort_modal_by_${n}`) }))}
          activeId={name ?? ''}
          onChange={(id) => { setName(id as FieldName) }} />
      </View>
      <View style={styles.formSection}>
        <Text size={13} color={'#939396'}>{t('list_sort_modal_by_type')}</Text>
        <ChoiceBar
          options={fieldTypes.map(n => ({ id: n, label: t(`list_sort_modal_by_${n}`) }))}
          activeId={type ?? ''}
          onChange={(id) => { setType(id as FieldType) }} />
      </View>
    </View>
  )
})

export interface ListMusicSortType {
  show: (listInfo: LX.List.MyListInfo) => void
}
const initSelectInfo = {}

// const getName = (id: string, name: string) => {
//   switch (id) {
//     case LIST_IDS.DEFAULT:
//       return global.i18n.t(name)
//     case LIST_IDS.LOVE:
//       return global.i18n.t(name)
//     default:
//       return name
//   }
// }

export default forwardRef<ListMusicSortType, {}>((props, ref) => {
  const alertRef = useRef<ConfirmAlertType>(null)
  const [title, setTitle] = useState('')
  const selectedListInfo = useRef<LX.List.MyListInfo>(initSelectInfo as LX.List.MyListInfo)
  const formTypeRef = useRef<FormType>(null)
  const [visible, setVisible] = useState(false)

  const handleShow = () => {
    alertRef.current?.setVisible(true)
  }
  useImperativeHandle(ref, () => ({
    show(listInfo) {
      setTitle(listInfo.name)
      selectedListInfo.current = listInfo
      if (visible) handleShow()
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          handleShow()
        })
      }
    },
  }))

  const handleSort = async() => {
    const [name, type] = formTypeRef.current!.getForm()
    // console.log(type, name)
    if (!type || (!name && type != 'random')) return
    const id = selectedListInfo.current.id
    let list = [...(await getListMusics(id))]
    setFetchingListStatus(id, true)
    requestAnimationFrame(() => {
      void InteractionManager.runAfterInteractions(() => {
        list = sortListMusicInfo(list, type, name!, global.i18n.locale)
        void updateListMusicPosition(id, 0, list.map(m => m.id))
        setFetchingListStatus(id, false)
      })
    })

    alertRef.current?.setVisible(false)
  }

  return (
    visible
      ? <ConfirmAlert
          ref={alertRef}
          onConfirm={handleSort}
        >
          <View style={styles.renameContent}>
            <Title title={title} />
            <Form ref={formTypeRef} />
          </View>
        </ConfirmAlert>
      : null
  )
})


const styles = createStyle({
  renameContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    // paddingTop: 15,
    paddingBottom: 25,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 12,
  },
})


