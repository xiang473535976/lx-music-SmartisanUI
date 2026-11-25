import { memo, useRef, useState } from 'react'
import { View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import Button from '../../components/Button'
import ChoosePath, { type ChoosePathType } from '@/components/common/ChoosePath'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { getLocalMusicList, scanLocalMusic } from '@/core/localMusic'
import { handleImportMediaFile } from '@/screens/Home/Views/Mylist/MyList/listAction'

/**
 * 本地音乐的两个设备级操作。
 *
 * 这两个动作与「某个列表」无关，放在「我的列表 → 更多」里要先进弹层再找，
 * 挪到设置里更顺手，也把「我的列表」的更多弹层腾出来只放列表自己的操作。
 */
export default memo(() => {
  const t = useI18n()
  const choosePathRef = useRef<ChoosePathType>(null)
  const [visible, setVisible] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    if (scanning) return
    setScanning(true)
    void scanLocalMusic().finally(() => { setScanning(false) })
  }

  const handleSelectFolder = () => {
    if (!visible) {
      setVisible(true)
      requestAnimationFrame(() => {
        choosePathRef.current?.show({
          title: global.i18n.t('list_select_local_file_desc'),
          dirOnly: true,
          isPersist: true,
        })
      })
      return
    }
    choosePathRef.current?.show({
      title: global.i18n.t('list_select_local_file_desc'),
      dirOnly: true,
      isPersist: true,
    })
  }

  const onConfirmPath = (dir: string) => {
    void getLocalMusicList().then((listInfo) => {
      if (!listInfo) return
      void handleImportMediaFile(listInfo, dir)
    })
  }

  return (
    <>
      <SubTitle title={t('setting_local_music')}>
        <View style={styles.list}>
          <Button onPress={handleScan}>{t('list_scan_local_music')}</Button>
          <Button onPress={handleSelectFolder}>{t('list_select_local_file')}</Button>
        </View>
      </SubTitle>
      {visible ? <ChoosePath ref={choosePathRef} onConfirm={onConfirmPath} /> : null}
    </>
  )
})

const styles = createStyle({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
})
