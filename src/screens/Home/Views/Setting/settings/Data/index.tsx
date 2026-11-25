import { memo } from 'react'

import Sync from '../Sync'
import Backup from '../Backup'
import LocalMusic from './LocalMusic'
import Other from '../Other'

/**
 * 数据与缓存：把「数据同步 / 备份与恢复 / 其他」三组合并到一个分类，
 * 让设置分类从 8 类收敛到 6 类，避免分类过多。
 */
export default memo(() => {
  return (
    <>
      <Sync />
      <Backup />
      <LocalMusic />
      <Other />
    </>
  )
})
