import { useRef } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import PageContent from '@/components/PageContent'
import PageHeader from '@/components/common/PageHeader'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { pop } from '@/navigation'
import { createStyle, openUrl } from '@/utils/tools'
import List from '@/screens/Home/Views/Setting/settings/Basic/UserApiEditModal/List'
import ImportBtn from '@/screens/Home/Views/Setting/settings/Basic/UserApiEditModal/ImportBtn'

const HAMMER_SUB = '#939396'
const HAMMER_LINE = '#ededed'

/**
 * 自定义源管理独立页。
 * 原先是一个 Dialog 弹窗，列表一长就得在弹窗里滚，体验很差；
 * 改成和设置其他二级页一致的整屏页：标题栏 + 白卡列表 + 底部说明，
 * 导入入口放在标题栏右侧。
 */
export default ({ componentId }: { componentId: string }) => {
  const t = useI18n()
  const scrollRef = useRef<ScrollView>(null)

  const handleBack = () => {
    void pop(componentId)
  }

  const openFAQPage = () => {
    void openUrl('https://lyswhut.github.io/lx-music-doc/mobile/custom-source')
  }

  return (
    <PageContent>
      <PageHeader
        title={t('setting_basic_source_user_api_btn')}
        onBack={handleBack}
        rightSlot={<ImportBtn btnStyle={styles.headerBtn} />}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps={'always'}
      >
        <View style={styles.card}>
          <List />
        </View>
        <View style={styles.tips}>
          <Text size={12} color={HAMMER_SUB} style={styles.tipText}>{t('user_api_readme')}</Text>
          <TouchableOpacity onPress={openFAQPage}>
            <Text size={12} color={'#E64040'} style={styles.faq}>FAQ</Text>
          </TouchableOpacity>
          <Text size={12} color={HAMMER_SUB} style={styles.tipText}>{t('user_api_note')}</Text>
        </View>
      </ScrollView>
    </PageContent>
  )
}

const styles = createStyle({
  scroll: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: HAMMER_LINE,
  },
  headerBtn: {
    height: 48,
    paddingLeft: 12,
    paddingRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
  },
  tipText: {
    lineHeight: 19,
  },
  faq: {
    marginTop: 4,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
})
