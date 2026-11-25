/**
 * 锤子音乐（MusicPlayer-Smartisan）风格的静态图片资源
 *
 * 图片全部复制自 MusicPlayer-Smartisan/app/src/main/res/drawable-xxhdpi 与 drawable-xhdpi，
 * 并在 src/resources/smartisan/ 下改用统一英文名，便于在 RN 里 require。
 */

export const SmartisanImages = {
  tabPlaylist: require('@/resources/smartisan/tab_playlist.png'),
  tabPlaylistOn: require('@/resources/smartisan/tab_playlist_on.png'),
  tabArtist: require('@/resources/smartisan/tab_artist.png'),
  tabArtistOn: require('@/resources/smartisan/tab_artist_on.png'),
  tabSong: require('@/resources/smartisan/tab_song.png'),
  tabSongOn: require('@/resources/smartisan/tab_song_on.png'),
  tabAlbum: require('@/resources/smartisan/tab_album.png'),
  tabAlbumOn: require('@/resources/smartisan/tab_album_on.png'),
  tabAbout: require('@/resources/smartisan/tab_about.png'),
  tabAboutOn: require('@/resources/smartisan/tab_about_on.png'),

  search: require('@/resources/smartisan/search.png'),
  // 与 tabbar_* 系列同套灰度的放大镜（未选中 211 灰 / 选中 #E64040），供底部 Tab 使用
  tabSearch: require('@/resources/smartisan/tab_search.png'),
  tabSearchOn: require('@/resources/smartisan/tab_search_on.png'),
  more: require('@/resources/smartisan/more.png'),
  arrowMore: require('@/resources/smartisan/arrow_more.png'),
  noCover: require('@/resources/smartisan/no_cover.png'),
  shuffle: require('@/resources/smartisan/shuffle.png'),

  scoreFull: require('@/resources/smartisan/score_full.png'),
  scoreEmpty: require('@/resources/smartisan/score_empty.png'),

  playingPlay: require('@/resources/smartisan/playing_play.png'),
  playingPause: require('@/resources/smartisan/playing_pause.png'),
  playingPrev: require('@/resources/smartisan/playing_prev.png'),
  playingNext: require('@/resources/smartisan/playing_next.png'),
  heartOn: require('@/resources/smartisan/heart_on.png'),
  heartOff: require('@/resources/smartisan/heart_off.png'),

  lp: require('@/resources/smartisan/lp.png'),
  lpVeins: require('@/resources/smartisan/lp_veins.png'),
  lpCover: require('@/resources/smartisan/lp_cover.png'),
  stylus: require('@/resources/smartisan/stylus.png'),
  stylusBg: require('@/resources/smartisan/stylus_bg.png'),
  stylusTop: require('@/resources/smartisan/stylus_top.png'),
  needleShadow: require('@/resources/smartisan/needle_shadow.png'),

  favOn: require('@/resources/smartisan/fav_on.png'),
  favOff: require('@/resources/smartisan/fav_off.png'),

  // 播放页（play_activity.xml）用到的图标与位图
  playingBack: require('@/resources/smartisan/playing_back.png'),
  // 干净的左向 chevron（66x66，字形 12x17dp）。playing_back.png 是播放页「下滑收起」用的
  // 倒三角 ▼，且自带一圈 alpha≈40 的圆角边框，落到白色标题栏上会显脏，所以返回键单独用这张。
  playingBackArrow: require('@/resources/smartisan/playing_back_arrow.png'),
  playingList: require('@/resources/smartisan/playing_list.png'),
  playingCycleOff: require('@/resources/smartisan/playing_cycle_off.png'),
  playingCycleOn: require('@/resources/smartisan/playing_cycle_on.png'),
  playingRepeatOn: require('@/resources/smartisan/playing_repeat_on.png'),
  playingShuffleOff: require('@/resources/smartisan/playing_shuffle_off.png'),
  playingShuffleOn: require('@/resources/smartisan/playing_shuffle_on.png'),
  playingHeartOff: require('@/resources/smartisan/playing_heart_off.png'),
  playingHeartOn: require('@/resources/smartisan/playing_heart_on.png'),
  playingThumb: require('@/resources/smartisan/playing_thumb.png'),
  playingLyricMask: require('@/resources/smartisan/playing_lyric_mask.png'),
  noCover220: require('@/resources/smartisan/no_cover_220.png'),

  // 专辑页视图栏（album_fragment_category.xml）：随机播放、列表/平铺图标、播放全部
  albumShuffle: require('@/resources/smartisan/album_shuffle.png'),
  albumPlayAll: require('@/resources/smartisan/album_play_all.png'),
  albumViewListOn: require('@/resources/smartisan/album_view_list_on.png'),
  albumViewListOff: require('@/resources/smartisan/album_view_list_off.png'),
  albumViewTileOn: require('@/resources/smartisan/album_view_tile_on.png'),
  albumViewTileOff: require('@/resources/smartisan/album_view_tile_off.png'),

  // 应用品牌标（仿制锤子 smartisan 圆盘标：白色圆盘 + 黑色锤形字形）
  appLogo: require('@/resources/smartisan/app_logo.png'),

  // 勾选框（锤子 item_selected / item_selected_normal）
  checkboxOn: require('@/resources/smartisan/checkbox_on.png'),
  checkboxOff: require('@/resources/smartisan/checkbox_off.png'),
} as const
