import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'

const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#333333'

export default ({ selectedList, isMove }: {
  selectedList: LX.Music.MusicInfo[]
  isMove: boolean
}) => {
  const t = useI18n()
  return (
    <Text style={styles.title} size={15} color={HAMMER_TEXT}>
      {t(isMove ? 'list_multi_add_title_first_move' : 'list_multi_add_title_first_add')} <Text color={HAMMER_RED} size={15} style={styles.bold}>{selectedList.length}</Text> {t('list_multi_add_title_last')}
    </Text>
  )
}

const styles = createStyle({
  title: {
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
})
