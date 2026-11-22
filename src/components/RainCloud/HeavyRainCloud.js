import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import RainDrop from '../vectors/RainDrop';
import Cloud from '../vectors/Cloud';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function AnimatedStreak({ delay = 0, duration = 600, size = 32, color = '#0288d1', style }) {
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
    outputRange: [0, 105],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.1, 0.75, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View style={[{ transform: [{ translateY }], opacity }, style]}>
      <RainDrop size={size} color={color} />
    </Animated.View>
  );
}

export default function HeavyRainCloud() {
  const flyInAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(flyInAnim, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [flyInAnim, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: flyInAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <Cloud width={280} height={170} color="#64748b" />
      <View style={styles.drpsRow1}>
        <AnimatedStreak delay={0} duration={520} size={30} color="#0288d1" />
        <AnimatedStreak delay={160} duration={480} size={34} color="#0369a1" />
        <AnimatedStreak delay={80} duration={540} size={32} color="#38bdf8" />
        <AnimatedStreak delay={240} duration={500} size={36} color="#0288d1" />
        <AnimatedStreak delay={120} duration={520} size={30} color="#0369a1" />
      </View>
      <View style={styles.drpsRow2}>
        <AnimatedStreak delay={280} duration={500} size={26} color="#38bdf8" />
        <AnimatedStreak delay={100} duration={560} size={32} color="#0288d1" />
        <AnimatedStreak delay={320} duration={490} size={28} color="#0369a1" />
        <AnimatedStreak delay={190} duration={530} size={30} color="#38bdf8" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    top: -20,
  },
  drpsRow1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 220,
    marginTop: -35,
    height: 110,
    zIndex: 2,
  },
  drpsRow2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 180,
    marginTop: -110,
    height: 110,
    zIndex: 1,
  },
});
