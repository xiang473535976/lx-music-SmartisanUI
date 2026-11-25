import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import Text from '@/components/common/Text'
import PageHeader from '@/components/common/PageHeader'
import PageContent from '@/components/PageContent'
import { pop } from '@/navigation'
import { useI18n } from '@/lang'
import { SmartisanImages } from '@/resources/smartisan'

const TEXT = '#4d4d4d'
const SUB = '#939396'
const LINE = '#ededed'
const RED = '#E64040'
const PAGE_BG = '#f2f2f2'

interface Section {
  title: string
  items: Array<{ label: string, value?: string }>
}

/**
 * 「关于锤子音乐」页
 * 锤子风格：浅灰底 + 白色分组卡 + 发丝分隔线，无按钮堆砌。
 */
export default ({ componentId }: { componentId: string }) => {
  const t = useI18n()

  const back = () => {
    void pop(componentId)
  }

  const openUrl = (url: string) => {
    void Linking.openURL(url).catch(() => {})
  }

  const sections: Section[] = [
    {
      title: '这是什么',
      items: [
        {
          label: '锤子音乐是一款第三方音乐播放器，界面参照锤子科技（Smartisan）的播放器重新实现，' +
            '播放内核与在线音源来自开源的洛雪音乐（lx-music-mobile）。',
        },
      ],
    },
    {
      title: '功能',
      items: [
        { label: '在线搜索', value: '酷我、酷狗、QQ、网易、咪咕等多音源' },
        { label: '榜单与歌单', value: '排行榜、推荐歌单、歌单详情' },
        { label: '我的列表', value: '收藏、自建列表、播放历史' },
        { label: '本地音乐', value: '扫描本机音频文件' },
        { label: '播放', value: '后台播放、通知栏控制、定时停止' },
        { label: '歌词', value: '逐行高亮、桌面歌词、自定义字号与对齐' },
      ],
    },
    {
      title: '关于在线播放',
      items: [
        {
          label: '洛雪音乐自 1.9 起不再内置在线音源，首次使用需在「我的 → 自定义源管理」中' +
            '导入一个自定义音源脚本，导入后即可在线播放。',
        },
      ],
    },
    {
      title: '技术信息',
      items: [
        { label: '界面框架', value: 'React Native' },
        { label: '播放内核', value: 'react-native-track-player · ExoPlayer' },
        { label: '应用版本', value: `v${process.versions.app}` },
      ],
    },
    {
      title: '致谢',
      items: [
        { label: '洛雪音乐（lx-music-mobile）', value: '播放内核与在线音源' },
        { label: 'SmartisanMusicPlayer', value: '界面与交互参考' },
      ],
    },
  ]

  return (
    <PageContent>
      <PageHeader title={t('setting_about')} onBack={back} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* 品牌区 */}
        <View style={styles.brand}>
          <Image source={SmartisanImages.appLogo} style={styles.logo} resizeMode="contain" />
          <Text size={18} color={TEXT} style={styles.brandName}>{t('app_name')}</Text>
          <Text size={12} color={SUB} style={styles.brandVer}>v{process.versions.app}</Text>
          <Text size={12} color={SUB} style={styles.brandSlogan}>O ever youthful, O ever weeping.</Text>
        </View>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text size={12} color={SUB} style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <View
                  key={item.label}
                  style={[styles.row, index == section.items.length - 1 ? styles.rowLast : null]}
                >
                  {item.value
                    ? (
                      <>
                        <Text size={14} color={TEXT} style={styles.rowLabel}>{item.label}</Text>
                        <Text size={13} color={SUB} style={styles.rowValue}>{item.value}</Text>
                      </>
                      )
                    : <Text size={13} color={TEXT} style={styles.paragraph}>{item.label}</Text>}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.link}
          activeOpacity={0.6}
          onPress={() => { openUrl('https://github.com/lyswhut/lx-music-mobile') }}
        >
          <Text size={13} color={RED}>https://github.com/lyswhut/lx-music-mobile</Text>
        </TouchableOpacity>
      </ScrollView>
    </PageContent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingBottom: 28,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 22,
  },
  logo: {
    width: 76,
    height: 76,
  },
  brandName: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  brandVer: {
    marginTop: 4,
  },
  brandSlogan: {
    marginTop: 10,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 7,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: LINE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    flexGrow: 1,
    flexShrink: 1,
  },
  rowValue: {
    flexShrink: 0,
    marginLeft: 12,
    textAlign: 'right',
  },
  paragraph: {
    flex: 1,
    lineHeight: 21,
  },
  link: {
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 8,
  },
})
