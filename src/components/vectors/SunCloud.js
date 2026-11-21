import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function SunCloud({
  width = 240,
  height = 170,
  cloudColor,
  sunColor,
  style,
  ...props
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous 360-degree rotation of the sun and its rays
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Subtle breathing pulse for radiant sunlight
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    pulse.start();

    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [spinAnim, pulseAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate sun position to center directly at (68, 34) in 110x85 space
  const sunSize = width * (64 / 110);
  const sunLeft = width * (68 / 110) - sunSize / 2;
  const sunTop = height * (34 / 85) - sunSize / 2;

  return (
    <View style={[{ width, height }, styles.container, style]} {...props}>
      {/* Animated Rotating & Pulsing Sun (Layered Behind Cloud) */}
      <Animated.View
        style={[
          styles.sunWrapper,
          {
            width: sunSize,
            height: sunSize,
            left: sunLeft,
            top: sunTop,
            transform: [{ rotate }, { scale: pulseAnim }],
          },
        ]}
      >
        <Svg width={sunSize} height={sunSize} viewBox="0 0 64 64">
          <Defs>
            <LinearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={sunColor || '#f59e0b'} stopOpacity="1" />
              <Stop offset="100%" stopColor={sunColor ? sunColor : '#fbbf24'} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* All 8 Radiating Sun Rays (Rotating in 360°) */}
          <Line x1="32" y1="8" x2="32" y2="2" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="49" y1="15" x2="53" y2="11" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="56" y1="32" x2="62" y2="32" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="49" y1="49" x2="53" y2="53" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="32" y1="56" x2="32" y2="62" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="15" y1="49" x2="11" y2="53" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="8" y1="32" x2="2" y2="32" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="15" y1="15" x2="11" y2="11" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />

          {/* Sun Orb */}
          <Circle cx="32" cy="32" r="19" fill="url(#sunGrad)" />
        </Svg>
      </Animated.View>

      {/* Cloud (Layered in Foreground, partially covering the Sun) */}
      <View style={styles.cloudWrapper}>
        <Svg width={width} height={height} viewBox="0 0 110 85">
          <Defs>
            <LinearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={cloudColor || '#efefef'} stopOpacity="1" />
              <Stop offset="100%" stopColor={cloudColor ? cloudColor : '#acbacc'} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M25 68 L78 68 A12 12 0 0 0 90 56 A13 13 0 0 0 78 43 A22 22 0 0 0 38 38 A16 16 0 0 0 12 54 A14 14 0 0 0 25 68 Z"
            fill="url(#cloudGrad)"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  sunWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cloudWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
});
