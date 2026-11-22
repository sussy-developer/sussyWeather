import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import RainDrop from './RainDrop';

function AnimatedLightningDrop({ delay = 0, duration = 520, size = 30, color = '#38bdf8' }) {
  const fallAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(fallAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fallAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [delay, duration, fallAnim]);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 95],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.1, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <RainDrop size={size} color={color} />
    </Animated.View>
  );
}

export default function ThunderstormCloud({
  width = 280,
  height = 180,
  style,
  ...props
}) {
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const strike = Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0.15,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    strike.start();
    return () => strike.stop();
  }, [flashAnim]);

  const boltScale = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.05],
  });

  return (
    <View style={[{ width, height }, styles.container, style]} {...props}>
      <Svg width={width} height={height * 0.75} viewBox="0 0 100 60">
        <Defs>
          <LinearGradient id="stormCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#475569" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M25 48 L78 48 A12 12 0 0 0 90 36 A13 13 0 0 0 78 23 A22 22 0 0 0 38 18 A16 16 0 0 0 12 34 A14 14 0 0 0 25 48 Z"
          fill="url(#stormCloudGrad)"
        />
      </Svg>

      <Animated.View
        style={[
          styles.boltWrapper,
          {
            opacity: flashAnim,
            transform: [{ scale: boltScale }],
          },
        ]}
      >
        <Svg width={54} height={70} viewBox="0 0 32 44">
          <Path
            d="M 19 2 L 6 22 L 16 22 L 12 42 L 27 18 L 17 18 Z"
            fill="#facc15"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      <View style={styles.rainRow}>
        <AnimatedLightningDrop delay={0} duration={500} size={28} color="#0288d1" />
        <AnimatedLightningDrop delay={180} duration={480} size={32} color="#38bdf8" />
        <AnimatedLightningDrop delay={90} duration={520} size={26} color="#0369a1" />
        <AnimatedLightningDrop delay={250} duration={500} size={30} color="#0288d1" />
        <AnimatedLightningDrop delay={140} duration={470} size={28} color="#38bdf8" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -15,
  },
  boltWrapper: {
    position: 'absolute',
    top: 50,
    zIndex: 3,
  },
  rainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 200,
    marginTop: -25,
    height: 95,
    zIndex: 1,
  },
});
