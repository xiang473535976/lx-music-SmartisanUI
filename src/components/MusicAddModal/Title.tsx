import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'

const HAMMER_RED = '#E64040'
const HAMMER_TEXT = '#333333'

export default ({ musicInfo, isMove }: {
  musicInfo: LX.Music.MusicInfo
  isMove: boolean
}) => {
  const t = useI18n()
  return (
    <Text style={styles.title} size={15} color={HAMMER_TEXT}>
      {t(isMove ? 'list_add_title_first_move' : 'list_add_title_first_add')} <Text size={15} color={HAMMER_RED} style={styles.bold}>{musicInfo.name}</Text> {t('list_add_title_last')}
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
