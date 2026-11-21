import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Ultra-smooth Catmull-Rom cubic Bezier spline
function getSmoothCurvePath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i !== points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

export default function GraphDiagram({ weatherData, textColor, isDark }) {
  const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
  const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.95)' : 'rgba(31, 41, 55, 0.95)';
  const subColor = isDarkBg ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)';
  const pinBg = isDarkBg ? '#111827' : '#ffffff';

  const chartWidth = SCREEN_WIDTH - 24;
  const chartHeight = 135;
  const paddingLeft = 28;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 28;

  // One-time smooth entrance animation
  const sweepWidth = useRef(new Animated.Value(0)).current;
  const pointAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;

  const hourly = weatherData?.hourly;
  const hasData = Boolean(hourly?.temperature_2m && hourly.temperature_2m.length > 0);

  useEffect(() => {
    if (!hasData) return;

    // Reset values for clean entry
    sweepWidth.setValue(0);
    pointAnims.forEach((anim) => anim.setValue(0));

    // 1. Smooth, one-time left-to-right curve sweep
    Animated.timing(sweepWidth, {
      toValue: chartWidth,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // 2. Subtle spring pop for the temperature values and timestamps
    const pops = pointAnims.map((anim) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, pops).start();
  }, [hasData, chartWidth, sweepWidth, pointAnims]);

  if (!hasData) {
    return null;
  }

  // 12-hour data
  const temps = hourly.temperature_2m.slice(0, 12);
  const times = hourly.time ? hourly.time.slice(0, 12) : [];

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const availableWidth = chartWidth - paddingLeft - paddingRight;
  const availableHeight = chartHeight - paddingTop - paddingBottom;

  const points = temps.map((temp, index) => {
    const x = paddingLeft + (index / (temps.length - 1)) * availableWidth;
    const normalized = (temp - minTemp) / tempRange;
    const y = paddingTop + (1 - normalized) * availableHeight;
    return { x, y, temp, index, time: times[index] };
  });

  const nowPoint = points[0];
  const curvePath = getSmoothCurvePath(points);
  const baselineY = chartHeight - paddingBottom;

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        {/* Animated one-time reveal from left to right */}
        <Animated.View style={{ width: sweepWidth, overflow: 'hidden', height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Subtle dotted baseline along the bottom */}
            <Line
              x1={nowPoint.x}
              y1={baselineY}
              x2={points[points.length - 1].x}
              y2={baselineY}
              stroke={lineColor}
              strokeWidth={0.8}
              strokeDasharray="3 3"
              opacity={0.25}
            />

            {/* Minimal flowing wave line */}
            <Path
              d={curvePath}
              stroke={lineColor}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Vertical stem connecting NOW ⊙ pin to baseline */}
            <Line
              x1={nowPoint.x}
              y1={nowPoint.y + 6.5}
              x2={nowPoint.x}
              y2={baselineY}
              stroke={lineColor}
              strokeWidth={1.6}
            />

            {/* ⊙ Static, crisp NOW Pin (Outer ring + inner dot) */}
            <Circle
              cx={nowPoint.x}
              cy={nowPoint.y}
              r={6.5}
              fill={pinBg}
              stroke={lineColor}
              strokeWidth={2}
            />
            <Circle
              cx={nowPoint.x}
              cy={nowPoint.y}
              r={2.4}
              fill={lineColor}
            />
          </Svg>
        </Animated.View>

        {/* NOW Temperature above pin */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pointOverlay,
            {
              left: nowPoint.x - 20,
              top: nowPoint.y - 25,
              opacity: pointAnims[0],
              transform: [
                {
                  scale: pointAnims[0].interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.nowTempText, { color: activeColor }]}>
            {Math.round(nowPoint.temp)}°
          </Text>
        </Animated.View>

        {/* NOW Timestamp ("Now") at bottom */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.timeOverlay,
            {
              left: nowPoint.x - 22,
              top: baselineY + 6,
              opacity: pointAnims[0],
            },
          ]}
        >
          <Text style={[styles.timeText, { color: activeColor, fontWeight: 'bold' }]}>
            Now
          </Text>
        </Animated.View>

        {/* Future points: temperature above, small dot on curve, and timestamp at bottom */}
        {points.slice(1).map((pt, i) => {
          const pointIndex = i + 1;
          const anim = pointAnims[pointIndex] || pointAnims[pointAnims.length - 1];
          const scale = anim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 1.2, 1],
          });

          // Show timestamps spaced out every 2 hours and on the final hour so they never collide
          const shouldShowTime = pointIndex % 2 === 0 || pointIndex === points.length - 1;
          const date = pt.time ? new Date(pt.time) : null;
          const timeLabel = date
            ? date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
            : `+${pointIndex}h`;

          return (
            <React.Fragment key={`future-pt-${i}`}>
              {/* Temperature & dot on curve */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.pointOverlay,
                  {
                    left: pt.x - 16,
                    top: pt.y - 22,
                    opacity: anim,
                    transform: [{ scale }],
                  },
                ]}
              >
                <Text style={[styles.pointTempText, { color: subColor }]}>
                  {Math.round(pt.temp)}°
                </Text>
                <View style={[styles.dot, { backgroundColor: lineColor }]} />
              </Animated.View>

              {/* Timestamp at bottom side */}
              {shouldShowTime && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.timeOverlay,
                    {
                      left: pt.x - 22,
                      top: baselineY + 6,
                      opacity: anim,
                    },
                  ]}
                >
                  <Text style={[styles.timeText, { color: subColor }]}>
                    {timeLabel}
                  </Text>
                </Animated.View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
    position : 'relative',
    top : -25
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pointOverlay: {
    position: 'absolute',
    alignItems: 'center',
    width: 32,
  },
  nowTempText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeOverlay: {
    position: 'absolute',
    alignItems: 'center',
    width: 44,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  pointTempText: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
