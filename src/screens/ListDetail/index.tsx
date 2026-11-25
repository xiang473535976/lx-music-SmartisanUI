import { memo, useEffect, useState } from 'react'
import { View } from 'react-native'

import PageContent from '@/components/PageContent'
import PageHeader from '@/components/common/PageHeader'
import PlayerBar from '@/components/player/PlayerBar'
import MusicList from '@/screens/Home/Views/Mylist/MusicList'
import { useI18n } from '@/lang'
import { pop } from '@/navigation'
import { setActiveList } from '@/core/list'
import { getLocalMusicList, LOCAL_LIST_ID } from '@/core/localMusic'
import { createStyle } from '@/utils/tools'

export interface ListDetailProps {
  componentId: string
  listId: string
  title?: string
}

/**
 * 「我的收藏」/「本地音乐」共用的独立列表页。
 * 由 pushListDetailScreen(componentId, listId, title) 传入目标列表与标题，
 * 内部先把 activeList 切到目标列表，再复用「我的列表」的 MusicList 组件（隐藏其顶部列表条）。
 */
export default memo(({ componentId, listId, title }: ListDetailProps) => {
  const t = useI18n()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async() => {
      if (listId == LOCAL_LIST_ID) await getLocalMusicList()
      setActiveList(listId)
      if (!cancelled) setReady(true)
    })()
    return () => { cancelled = true }
  }, [listId])

  const handleBack = () => { void pop(componentId) }

  return (
    <PageContent>
      <PageHeader title={title ?? t('local_music_list_name')} onBack={handleBack} />
      <View style={styles.body}>
        {ready ? <MusicList hideActiveList /> : null}
      </View>
      <PlayerBar />
    </PageContent>
  )
})

const styles = createStyle({
  body: {
    flex: 1,
  },
})
