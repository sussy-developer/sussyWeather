import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Line, Circle, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import Cloud from './Cloud';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function MiniSnowflake({ size = 18, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="3.3" y1="7" x2="20.7" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="3.3" y1="17" x2="20.7" y2="7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="12" y1="5" x2="9.5" y2="3.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Line x1="12" y1="5" x2="14.5" y2="3.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Line x1="12" y1="19" x2="9.5" y2="20.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Line x1="12" y1="19" x2="14.5" y2="20.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.2" fill={color} />
    </Svg>
  );
}

function SnowGrain({ size = 12 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Defs>
        <LinearGradient id="grainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <Stop offset="100%" stopColor="#bae6fd" stopOpacity="0.85" />
        </LinearGradient>
      </Defs>
      <Polygon
        points="8,1.5 13.5,4.7 13.5,11.3 8,14.5 2.5,11.3 2.5,4.7"
        fill="url(#grainGrad)"
      />
      <Circle cx="6.5" cy="6" r="2.2" fill="#ffffff" />
    </Svg>
  );
}

function AnimatedParticle({
  delay = 0,
  duration = 2000,
  swayDuration = 1600,
  swayDistance = 8,
  type = 'flake',
  size = 18,
  color = '#ffffff',
  fallDistance = 85,
  style,
}) {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = Animated.loop(
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

    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: swayDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: swayDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: swayDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    fall.start();
    sway.start();

    return () => {
      fall.stop();
      sway.stop();
    };
  }, [delay, duration, swayDuration, fallAnim, swayAnim]);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, fallDistance],
  });

  const translateX = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-swayDistance, swayDistance],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.15, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  const rotate = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { translateX }, { rotate }],
          opacity,
        },
        style,
      ]}
    >
      {type === 'grain' ? (
        <SnowGrain size={size} />
      ) : (
        <MiniSnowflake size={size} color={color} />
      )}
    </Animated.View>
  );
}

export default function SnowCloud({ weatherCode = 71 }) {
  const flyInAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(flyInAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [flyInAnim, fadeAnim]);

  const getCloudColor = () => {
    if (weatherCode === 75 || weatherCode === 86) return '#475569';
    if (weatherCode === 73 || weatherCode === 85 || weatherCode === 77) return '#64748b';
    return '#94a3b8';
  };

  const renderParticles = () => {
    if (weatherCode === 77) {
      return (
        <>
          <View style={styles.particlesRow1}>
            <AnimatedParticle delay={0} duration={800} swayDuration={600} swayDistance={3} type="grain" size={12} />
            <AnimatedParticle delay={220} duration={920} swayDuration={650} swayDistance={4} type="grain" size={9} />
            <AnimatedParticle delay={80} duration={760} swayDuration={580} swayDistance={3} type="grain" size={13} />
            <AnimatedParticle delay={320} duration={880} swayDuration={620} swayDistance={4} type="grain" size={10} />
            <AnimatedParticle delay={160} duration={820} swayDuration={600} swayDistance={3} type="grain" size={11} />
            <AnimatedParticle delay={400} duration={900} swayDuration={640} swayDistance={4} type="grain" size={9} />
            <AnimatedParticle delay={50} duration={780} swayDuration={590} swayDistance={3} type="grain" size={12} />
          </View>
          <View style={styles.particlesRow2}>
            <AnimatedParticle delay={180} duration={850} swayDuration={610} swayDistance={4} type="grain" size={10} />
            <AnimatedParticle delay={360} duration={910} swayDuration={630} swayDistance={3} type="grain" size={8} />
            <AnimatedParticle delay={90} duration={790} swayDuration={590} swayDistance={4} type="grain" size={12} />
            <AnimatedParticle delay={270} duration={870} swayDuration={620} swayDistance={3} type="grain" size={11} />
            <AnimatedParticle delay={420} duration={930} swayDuration={650} swayDistance={4} type="grain" size={9} />
            <AnimatedParticle delay={120} duration={810} swayDuration={600} swayDistance={3} type="grain" size={13} />
          </View>
        </>
      );
    }

    if (weatherCode === 75 || weatherCode === 86) {
      return (
        <>
          <View style={styles.particlesRow1}>
            <AnimatedParticle delay={0} duration={950} swayDuration={900} swayDistance={12} size={18} color="#ffffff" />
            <AnimatedParticle delay={250} duration={1050} swayDuration={950} swayDistance={10} size={14} color="#e0f2fe" />
            <AnimatedParticle delay={100} duration={900} swayDuration={850} swayDistance={13} size={22} color="#ffffff" />
            <AnimatedParticle delay={400} duration={1100} swayDuration={1000} swayDistance={11} size={16} color="#bae6fd" />
            <AnimatedParticle delay={180} duration={980} swayDuration={900} swayDistance={12} size={20} color="#ffffff" />
            <AnimatedParticle delay={350} duration={1020} swayDuration={920} swayDistance={10} size={15} color="#e0f2fe" />
            <AnimatedParticle delay={70} duration={920} swayDuration={880} swayDistance={13} size={19} color="#ffffff" />
          </View>
          <View style={styles.particlesRow2}>
            <AnimatedParticle delay={300} duration={1000} swayDuration={900} swayDistance={11} size={13} color="#ffffff" />
            <AnimatedParticle delay={80} duration={920} swayDuration={850} swayDistance={12} size={17} color="#e0f2fe" />
            <AnimatedParticle delay={450} duration={1080} swayDuration={980} swayDistance={10} size={15} color="#bae6fd" />
            <AnimatedParticle delay={150} duration={950} swayDuration={890} swayDistance={13} size={21} color="#ffffff" />
            <AnimatedParticle delay={500} duration={1120} swayDuration={1020} swayDistance={11} size={14} color="#e0f2fe" />
            <AnimatedParticle delay={220} duration={970} swayDuration={870} swayDistance={12} size={18} color="#ffffff" />
            <AnimatedParticle delay={380} duration={1040} swayDuration={940} swayDistance={10} size={16} color="#bae6fd" />
          </View>
        </>
      );
    }

    if (weatherCode === 73 || weatherCode === 85) {
      return (
        <>
          <View style={styles.particlesRow1}>
            <AnimatedParticle delay={0} duration={1600} swayDuration={1500} swayDistance={8} size={18} color="#ffffff" />
            <AnimatedParticle delay={400} duration={1750} swayDuration={1600} swayDistance={7} size={14} color="#e0f2fe" />
            <AnimatedParticle delay={800} duration={1500} swayDuration={1400} swayDistance={9} size={20} color="#ffffff" />
            <AnimatedParticle delay={200} duration={1800} swayDuration={1700} swayDistance={8} size={16} color="#bae6fd" />
            <AnimatedParticle delay={600} duration={1650} swayDuration={1550} swayDistance={7} size={19} color="#ffffff" />
          </View>
          <View style={styles.particlesRow2}>
            <AnimatedParticle delay={300} duration={1700} swayDuration={1500} swayDistance={9} size={15} color="#ffffff" />
            <AnimatedParticle delay={750} duration={1550} swayDuration={1450} swayDistance={7} size={18} color="#e0f2fe" />
            <AnimatedParticle delay={150} duration={1650} swayDuration={1600} swayDistance={8} size={14} color="#bae6fd" />
            <AnimatedParticle delay={500} duration={1750} swayDuration={1500} swayDistance={9} size={17} color="#ffffff" />
          </View>
        </>
      );
    }

    return (
      <View style={styles.particlesRow}>
        <AnimatedParticle delay={0} duration={2400} swayDuration={2100} swayDistance={10} size={18} color="#ffffff" />
        <AnimatedParticle delay={600} duration={2700} swayDuration={2300} swayDistance={12} size={15} color="#e0f2fe" />
        <AnimatedParticle delay={250} duration={2300} swayDuration={1900} swayDistance={9} size={20} color="#ffffff" />
        <AnimatedParticle delay={900} duration={2600} swayDuration={2200} swayDistance={11} size={16} color="#bae6fd" />
        <AnimatedParticle delay={450} duration={2500} swayDuration={2000} swayDistance={10} size={19} color="#ffffff" />
      </View>
    );
  };

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
      <Cloud width={280} height={170} color={getCloudColor()} />
      {renderParticles()}
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
  particlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 220,
    marginTop: -35,
    height: 105,
    zIndex: 2,
  },
  particlesRow1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 220,
    marginTop: -35,
    height: 105,
    zIndex: 2,
  },
  particlesRow2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 190,
    marginTop: -105,
    height: 105,
    zIndex: 1,
  },
});
