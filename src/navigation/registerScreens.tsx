// @flow

import { Navigation } from 'react-native-navigation'

import {
  Home,
  PlayDetail,
  SonglistDetail,
  Comment,
  SettingScreen,
  SettingDetailScreen,
  PlayedList,
  About,
  UserApiScreen,
  ListDetail,
} from '@/screens'
import { Provider } from '@/store/Provider'

import {
  HOME_SCREEN,
  PLAY_DETAIL_SCREEN,
  SONGLIST_DETAIL_SCREEN,
  COMMENT_SCREEN,
  VERSION_MODAL,
  PACT_MODAL,
  SYNC_MODE_MODAL,
  SETTING_SCREEN,
  SETTING_DETAIL_SCREEN,
  PLAYED_LIST_SCREEN,
  ABOUT_SCREEN,
  USER_API_SCREEN,
  LIST_DETAIL_SCREEN,
} from './screenNames'
import VersionModal from './components/VersionModal'
import PactModal from './components/PactModal'
import SyncModeModal from './components/SyncModeModal'

function WrappedComponent(Component: any) {
  return function inject(props: Record<string, any>) {
    const EnhancedComponent = () => (
      <Provider>
        <Component
          {...props}
        />
      </Provider>
    )

    return <EnhancedComponent />
  }
}

export default () => {
  Navigation.registerComponent(HOME_SCREEN, () => WrappedComponent(Home))
  Navigation.registerComponent(PLAY_DETAIL_SCREEN, () => WrappedComponent(PlayDetail))
  Navigation.registerComponent(SONGLIST_DETAIL_SCREEN, () => WrappedComponent(SonglistDetail))
  Navigation.registerComponent(COMMENT_SCREEN, () => WrappedComponent(Comment))
  Navigation.registerComponent(VERSION_MODAL, () => WrappedComponent(VersionModal))
  Navigation.registerComponent(PACT_MODAL, () => WrappedComponent(PactModal))
  Navigation.registerComponent(SYNC_MODE_MODAL, () => WrappedComponent(SyncModeModal))
  Navigation.registerComponent(SETTING_SCREEN, () => WrappedComponent(SettingScreen))
  Navigation.registerComponent(SETTING_DETAIL_SCREEN, () => WrappedComponent(SettingDetailScreen))
  Navigation.registerComponent(PLAYED_LIST_SCREEN, () => WrappedComponent(PlayedList))
  Navigation.registerComponent(ABOUT_SCREEN, () => WrappedComponent(About))
  Navigation.registerComponent(USER_API_SCREEN, () => WrappedComponent(UserApiScreen))
  Navigation.registerComponent(LIST_DETAIL_SCREEN, () => WrappedComponent(ListDetail))

  console.info('All screens have been registered...')
}
