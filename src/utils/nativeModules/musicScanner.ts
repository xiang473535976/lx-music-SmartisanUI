import { NativeModules, PermissionsAndroid, Platform, type Permission } from 'react-native'

const { MusicScanner } = NativeModules

/**
 * MediaStore 扫描出的单条音频记录（字段来自原生 MusicScannerModule）
 */
export interface ScannerMusic {
  id: number
  title: string
  artist: string
  album: string
  albumId: number
  /** 时长（毫秒） */
  duration: number
  size: number
  path: string
  dateAdded: number
  track: number
  /** content://media/external/audio/media/<id> */
  uri: string
}

const getAndroidVersion = (): number => {
  const version = Platform.Version
  return typeof version == 'number' ? version : parseInt(version, 10)
}

export const getAudioPermissionName = (): Permission => {
  return getAndroidVersion() >= 33
    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
}

export const hasAudioPermission = async(): Promise<boolean> => {
  if (Platform.OS != 'android') return false
  try {
    return await MusicScanner.hasPermission() as boolean
  } catch {
    return false
  }
}

export const requestAudioPermission = async(): Promise<boolean> => {
  if (Platform.OS != 'android') return false
  if (await hasAudioPermission()) return true
  try {
    const result = await PermissionsAndroid.request(getAudioPermissionName())
    return result == PermissionsAndroid.RESULTS.GRANTED
  } catch {
    return false
  }
}

/**
 * 扫描设备本地音乐，返回 MediaStore 记录列表（失败时 reject）
 */
export const scanMusic = async(): Promise<ScannerMusic[]> => {
  const granted = await requestAudioPermission()
  if (!granted) throw new Error('NO_PERMISSION')
  return await MusicScanner.scan() as ScannerMusic[]
}
