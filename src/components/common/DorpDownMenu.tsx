import { useRef } from 'react'
// import { View } from 'react-native'

import Menu, { type MenuType, type MenuProps, type Menus } from './Menu'
import Button, { type BtnType, type BtnProps } from './Button'
// import { useLayout } from '@/utils/hooks'

// 菜单最小宽度。按钮往往只有两三个字（比如标题栏的「导入」），
// 直接拿按钮宽度当菜单宽度会把「本地导入 / 在线导入」这类四字项截断。
const MENU_MIN_WIDTH = 112

export interface DorpDownMenuProps<T extends Menus> extends Omit<MenuProps<T>, 'width'> {
  children: React.ReactNode
  btnStyle?: BtnProps['style']
  /** 显式指定菜单宽度（不传则取按钮宽度与最小宽度的较大值） */
  width?: number
}

export default <T extends Menus>({
  menus,
  onPress,
  height,
  fontSize,
  center,
  children,
  activeId,
  btnStyle,
  width,
}: DorpDownMenuProps<T>) => {
  const buttonRef = useRef<BtnType>(null)
  const menuRef = useRef<MenuType>(null)

  const showMenu = () => {
    buttonRef.current?.measure((fx, fy, btnWidth, btnHeight, px, py) => {
      // 菜单至少和按钮一样宽，但不小于 MENU_MIN_WIDTH，
      // 否则「导入」这种两字按钮弹出的菜单装不下四个字的选项。
      const menuWidth = Math.ceil(width ?? Math.max(btnWidth, MENU_MIN_WIDTH))
      menuRef.current?.show(
        { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(btnWidth), h: Math.ceil(btnHeight) },
        { width: menuWidth, height: btnHeight },
      )
    })
  }

  return (
    <Button style={btnStyle} ref={buttonRef} onPress={showMenu}>
      {children}
      <Menu
        ref={menuRef}
        menus={menus}
        center={center}
        onPress={onPress}
        fontSize={fontSize}
        height={height}
        activeId={activeId}
      />
    </Button>
  )
}
