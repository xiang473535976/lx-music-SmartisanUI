import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { View } from 'react-native'

import SourceSelector, {
  type SourceSelectorType as _SourceSelectorType,
  // type SourceSelectorProps as _SourceSelectorProps,
} from '@/components/SourceSelector'
import BoardsList, { type BoardsListProps } from '../BoardsList'
import { createStyle } from '@/utils/tools'
import { handleCollect, handlePlay } from '../listAction'
import boardState, { type BoardItem, type InitState } from '@/store/leaderboard/state'
import { getBoardsList } from '@/core/leaderboard'

type Sources = Readonly<InitState['sources']>
// type SourceSelectorProps = _SourceSelectorProps<Sources>
type SourceSelectorType = _SourceSelectorType<Sources>

export interface LeftBarProps {
  onChangeList: (source: LX.OnlineSource, id: string) => void
}

export interface LeftBarType {
  setBound: (source: LX.OnlineSource, id: string) => void
}

export default forwardRef<LeftBarType, LeftBarProps>(({ onChangeList }, ref) => {
  const sourceSelectorRef = useRef<SourceSelectorType>(null)
  const boundInfo = useRef<{ source: LX.OnlineSource, id: string | null }>({ source: 'kw', id: null })
  const [boards, setBoards] = useState<BoardItem[]>([])
  const [activeBoardId, setActiveBoardId] = useState('')

  useImperativeHandle(ref, () => ({
    setBound(source, listId) {
      boundInfo.current = { source, id: listId }
      sourceSelectorRef.current?.setSourceList(boardState.sources, source)
      setActiveBoardId(listId)
      void getBoardsList(source).then(list => {
        setBoards(list)
      })
    },
  }), [])


  const onSourceChange = (source: LX.OnlineSource) => {
    boundInfo.current.source = source
    void getBoardsList(source).then(list => {
      if (!list.length) return
      const id = list[0].id
      boundInfo.current.id = id
      setBoards(list)
      setActiveBoardId(id)
      onChangeList(source, id)
    })
  }
  const onBoundChange: BoardsListProps['onBoundChange'] = (id) => {
    boundInfo.current.id = id
    setActiveBoardId(id)
    onChangeList(boundInfo.current.source, id)
  }
  const onPlay: BoardsListProps['onPlay'] = (id) => {
    boundInfo.current.id = id
    void handlePlay(id, boardState.listDetailInfo.list)
  }
  const onCollect: BoardsListProps['onCollect'] = (id, name) => {
    boundInfo.current.id = id
    void handleCollect(id, name, boundInfo.current.source)
  }

  return (
    <View style={{ ...styles.container, borderRightColor: '#ededed' }}>
      <View style={styles.selector}>
        <SourceSelector ref={sourceSelectorRef} onSourceChange={onSourceChange} />
      </View>
      <BoardsList
        list={boards}
        activeId={activeBoardId}
        onBoundChange={onBoundChange}
        onPlay={onPlay}
        onCollect={onCollect}
      />
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'column',
    width: '26%',
    maxWidth: 180,
    minWidth: 110,
    flexGrow: 0,
    flexShrink: 0,
    borderRightWidth: 0.5,
  },
  selector: {
    height: 38,
  },
})
