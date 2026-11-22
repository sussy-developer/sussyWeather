import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';

export default function FogCloud({
  width = 280,
  height = 180,
  cloudColor,
  style,
  ...props
}) {
  const driftAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(driftAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    drift.start();
    pulse.start();

    return () => {
      drift.stop();
      pulse.stop();
    };
  }, [driftAnim, pulseAnim]);

  const translateX = driftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 0.95],
  });

  return (
    <View style={[{ width, height }, styles.container, style]} {...props}>
      <Svg width={width} height={height} viewBox="0 0 110 85">
        <Defs>
          <LinearGradient id="fogCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={cloudColor || '#e2e8f0'} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={cloudColor ? cloudColor : '#94a3b8'} stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        <Path
          d="M25 56 L78 56 A12 12 0 0 0 90 44 A13 13 0 0 0 78 31 A22 22 0 0 0 38 26 A16 16 0 0 0 12 42 A14 14 0 0 0 25 56 Z"
          fill="url(#fogCloudGrad)"
        />
      </Svg>

      <Animated.View
        style={[
          styles.fogOverlay,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      >
        <Svg width={width} height={height} viewBox="0 0 110 85">
          <Line
            x1="18"
            y1="62"
            x2="92"
            y2="62"
            stroke="#94a3b8"
            strokeWidth="3.2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          <Line
            x1="10"
            y1="70"
            x2="100"
            y2="70"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />
          <Line
            x1="22"
            y1="78"
            x2="88"
            y2="78"
            stroke="#94a3b8"
            strokeWidth="2.8"
            strokeDasharray="3 5"
            strokeLinecap="round"
          />

          <Circle cx="12" cy="58" r="1.5" fill="#cbd5e1" />
          <Circle cx="98" cy="58" r="1.5" fill="#94a3b8" />
          <Circle cx="6" cy="66" r="1.8" fill="#94a3b8" />
          <Circle cx="104" cy="66" r="1.8" fill="#cbd5e1" />
          <Circle cx="15" cy="74" r="1.5" fill="#cbd5e1" />
          <Circle cx="95" cy="74" r="1.5" fill="#94a3b8" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
