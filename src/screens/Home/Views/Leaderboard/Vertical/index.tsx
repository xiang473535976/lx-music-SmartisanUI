import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'

import MusicList, { type MusicListType } from '../MusicList'
import { getLeaderboardSetting, saveLeaderboardSetting } from '@/utils/data'
import HeaderBar, { type HeaderBarType, type HeaderBarProps } from './HeaderBar'
import { getBoardsList } from '@/core/leaderboard'
import { handleCollect, handlePlay } from '../listAction'
import boardState, { type BoardItem } from '@/store/leaderboard/state'

export default () => {
  const musicListRef = useRef<MusicListType>(null)
  const headerBarRef = useRef<HeaderBarType>(null)
  const boundInfo = useRef<{ source: LX.OnlineSource, id: string | null }>({ source: 'kw', id: null })
  // 榜单列表与当前选中榜单走 state → props，弹层打开时直接有数据
  const [boards, setBoards] = useState<BoardItem[]>([])
  const [activeBoardId, setActiveBoardId] = useState('')

  const handleBoundChange = (source: LX.OnlineSource, id: string) => {
    musicListRef.current?.loadList(source, id)
    void saveLeaderboardSetting({
      source,
      boardId: id,
    })
  }

  const onBoundChange: HeaderBarProps['onBoundChange'] = (id) => {
    boundInfo.current.id = id
    setActiveBoardId(id)
    void getBoardsList(boundInfo.current.source).then(list => {
      const bound = list.find(l => l.id == id)
      if (bound) headerBarRef.current?.setBound(boundInfo.current.source, id, bound.name)
    })
    handleBoundChange(boundInfo.current.source, id)
  }

  const onPlay: HeaderBarProps['onPlay'] = (id) => {
    boundInfo.current.id = id
    void handlePlay(id, boardState.listDetailInfo.list)
  }

  const onCollect: HeaderBarProps['onCollect'] = (id, name) => {
    boundInfo.current.id = id
    void handleCollect(id, name, boundInfo.current.source)
  }

  const onSourceChange: HeaderBarProps['onSourceChange'] = (source) => {
    boundInfo.current.source = source
    void getBoardsList(source).then(list => {
      if (!list.length) return
      const id = list[0].id
      boundInfo.current.id = id
      setBoards(list)
      setActiveBoardId(id)
      headerBarRef.current?.setBound(source, id, list[0].name ?? 'Unknown')
      handleBoundChange(source, id)
    })
  }

  useEffect(() => {
    void getLeaderboardSetting().then(({ source, boardId }) => {
      boundInfo.current.source = source
      boundInfo.current.id = boardId
      void getBoardsList(source).then(list => {
        const bound = list.find(l => l.id == boardId)
        setBoards(list)
        setActiveBoardId(boardId)
        headerBarRef.current?.setBound(source, boardId, bound?.name ?? 'Unknown')
      })
      musicListRef.current?.loadList(source, boardId)
    })
  }, [])

  return (
    <View style={styles.container}>
      <HeaderBar
        ref={headerBarRef}
        boards={boards}
        activeBoardId={activeBoardId}
        onSourceChange={onSourceChange}
        onBoundChange={onBoundChange}
        onPlay={onPlay}
        onCollect={onCollect}
      />
      <MusicList ref={musicListRef} />
    </View>
  )
}

const styles = createStyle({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
})
