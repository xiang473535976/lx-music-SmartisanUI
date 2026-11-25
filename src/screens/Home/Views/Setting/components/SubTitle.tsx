import { memo } from 'react'

import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'

/**
 * 锤子风的次级小节：灰色小标题 + 白底内容。
 * 不再加顶部发丝线——白卡与页面底色之间已经是天然分界。
 */
export default memo(({ title, children }: {
  title: string
  children: React.ReactNode | React.ReactNode[]
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} size={13} color="#939396">{title}</Text>
      {children}
    </View>
  )
})


const styles = createStyle({
  container: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
  },
})
