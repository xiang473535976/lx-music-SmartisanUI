import { View } from 'react-native'

import Text from '@/components/common/Text'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'

// 锤子迷你条第二行：歌手 12sp #939396（@dimen/music_artist / @color/textName）
// 锤子这里不显示 LRC 与时间，进度用条底部那根 1.5dp 红线表示（见 PlayerBar/index.tsx）
const FONT_SIZE = 12
const SUB_COLOR = '#939396'

export default ({ isHome = false }: { isHome?: boolean }) => {
  void isHome
  const musicInfo = usePlayerMusicInfo()

  return (
    <View style={styles.container}>
      <Text size={FONT_SIZE} color={SUB_COLOR} numberOfLines={1}>{musicInfo.singer ?? ''}</Text>
    </View>
  )
}

const styles = createStyle({
  container: {
    height: 18,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
