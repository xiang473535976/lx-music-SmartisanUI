import Header from './Header'
import Main from './Main'

/**
 * 竖屏首页内容区
 * 原先这里用 DrawerLayoutFixed 包了一个左侧抽屉（DrawerNav），但首页 Header 从来没有
 * 汉堡按钮，changeMenuVisible(true) 全仓无发送方，抽屉实际不可达，故整体移除。
 * 列表切换已由「我的列表」顶部的横向 chip 条承担。
 */
const Content = () => {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}

export default Content
