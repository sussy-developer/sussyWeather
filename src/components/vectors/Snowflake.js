import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Snowflake({
  size = 180,
  color = '#60a5fa',
  style,
  ...props
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
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
          toValue: 1.0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotate.start();
    pulse.start();

    return () => {
      rotate.stop();
      pulse.stop();
    };
  }, [rotateAnim, pulseAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderArm = (angle) => (
    <View
      key={angle}
      style={[
        styles.armWrapper,
        {
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Line x1="50" y1="50" x2="50" y2="10" stroke="url(#snowGrad)" strokeWidth="3.2" strokeLinecap="round" />
        <Line x1="50" y1="24" x2="42" y2="16" stroke="url(#snowGrad)" strokeWidth="2.6" strokeLinecap="round" />
        <Line x1="50" y1="24" x2="58" y2="16" stroke="url(#snowGrad)" strokeWidth="2.6" strokeLinecap="round" />
        <Line x1="50" y1="34" x2="38" y2="24" stroke="url(#snowGrad)" strokeWidth="2.6" strokeLinecap="round" />
        <Line x1="50" y1="34" x2="62" y2="24" stroke="url(#snowGrad)" strokeWidth="2.6" strokeLinecap="round" />
        <Circle cx="50" cy="9" r="2.2" fill="#93c5fd" />
      </Svg>
    </View>
  );

  return (
    <View style={[{ width: size, height: size }, styles.container, style]} {...props}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            width: size,
            height: size,
            transform: [{ rotate }, { scale: pulseAnim }],
          },
        ]}
      >
        <Svg width={0} height={0}>
          <Defs>
            <LinearGradient id="snowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#93c5fd" stopOpacity="1" />
              <Stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </LinearGradient>
          </Defs>
        </Svg>

        {[0, 60, 120, 180, 240, 300].map(renderArm)}

        <View style={styles.centerOrb}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="5.5" fill="#38bdf8" />
            <Circle cx="50" cy="50" r="3" fill="#ffffff" />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  armWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  centerOrb: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
