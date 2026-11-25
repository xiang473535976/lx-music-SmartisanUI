import { useEffect, useState } from 'react'

// 扫描动作的模块级桥：Header 上的扫描按钮与本地音乐页面不在同一棵子树里，
// 用最简单的回调注册来打通，避免为此新增全局事件。
let scanHandler: (() => void) | null = null

export const setScanHandler = (handler: (() => void) | null) => {
  scanHandler = handler
}

export const runScan = () => {
  scanHandler?.()
}

let scanning = false
const listeners = new Set<(scanning: boolean) => void>()

export const setScanning = (value: boolean) => {
  if (scanning == value) return
  scanning = value
  for (const listener of listeners) listener(value)
}

export const useScanning = () => {
  const [value, setValue] = useState(scanning)
  useEffect(() => {
    listeners.add(setValue)
    setValue(scanning)
    return () => { listeners.delete(setValue) }
  }, [])
  return value
}
