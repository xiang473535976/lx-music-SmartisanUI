import { forwardRef, useImperativeHandle, useRef } from 'react'

import ListMenu, { type ListMenuType } from './ListMenu'
import ListNameEdit, { type ListNameEditType } from './ListNameEdit'
import ListImportExport, { type ListImportExportType } from './ListImportExport'
import { handleRemove, handleScanLocalMusic, handleSync } from './listAction'
import ListMusicSort, { type ListMusicSortType } from './ListMusicSort'
import DuplicateMusic, { type DuplicateMusicType } from './DuplicateMusic'

export interface ListActionsType {
  newList: (position: number) => void
  rename: (info: LX.List.UserListInfo) => void
  sort: (info: LX.List.MyListInfo) => void
  duplicateMusic: (info: LX.List.MyListInfo) => void
  importList: (info: LX.List.MyListInfo, position: number) => void
  exportList: (info: LX.List.MyListInfo, position: number) => void
  selectLocalFile: (info: LX.List.MyListInfo, position: number) => void
  sync: (info: LX.List.UserListInfo) => void
  scanLocalMusic: (info: LX.List.MyListInfo) => void
  remove: (info: LX.List.UserListInfo) => void
}

/**
 * 列表操作的弹层集合（新建/重命名/排序/查重/导入导出/移除…）。
 *
 * 这些弹层原来挂在侧滑抽屉的导航视图里，抽屉去掉之后改由这里统一承载，
 * 通过 ref 暴露成一个个命令式方法给「更多」弹层调用。
 */
export default forwardRef<ListActionsType, {}>((props, ref) => {
  const listNameEditRef = useRef<ListNameEditType>(null)
  const listMusicSortRef = useRef<ListMusicSortType>(null)
  const duplicateMusicRef = useRef<DuplicateMusicType>(null)
  const listImportExportRef = useRef<ListImportExportType>(null)
  const listMenuRef = useRef<ListMenuType>(null)

  useImperativeHandle(ref, () => ({
    newList(position) {
      listNameEditRef.current?.showCreate(position)
    },
    rename(info) {
      listNameEditRef.current?.show(info)
    },
    sort(info) {
      listMusicSortRef.current?.show(info)
    },
    duplicateMusic(info) {
      duplicateMusicRef.current?.show(info)
    },
    importList(info, position) {
      listImportExportRef.current?.import(info, position)
    },
    exportList(info, position) {
      listImportExportRef.current?.export(info, position)
    },
    selectLocalFile(info, position) {
      listImportExportRef.current?.selectFile(info, position)
    },
    sync(info) {
      handleSync(info)
    },
    scanLocalMusic(info) {
      void handleScanLocalMusic(info)
    },
    remove(info) {
      handleRemove(info)
    },
  }), [])

  return (
    <>
      <ListNameEdit ref={listNameEditRef} />
      <ListMusicSort ref={listMusicSortRef} />
      <DuplicateMusic ref={duplicateMusicRef} />
      <ListImportExport ref={listImportExportRef} />
      {/* ListMenu 仍保留：列表行右侧的「⋮」长按菜单还用它（横向布局用得到） */}
      <ListMenu
        ref={listMenuRef}
        onNew={position => listNameEditRef.current?.showCreate(position)}
        onRename={info => listNameEditRef.current?.show(info)}
        onSort={info => listMusicSortRef.current?.show(info)}
        onDuplicateMusic={info => duplicateMusicRef.current?.show(info)}
        onImport={(info, position) => listImportExportRef.current?.import(info, position)}
        onExport={(info, position) => listImportExportRef.current?.export(info, position)}
        onRemove={info => { handleRemove(info) }}
        onSync={info => { handleSync(info) }}
        onSelectLocalFile={(info, position) => listImportExportRef.current?.selectFile(info, position)}
        onScanLocalMusic={info => { void handleScanLocalMusic(info) }}
      />
    </>
  )
})
