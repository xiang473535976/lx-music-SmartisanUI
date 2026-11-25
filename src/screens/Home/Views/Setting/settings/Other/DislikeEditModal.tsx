import { useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react'
import Text from '@/components/common/Text'
import { type LayoutChangeEvent, View } from 'react-native'
import Input, { type InputType } from '@/components/common/Input'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import Dialog, { type DialogType } from '@/components/common/Dialog'
import Button from '@/components/common/Button'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_LINE = '#ccdcdbdb'

interface RuleInputType {
  setText: (text: string) => void
  getText: () => string
  focus: () => void
}
const RuleInput = forwardRef<RuleInputType, {}>((props, ref) => {
  const t = useI18n()
  const [text, setText] = useState('')
  const inputRef = useRef<InputType>(null)
  const [height, setHeight] = useState(100)

  useImperativeHandle(ref, () => ({
    getText() {
      return text.trim()
    },
    setText(text) {
      setText(text)
    },
    focus() {
      inputRef.current?.focus()
    },
  }))

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height)
  }, [])

  return (
    <View style={styles.inputContent} onLayout={handleLayout}>
      <Input
        ref={inputRef}
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
        placeholder={t('setting_dislike_list_input_tip')}
        size={13}
        style={{ ...styles.input, height, backgroundColor: '#ffffff' }}
      />
    </View>
  )
})


export interface DislikeEditModalProps {
  onSave: (rules: string) => void
  // onSourceChange: SourceSelectorProps['onSourceChange']
}
export interface DislikeEditModalType {
  show: (rules: string) => void
}

export default forwardRef<DislikeEditModalType, DislikeEditModalProps>(({ onSave }, ref) => {
  const dialogRef = useRef<DialogType>(null)
  // const sourceSelectorRef = useRef<SourceSelectorType>(null)
  const inputRef = useRef<RuleInputType>(null)
  const [visible, setVisible] = useState(false)
  const t = useI18n()

  const handleShow = (rules: string) => {
    dialogRef.current?.setVisible(true)
    requestAnimationFrame(() => {
      inputRef.current?.setText(rules.length ? rules + '\n' : rules)
      // sourceSelectorRef.current?.setSource(source)
      // setTimeout(() => {
      //   inputRef.current?.focus()
      // }, 300)
    })
  }
  useImperativeHandle(ref, () => ({
    show(rules) {
      if (visible) handleShow(rules)
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          handleShow(rules)
        })
      }
    },
  }))

  const handleCancel = () => {
    dialogRef.current?.setVisible(false)
  }
  const handleConfirm = () => {
    let rules = inputRef.current?.getText() ?? ''
    handleCancel()
    onSave(rules)
  }

  return (
    visible
      ? (
          <Dialog height='80%' ref={dialogRef} bgHide={false}>
            <View style={styles.content}>
              <RuleInput ref={inputRef} />
              <Text style={styles.inputTipText} size={13} color={'#939396'}>{t('setting_dislike_list_tips')}</Text>
            </View>
            <View style={styles.btns}>
              <Button style={styles.btn} onPress={handleCancel}>
                <Text size={14} color={HAMMER_TEXT} style={styles.btnText}>{t('cancel')}</Text>
              </Button>
              <Button style={styles.btn} onPress={handleConfirm}>
                <Text size={14} color={HAMMER_TEXT} style={styles.btnText}>{t('confirm')}</Text>
              </Button>
            </View>
          </Dialog>
        ) : null
  )
})


const styles = createStyle({
  content: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  col: {
    flexDirection: 'row',
    height: 38,
  },
  // selector: {
  //   borderTopLeftRadius: 4,
  //   borderBottomLeftRadius: 4,
  // },
  inputContent: {
    flexGrow: 1,
    flexShrink: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  input: {
    minWidth: 290,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
  inputTipText: {
    marginTop: 8,
  },

  btns: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 4,
  },
  btn: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
    backgroundColor: '#ffffff',
    marginRight: 10,
  },
  btnText: {
    fontWeight: 'bold',
  },
})


