import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Sun({
  size = 180,
  sunColor,
  rayColor,
  style,
  ...props
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 16000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
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

  return (
    <View style={[{ width: size, height: size }, styles.container, style]} {...props}>
      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            width: size,
            height: size,
            transform: [{ rotate }, { scale: pulseAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="standaloneSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={sunColor || '#f59e0b'} stopOpacity="1" />
              <Stop offset="100%" stopColor={sunColor ? sunColor : '#fbbf24'} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Line x1="50" y1="14" x2="50" y2="4" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="18.82" x2="73" y2="10.16" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="81.18" y1="32" x2="89.84" y2="27" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="86" y1="50" x2="96" y2="50" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="81.18" y1="68" x2="89.84" y2="73" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="81.18" x2="73" y2="89.84" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="50" y1="86" x2="50" y2="96" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="32" y1="81.18" x2="27" y2="89.84" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="18.82" y1="68" x2="10.16" y2="73" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="14" y1="50" x2="4" y2="50" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="18.82" y1="32" x2="10.16" y2="27" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />
          <Line x1="32" y1="18.82" x2="27" y2="10.16" stroke={rayColor || '#fbbf24'} strokeWidth="4" strokeLinecap="round" />

          <Circle cx="50" cy="50" r="26" fill="url(#standaloneSunGrad)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
