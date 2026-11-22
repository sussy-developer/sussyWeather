import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function getWeatherBgColor(code, isDay) {
  if (isDay === 0) {
    if ([95, 96, 97, 99].includes(code)) {
      return '#0f172a';
    }
    if ([80, 81, 82].includes(code)) {
      return '#151e2e';
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return '#1e293b';
    }
    if ([61, 63, 65, 66, 67].includes(code)) {
      return '#1e293b';
    }
    if ([55, 56, 57].includes(code)) {
      return '#1e293b';
    }
    if ([51, 53].includes(code)) {
      return '#262d3d';
    }
    if ([3, 45].includes(code)) {
      return '#334155';
    }
    if ([48].includes(code)) {
      return '#1e293b';
    }
    if ([2].includes(code)) {
      return '#262d3d';
    }
    return '#111827';
  }

  if ([95, 96, 97, 99].includes(code)) {
    return '#374151';
  }
  if ([80, 81, 82].includes(code)) {
    return '#94a3b8';
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    if (code === 75 || code === 86) {
      return '#94a3b8';
    }
    if (code === 73 || code === 85 || code === 77) {
      return '#cbd5e1';
    }
    return '#e2e8f0';
  }
  if ([61, 63, 65, 66, 67].includes(code)) {
    return '#cbd5e1';
  }
  if ([55, 56, 57].includes(code)) {
    return '#e2e8f0';
  }
  if ([51, 53].includes(code)) {
    return '#fff0c5';
  }
  if ([3, 45].includes(code)) {
    return '#d1d5db';
  }
  if ([48].includes(code)) {
    return '#e2e8f0';
  }
  if ([2].includes(code)) {
    return '#fff0c5';
  }

  return '#fff0c5';
}

export function useWeatherTheme(weatherData) {
  const weatherCode = weatherData?.current?.weather_code;
  const isDay = weatherData?.current?.is_day;
  const bgColor = getWeatherBgColor(weatherCode, isDay);
  const isDeepDark = [95, 96, 97, 99, 80, 81, 82].includes(weatherCode);
  const isDark = isDay === 0 || isDeepDark;
  const textColor = isDark ? '#ffffffa4' : '#2e2e2eca';

  const needsun = [0, 1].includes(weatherCode);
  const needSunCloud = [2, 51, 53].includes(weatherCode);
  const needFog = [3, 45].includes(weatherCode);
  const needSnowflake = [48].includes(weatherCode);
  const needSnow = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const needCloudOnly = [55, 56, 57].includes(weatherCode);
  const needRain = [61, 63, 65, 66, 67].includes(weatherCode);
  const needHeavyRain = [80, 81, 82].includes(weatherCode);
  const needThunderstorm = [95, 96, 97, 99].includes(weatherCode);

  const showStars = isDay === 0 && [0, 1, 2].includes(weatherCode);

  useEffect(() => {
    if (Platform.OS === 'android' && bgColor) {
      NavigationBar.setBackgroundColorAsync(bgColor);
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [bgColor, isDark]);

  return {
    weatherCode,
    isDay,
    bgColor,
    isDark,
    textColor,
    needsun,
    needSunCloud,
    needFog,
    needSnowflake,
    needSnow,
    needCloudOnly,
    needRain,
    needHeavyRain,
    needThunderstorm,
    showStars,
  };
}
