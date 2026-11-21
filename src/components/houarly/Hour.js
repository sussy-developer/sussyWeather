import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';


function HourlyWeatherIcon({ code, isDay }) {

  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
  const isStorm = [95, 96, 99].includes(code);
  const isCloud = [1, 2, 3].includes(code);
  const isFog = [45, 48].includes(code);

  if (isStorm) {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M7 15a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.4 0A4 4 0 0 1 17 15H7z" fill="#94a3b8" />
        <Path d="M12 13l-2 4h3l-1 4 4-5h-3l2-3z" fill="#facc15" />
      </Svg>
    );
  }

  if (isRain) {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M7 13a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.4 0A4 4 0 0 1 17 13H7z" fill="#94a3b8" />
        <Path d="M8 16l-1 3M12 16l-1 3M16 16l-1 3" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (isCloud) {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        {isDay === 1 ? (
          <Circle cx="8" cy="8" r="4" fill="#facc15" />
        ) : (
          <Path d="M8 4a5 5 0 0 1 3 6 4 4 0 0 1-4-3 5 5 0 0 1 1-3z" fill="#fef08a" />
        )}
        <Path d="M8 16a4 4 0 0 1-.7-7.9 5.5 5.5 0 0 1 10.4 0A3.5 3.5 0 0 1 17 16H8z" fill="#cbd5e1" />
      </Svg>
    );
  }

  if (isFog) {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M5 9h14M3 13h18M6 17h12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }


  if (isDay === 1) {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="5" fill="#facc15" />
        <Path
          d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="#facc15"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#fef08a"
      />
    </Svg>
  );
}

export default function Hour({ weatherData, textColor, isDark }) {
  const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
  const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');
  const subColor = isDarkBg ? '#cbd5e1' : '#64748b';

  const hourly = weatherData?.hourly;
  if (!hourly || !hourly.time) return null;

  const hourlyList = hourly.time.map((timeStr, index) => {
    const isNow = index === 0;
    const date = new Date(timeStr);
    const hourLabel = isNow
      ? 'Now'
      : date.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    return {
      id: timeStr,
      time: hourLabel,
      temp: Math.round(hourly.temperature_2m[index]),
      code: hourly.weather_code ? hourly.weather_code[index] : 0,
      isDay: hourly.is_day ? hourly.is_day[index] : (weatherData?.current?.is_day ?? 1),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: activeColor }]}>Hourly Forecast</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={hourlyList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              isDarkBg ? styles.cardDark : styles.cardLight,
              index === 0 && (isDarkBg ? styles.nowCardDark : styles.nowCardLight),
            ]}
          >
            <Text style={[styles.timeText, { color: subColor }]}>{item.time}</Text>
            <View style={styles.iconWrapper}>
              <HourlyWeatherIcon code={item.code} isDay={item.isDay} />
            </View>
            <Text style={[styles.tempText, { color: activeColor }]}>{item.temp}°</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 10,
    position : 'relative',
    top : -40
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingRight: 16,
    gap: 10,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 100,
    minWidth: 80,
    borderWidth: 2,
  },
  cardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  cardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  nowCardDark: {
    borderColor: 'rgba(250, 204, 21, 0.7)',
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
  },
  nowCardLight: {
    borderColor: 'rgba(187, 182, 178, 0.8)',
    backgroundColor: 'rgba(249, 224, 198, 0.35)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  iconWrapper: {
    marginVertical: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
});
