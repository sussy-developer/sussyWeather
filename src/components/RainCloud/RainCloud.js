import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import RainDrop from '../vectors/RainDrop';
import Cloud from '../vectors/Cloud';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function AnimatedDrop({ delay = 0, duration = 1000, size = 30, color = '#65c1f3', style }) {
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

    // Translate downwards from under the cloud
    const translateY = fallAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });

    // Fades in gently as it emerges, stays solid, then fades out at the bottom
    const opacity = fallAnim.interpolate({
        inputRange: [0, 0.15, 0.8, 1],
        outputRange: [0, 1, 1, 0],
    });

    return (
        <Animated.View style={[{ transform: [{ translateY }], opacity }, style]}>
            <RainDrop size={size} color={color} />
        </Animated.View>
    );
}

export default function RainCloud() {
    // Starts completely off-screen to the right
    const flyInAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(flyInAnim, {
                toValue: 0,
                duration: 1200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
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
            <Cloud width={280} height={170} />
            <View style={styles.drps}>
                <AnimatedDrop delay={0} duration={950} size={28} color="#65c1f3" />
                <AnimatedDrop delay={350} duration={1150} size={34} color="#0288d1" />
                <AnimatedDrop delay={150} duration={900} size={26} color="#30a1dd" />
                <AnimatedDrop delay={500} duration={1050} size={32} color="#65c1f3" />
                <AnimatedDrop delay={250} duration={980} size={28} color="#0288d1" />
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
    drps: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        width: 200,
        marginTop: -35,
        height: 90,
        zIndex: 1,
    },
});
