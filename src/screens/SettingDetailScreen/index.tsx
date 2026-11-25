import { ScrollView } from 'react-native'

import PageContent from '@/components/PageContent'
import PageHeader from '@/components/common/PageHeader'
import Basic from '@/screens/Home/Views/Setting/settings/Basic'
import Player from '@/screens/Home/Views/Setting/settings/Player'
import LyricDesktop from '@/screens/Home/Views/Setting/settings/LyricDesktop'
import Search from '@/screens/Home/Views/Setting/settings/Search'
import List from '@/screens/Home/Views/Setting/settings/List'
import Data from '@/screens/Home/Views/Setting/settings/Data'
import { SectionHideTitleContext } from '@/screens/Home/Views/Setting/components/Section'
import { useI18n } from '@/lang'
import { pop } from '@/navigation'
import { type SettingScreenIds } from '@/screens/Home/Views/Setting/Main'
import { createStyle } from '@/utils/tools'

const TITLE_KEYS = {
  basic: 'setting_basic',
  player: 'setting_player',
  lyric_desktop: 'setting_lyric_desktop',
  search: 'setting_search',
  list: 'setting_list',
  data: 'setting_data',
} as const

const Content = ({ id }: { id: SettingScreenIds }) => {
  switch (id) {
    case 'player': return <Player />
    case 'lyric_desktop': return <LyricDesktop />
    case 'search': return <Search />
    case 'list': return <List />
    case 'data': return <Data />
    case 'basic':
    default: return <Basic />
  }
}

/**
 * 设置二级页面：只渲染某一个分类的设置项。
 * 由 SettingScreen 的分类首屏 push 进入，passProps 传 id。
 */
export default ({ componentId, id }: { componentId: string, id: SettingScreenIds }) => {
  const t = useI18n()

  const handleBack = () => {
    void pop(componentId)
  }

  return (
    <PageContent>
      <PageHeader title={t(TITLE_KEYS[id])} onBack={handleBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps={'always'}>
        <SectionHideTitleContext.Provider value={true}>
          <Content id={id} />
        </SectionHideTitleContext.Provider>
      </ScrollView>
    </PageContent>
  )
}

const styles = createStyle({
  scroll: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 16,
  },
})
