import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HighLow({ weatherData, textColor, isDark }) {
  const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
  const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');
  const subColor = isDarkBg ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)';

  let maxTemp = '--';
  let minTemp = '--';

  if (weatherData?.daily?.temperature_2m_max?.[0] !== undefined) {
    maxTemp = Math.round(weatherData.daily.temperature_2m_max[0]);
  } else if (weatherData?.hourly?.temperature_2m?.length > 0) {
    maxTemp = Math.round(Math.max(...weatherData.hourly.temperature_2m));
  }

  if (weatherData?.daily?.temperature_2m_min?.[0] !== undefined) {
    minTemp = Math.round(weatherData.daily.temperature_2m_min[0]);
  } else if (weatherData?.hourly?.temperature_2m?.length > 0) {
    minTemp = Math.round(Math.min(...weatherData.hourly.temperature_2m));
  }

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={[styles.itemText, { color: activeColor }]}>
          H: <Text style={styles.val}>{maxTemp !== '--' ? `${maxTemp}°` : '--'}</Text>
        </Text>
        <Text style={[styles.separator, { color: subColor }]}>·</Text>
        <Text style={[styles.itemText, { color: subColor }]}>
          L: <Text style={styles.val}>{minTemp !== '--' ? `${minTemp}°` : '--'}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: -30,
    // right: 20,
    // zIndex: 10,
    // borderWidth: 2,           // Thickness
    // borderColor: 'red',      // Color
    // borderRadius: 8,          // Rounded corners
    // borderStyle: 'solid',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  separator: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  val: {
    fontWeight: 'bold',
  },
});
