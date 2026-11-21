import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const STARS = [
  // Delicate, spaced out stars across the night sky (10 stars)
  { x: 12, y: 7, size: 12, type: 'sparkle', color: '#ffffff', group: 0 },
  { x: 84, y: 9, size: 10, type: 'sparkle', color: '#fef08a', group: 1 },
  { x: 90, y: 22, size: 7, type: 'dot', color: '#e0f2fe', group: 2 },
  { x: 8, y: 36, size: 13, type: 'sparkle', color: '#ffffff', group: 3 },
  { x: 88, y: 50, size: 11, type: 'sparkle', color: '#ffffff', group: 0 },
  { x: 14, y: 62, size: 7, type: 'dot', color: '#fef08a', group: 1 },
  { x: 82, y: 68, size: 10, type: 'sparkle', color: '#e0f2fe', group: 2 },
  { x: 18, y: 82, size: 12, type: 'sparkle', color: '#ffffff', group: 3 },
  { x: 84, y: 86, size: 7, type: 'dot', color: '#fef08a', group: 0 },
  { x: 48, y: 92, size: 10, type: 'sparkle', color: '#ffffff', group: 1 },
];

export default function AnimatedStars() {
  const anim0 = useRef(new Animated.Value(0)).current;
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    const loop0 = createLoop(anim0, 2200);
    const loop1 = createLoop(anim1, 3100);
    const loop2 = createLoop(anim2, 1700);
    const loop3 = createLoop(anim3, 2600);

    loop0.start();
    loop1.start();
    loop2.start();
    loop3.start();

    return () => {
      loop0.stop();
      loop1.stop();
      loop2.stop();
      loop3.stop();
    };
  }, [anim0, anim1, anim2, anim3]);

  const groupStyles = [
    {
      opacity: anim0.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
      transform: [{ scale: anim0.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1.15] }) }],
    },
    {
      opacity: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.9] }),
      transform: [{ scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }],
    },
    {
      opacity: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
      transform: [{ scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) }],
    },
    {
      opacity: anim3.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.85] }),
      transform: [{ scale: anim3.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.25] }) }],
    },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {STARS.map((star, index) => {
        const animatedStyle = groupStyles[star.group];
        return (
          <Animated.View
            key={index}
            style={[
              styles.starWrapper,
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              },
              animatedStyle,
            ]}
          >
            {star.type === 'sparkle' ? (
              <Svg width={star.size} height={star.size} viewBox="0 0 24 24">
                <Path
                  d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
                  fill={star.color}
                />
              </Svg>
            ) : (
              <Svg width={star.size} height={star.size} viewBox="0 0 12 12">
                <Circle cx="6" cy="6" r="4" fill={star.color} opacity={0.9} />
              </Svg>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  starWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
