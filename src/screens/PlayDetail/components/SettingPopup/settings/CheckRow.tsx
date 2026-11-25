import { Image, TouchableOpacity } from 'react-native'
import Text from '@/components/common/Text'
import { SmartisanImages } from '@/resources/smartisan'
import { createStyle } from '@/utils/tools'

// 锤子风设置行：整行可点 + 右侧勾选框
const HAMMER_TEXT = '#4d4d4d'

export default ({ check, label, onChange }: {
  check: boolean
  label: string
  onChange: (check: boolean) => void
}) => {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={() => { onChange(!check) }}>
      <Text size={15} color={HAMMER_TEXT} style={styles.label}>{label}</Text>
      <Image source={check ? SmartisanImages.checkboxOn : SmartisanImages.checkboxOff} style={styles.checkbox} resizeMode="contain" />
    </TouchableOpacity>
  )
}

const styles = createStyle({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    width: '100%',
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
  },
})
