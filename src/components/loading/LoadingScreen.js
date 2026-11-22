import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Platform } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

export default function LoadingScreen({ bgColor = '#fff0c5' }) {
  const sunRotateAnim = useRef(new Animated.Value(0)).current;
  const sunPulseAnim = useRef(new Animated.Value(1)).current;
  const cloudBobAnim = useRef(new Animated.Value(0)).current;
  const breezeAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sunSpin = Animated.loop(
      Animated.timing(sunRotateAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const sunPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulseAnim, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sunPulseAnim, {
          toValue: 1.0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const cloudBob = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudBobAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cloudBobAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const breeze = Animated.loop(
      Animated.sequence([
        Animated.timing(breezeAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breezeAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const sparkle = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const createDotLoop = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(800 - delay),
        ])
      );

    const dot1 = createDotLoop(dot1Anim, 0);
    const dot2 = createDotLoop(dot2Anim, 200);
    const dot3 = createDotLoop(dot3Anim, 400);

    sunSpin.start();
    sunPulse.start();
    cloudBob.start();
    breeze.start();
    sparkle.start();
    dot1.start();
    dot2.start();
    dot3.start();

    return () => {
      sunSpin.stop();
      sunPulse.stop();
      cloudBob.stop();
      breeze.stop();
      sparkle.stop();
      dot1.stop();
      dot2.stop();
      dot3.stop();
    };
  }, []);

  const sunRotate = sunRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cloudTranslateY = cloudBobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  const cloudTranslateX = cloudBobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  const breezeTranslateX = breezeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 12],
  });

  const breezeOpacity = breezeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.85, 0.35],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.95],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.1],
  });

  const makeDotStyle = (anim) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.25] }) }],
  });

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style="dark" backgroundColor={bgColor} translucent={true} />

      <View style={styles.artboard}>
        <Animated.View
          style={[
            styles.sunLayer,
            {
              transform: [{ rotate: sunRotate }, { scale: sunPulseAnim }],
            },
          ]}
        >
          <Svg width={140} height={140} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id="loadingSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <Stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Line x1="50" y1="14" x2="50" y2="4" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="68" y1="18.82" x2="73" y2="10.16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="81.18" y1="32" x2="89.84" y2="27" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="86" y1="50" x2="96" y2="50" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="81.18" y1="68" x2="89.84" y2="73" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="68" y1="81.18" x2="73" y2="89.84" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="50" y1="86" x2="50" y2="96" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="32" y1="81.18" x2="27" y2="89.84" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="18.82" y1="68" x2="10.16" y2="73" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="14" y1="50" x2="4" y2="50" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="18.82" y1="32" x2="10.16" y2="27" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <Line x1="32" y1="18.82" x2="27" y2="10.16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />

            <Circle cx="50" cy="50" r="25" fill="url(#loadingSunGrad)" />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.sparkleLayer1,
            {
              opacity: sparkleOpacity,
              transform: [{ scale: sparkleScale }],
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
              fill="#fbbf24"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.breezeLayer,
            {
              opacity: breezeOpacity,
              transform: [{ translateX: breezeTranslateX }],
            },
          ]}
        >
          <Svg width={180} height={50} viewBox="0 0 180 50">
            <Path
              d="M 20 20 Q 55 12 85 22 T 150 20"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <Path
              d="M 45 34 Q 75 26 105 34 T 165 32"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.cloudLayer,
            {
              transform: [
                { translateY: cloudTranslateY },
                { translateX: cloudTranslateX },
              ],
            },
          ]}
        >
          <Svg width={190} height={120} viewBox="0 0 100 60">
            <Defs>
              <LinearGradient id="loadingCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <Stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.9" />
              </LinearGradient>
            </Defs>
            <Path
              d="M25 48 L78 48 A12 12 0 0 0 90 36 A13 13 0 0 0 78 23 A22 22 0 0 0 38 18 A16 16 0 0 0 12 34 A14 14 0 0 0 25 48 Z"
              fill="url(#loadingCloudGrad)"
            />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Updating the weather for u</Text>
        <Text style={styles.subtitle}>Gathering real-time forecast</Text>

        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, makeDotStyle(dot1Anim)]} />
          <Animated.View style={[styles.dot, makeDotStyle(dot2Anim)]} />
          <Animated.View style={[styles.dot, makeDotStyle(dot3Anim)]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  artboard: {
    width: 240,
    height: 190,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunLayer: {
    position: 'absolute',
    top: 0,
    left: 20,
    zIndex: 1,
  },
  cloudLayer: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    zIndex: 3,
  },
  breezeLayer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    zIndex: 2,
  },
  sparkleLayer1: {
    position: 'absolute',
    top: 10,
    right: 35,
    zIndex: 2,
  },
  textContainer: {
    marginTop: 35,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e2e2e',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#78716c',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#f59e0b',
  },
});
