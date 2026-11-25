import { memo } from 'react'

import PageHeader from '@/components/common/PageHeader'
import { pop } from '@/navigation'
import { useI18n } from '@/lang'
import commonState from '@/store/common/state'

export default memo(({ musicInfo }: {
  musicInfo: LX.Music.MusicInfo
}) => {
  const t = useI18n()

  const back = () => {
    void pop(commonState.componentIds.comment!)
  }

  return (
    <PageHeader
      title={t('comment_title', { name: musicInfo.name, singer: musicInfo.singer })}
      onBack={back}
    />
  )
})
