import { createContext, useContext } from 'react'
import { View } from 'react-native'

import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'


/**
 * 二级设置页的标题栏已经显示了分类名，此时用 Provider 传 true 把分组标题条省掉，
 * 避免「基本设置」在标题栏和内容里各出现一次。
 */
export const SectionHideTitleContext = createContext(false)

interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
}

/**
 * 锤子风分段：灰字分段标题 + 白色内容卡。
 * 标题条不画底色——页面底 #f2f2f2 与白卡本身已经形成分界，再加一条 #ededed 会显得多余。
 */
export default ({ title, children }: Props) => {
  const hideTitle = useContext(SectionHideTitleContext)

  return (
    <View style={styles.container}>
      {hideTitle
        ? null
        : (
          <View style={styles.titleBar}>
            <Text style={styles.title} size={12} color="#5b5b5b">{title}</Text>
          </View>
          )}
      <View style={styles.card}>
        {children}
      </View>
    </View>
  )
}


const styles = createStyle({
  container: {
    marginBottom: 12,
  },
  titleBar: {
    height: 26,
    justifyContent: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  title: {
  },
  card: {
    backgroundColor: '#fff',
  },
})
