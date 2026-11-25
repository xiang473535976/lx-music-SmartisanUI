import Content from './Content'
import TabBar from './TabBar'
import PlayerBar from '@/components/player/PlayerBar'

export default () => {
  return (
    <>
      <Content />
      <PlayerBar isHome />
      <TabBar />
    </>
  )
}
