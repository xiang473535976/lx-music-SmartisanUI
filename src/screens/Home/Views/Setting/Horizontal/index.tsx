import { useRef } from 'react'
import { ScrollView, View } from 'react-native'
import NavList from './NavList'
import Main, { type MainType } from '../Main'
import { createStyle } from '@/utils/tools'

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 0.5,
  },
  nav: {
    height: '100%',
    width: '22%',
    borderRightWidth: 0.5,
  },
  main: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 14,
    paddingBottom: 14,
    flex: 0,
  },
})

export default () => {
  const mainRef = useRef<MainType>(null)

  return (
    <View style={{ ...styles.container, borderTopColor: '#ededed' }}>
      <View style={{ ...styles.nav, borderRightColor: '#ededed' }}>
        <NavList onChangeId={(id) => mainRef.current?.setActiveId(id)} />
      </View>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style={styles.main}>
          <Main ref={mainRef} />
        </View>
      </ScrollView>
    </View>
  )
}
