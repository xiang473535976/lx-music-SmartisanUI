import { View } from 'react-native'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { createStyle, toast } from '@/utils/tools'
import { useMusicExistsList } from '@/store/list/hook'

const HAMMER_TEXT = '#4d4d4d'
const HAMMER_LINE = '#ccdcdbdb'

export default ({ listInfo, onPress, musicInfo, width }: {
  listInfo: LX.List.MyListInfo
  onPress: (listInfo: LX.List.MyListInfo) => void
  musicInfo: LX.Music.MusicInfo
  width: number
}) => {
  const isExists = useMusicExistsList(listInfo, musicInfo)

  const handlePress = () => {
    if (isExists) {
      toast(global.i18n.t('list_add_tip_exists'))
      return
    }
    onPress(listInfo)
  }

  return (
    <View style={{ ...styles.listItem, width }}>
      <Button
        style={{ ...styles.button, opacity: isExists ? 0.4 : 1 }}
        onPress={handlePress}
      >
        <Text numberOfLines={1} size={14} color={HAMMER_TEXT}>{listInfo.name}</Text>
      </Button>
    </View>
  )
}

export const styles = createStyle({
  listItem: {
    paddingRight: 13,
  },
  button: {
    height: 34,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: HAMMER_LINE,
    backgroundColor: '#ffffff',
  },
})
