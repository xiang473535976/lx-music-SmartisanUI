import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { forwardRef, useImperativeHandle, useState } from 'react'


export interface CurrentTagBtnProps {
  onShowList: () => void
}

export interface CurrentTagBtnType {
  setCurrentTagInfo: (name: string) => void
}

export default forwardRef<CurrentTagBtnType, CurrentTagBtnProps>(({ onShowList }, ref) => {
  const t = useI18n()
  const [name, setName] = useState('')

  useImperativeHandle(ref, () => ({
    setCurrentTagInfo(name) {
      if (!name) name = t('songlist_tag_default')
      setName(name)
    },
  }))

  return (
    <Button style={styles.btn} onPress={onShowList}>
      <Text style={styles.sourceMenu} size={14} color="#4d4d4d" numberOfLines={1}>{name}</Text>
      <Icon name="chevron-right" size={11} color="#939396" style={styles.arrow} />
    </Button>
  )
})


const styles = createStyle({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 8,
    justifyContent: 'center',
  },
  sourceMenu: {
    textAlign: 'center',
  },
  arrow: {
    marginLeft: 2,
    transform: [{ rotate: '90deg' }],
  },
})
