import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Animated, Easing, Image as RNImage } from 'react-native'
import { createStyle } from '@/utils/tools'
import { usePlayerMusicInfo, useIsPlay, useProgress } from '@/store/player/hook'
import { useWindowSize } from '@/utils/hooks'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import { useNavigationComponentDidAppear } from '@/navigation'
import { HEADER_HEIGHT } from './components/Header'
import Image from '@/components/common/Image'
import { useStatusbarHeight } from '@/store/common/hook'
import commonState from '@/store/common/state'
import { SmartisanImages } from '@/resources/smartisan'

// 锤子 DiscView 实测（DiscView.kt:126-140）：唱片 15000ms 转一圈，LinearInterpolator，无限循环
const ROTATE_DURATION = 15000

// 唱机臂几何（cust_tonearm_view.xml + CustTonearmView.kt）
// rotationContainer 高 340dp，四张图贴右上角（top 14dp / end 4dp）；
// 旋转轴心 view_pivot_anchor 为 5dp 方块，marginTop 25dp / marginEnd 23dp
// => 轴心相对容器右上角 (25.5dp, 27.5dp)
const STYLUS_RATIO = 0.91 // 唱臂高 ≈ 唱片直径 × 0.91（340dp 容器里唱臂 310dp）
const STYLUS_ASPECT = 147 / 620 // 位图原始宽高比
const PIVOT_FROM_RIGHT = 25.5
const PIVOT_FROM_TOP = 27.5
const STYLUS_TOP = 14
const STYLUS_END = 4
// play: 视觉 103°~120° => 容器 rotation 13°~30°；pause: 0°
const ARM_ROTATE_START = 13
const ARM_ROTATE_END = 30
const ARM_DURATION = 800
const ARM_RESET_DURATION = 1000

export default ({ componentId }: { componentId: string }) => {
  const musicInfo = usePlayerMusicInfo()
  const isPlay = useIsPlay()
  const { width: winWidth, height: winHeight } = useWindowSize()
  const statusBarHeight = useStatusbarHeight()
  const { progress } = useProgress()

  const [animated, setAnimated] = useState(!!commonState.componentIds.playDetail)
  const [pic, setPic] = useState(musicInfo.pic)
  useEffect(() => {
    if (animated) setPic(musicInfo.pic)
  }, [musicInfo.pic, animated])

  useNavigationComponentDidAppear(componentId, () => {
    setAnimated(true)
  })

  // 唱片是 1:1 正方形。锤子 play_activity.xml 的 rotate_rl 是 0dp×0dp + layout_constraintDimensionRatio="1:1"
  // 四边贴父布局 => 容器边长就等于屏宽（padding 6dp 不改变位图绘制区）。
  // 实测锤子真机深色盘面 881px / 屏宽 1080 = 0.816，与 lp.png 自身深色占比 0.810 吻合，
  // 所以这里直接取屏宽，只在可用高度不足时才收缩。
  // 高度扣减：48 标题栏 + 42 进度行 + 控制按钮行(18+92+30) + 音量条(32+10)。
  const discSize = useMemo(() => {
    const byWidth = winWidth
    const byHeight = winHeight - statusBarHeight - HEADER_HEIGHT - 42 - 182
    return Math.max(0, Math.min(byWidth, byHeight))
  }, [statusBarHeight, winHeight, winWidth])

  const labelSize = Math.min(discSize * 0.36, 134) // 中央专辑图 134dp

  const spin = useRef(new Animated.Value(0)).current
  const spinValueRef = useRef(0)
  const arm = useRef(new Animated.Value(isPlay ? ARM_ROTATE_START : 0)).current

  useEffect(() => {
    const id = spin.addListener(({ value }) => { spinValueRef.current = value })
    return () => { spin.removeListener(id) }
  }, [spin])

  // 播放时旋转，暂停时停在当前角度（不重置）
  useEffect(() => {
    if (!isPlay) {
      spin.stopAnimation()
      return
    }
    let cancelled = false
    const run = (from: number) => {
      if (cancelled) return
      Animated.timing(spin, {
        toValue: 1,
        duration: Math.max(1, ROTATE_DURATION * (1 - from)),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || cancelled) return
        spin.setValue(0)
        run(0)
      })
    }
    run(spinValueRef.current)
    return () => {
      cancelled = true
      spin.stopAnimation()
    }
  }, [isPlay, spin])

  // 唱针随进度落到盘面；暂停归位
  const armTarget = isPlay
    ? ARM_ROTATE_START + (ARM_ROTATE_END - ARM_ROTATE_START) * Math.max(0, Math.min(1, progress))
    : 0
  useEffect(() => {
    Animated.timing(arm, {
      toValue: armTarget,
      duration: isPlay ? ARM_DURATION : ARM_RESET_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [arm, armTarget, isPlay])

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
  const armRotate = arm.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })

  const stylusHeight = discSize * STYLUS_RATIO
  const stylusWidth = stylusHeight * STYLUS_ASPECT

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ width: discSize, height: discSize }}>
          {/* 1. 黑胶底盘 */}
          <RNImage
            source={SmartisanImages.lp}
            style={{ position: 'absolute', width: discSize, height: discSize }}
            resizeMode="contain"
          />
          {/* 2. 内圈纹路（随盘旋转） */}
          <Animated.View
            style={{
              position: 'absolute',
              width: discSize,
              height: discSize,
              transform: [{ rotate }],
            }}
          >
            <RNImage
              source={SmartisanImages.lpVeins}
              style={{ width: discSize, height: discSize, opacity: 0.5 }}
              resizeMode="contain"
            />
          </Animated.View>
          {/* 3. 封面占位（无专辑图时的红标盘芯） */}
          <Animated.View
            style={{
              position: 'absolute',
              width: discSize,
              height: discSize,
              transform: [{ rotate }],
            }}
          >
            {pic
              ? (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                      width: labelSize,
                      height: labelSize,
                      borderRadius: labelSize / 2,
                      overflow: 'hidden',
                      backgroundColor: '#1a1a1a',
                    }}>
                      <Image
                        url={pic}
                        nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_pic}
                        style={{ width: labelSize, height: labelSize, borderRadius: labelSize / 2 }}
                      />
                    </View>
                  </View>
                )
              : (
                  <RNImage
                    source={SmartisanImages.lpCover}
                    style={{ width: discSize, height: discSize }}
                    resizeMode="contain"
                  />
                )}
          </Animated.View>

          {/* 4. 唱机臂：零尺寸轴心容器 + 反向偏移实现 transformOrigin */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: PIVOT_FROM_RIGHT,
              top: PIVOT_FROM_TOP,
              width: 0,
              height: 0,
            }}
          >
            <Animated.View style={{ transform: [{ rotate: armRotate }] }}>
              <RNImage
                source={SmartisanImages.stylusBg}
                style={{
                  position: 'absolute',
                  right: PIVOT_FROM_RIGHT - STYLUS_END,
                  top: STYLUS_TOP - PIVOT_FROM_TOP,
                  width: stylusWidth,
                  height: stylusHeight,
                }}
                resizeMode="contain"
              />
              <RNImage
                source={SmartisanImages.needleShadow}
                style={{
                  position: 'absolute',
                  right: PIVOT_FROM_RIGHT - STYLUS_END,
                  top: STYLUS_TOP - PIVOT_FROM_TOP,
                  width: stylusWidth,
                  height: stylusHeight,
                  opacity: isPlay ? 0.55 : 0,
                }}
                resizeMode="contain"
              />
              <RNImage
                source={SmartisanImages.stylus}
                style={{
                  position: 'absolute',
                  right: PIVOT_FROM_RIGHT - STYLUS_END,
                  top: STYLUS_TOP - PIVOT_FROM_TOP,
                  width: stylusWidth,
                  height: stylusHeight,
                }}
                resizeMode="contain"
              />
              <RNImage
                source={SmartisanImages.stylusTop}
                style={{
                  position: 'absolute',
                  right: PIVOT_FROM_RIGHT - STYLUS_END,
                  top: STYLUS_TOP - PIVOT_FROM_TOP,
                  width: stylusWidth,
                  height: stylusHeight,
                }}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = createStyle({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
