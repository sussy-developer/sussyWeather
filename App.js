import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';

import TempSection from './src/components/tempe/TempSection';
import Hour from './src/components/houarly/Hour';
import RainCloud from './src/components/RainCloud/RainCloud';
import HeavyRainCloud from './src/components/RainCloud/HeavyRainCloud';
import SunCloud from './src/components/vectors/SunCloud';
import MoonCloud from './src/components/vectors/MoonCloud';
import Sun from './src/components/vectors/Sun';
import Moon from './src/components/vectors/Moon';
import Cloud from './src/components/vectors/Cloud';
import FogCloud from './src/components/vectors/FogCloud';
import Snowflake from './src/components/vectors/Snowflake';
import ThunderstormCloud from './src/components/vectors/ThunderstormCloud';
import AnimatedStars from './src/components/vectors/AnimatedStars';
import Info from './src/components/info/Info';
import Place from './src/components/place/Place';
import GraphDiagram from './src/components/GraphDiagram/GraphDiagram';
import HighLow from './src/components/tempe/HighLow';
import LoadingScreen from './src/components/loading/LoadingScreen';

import { useWeather } from './src/hooks/useWeather';
import { useWeatherTheme } from './src/hooks/useWeatherTheme';

export default function App() {
  const { weatherData, placeData, aqi, refreshing, onRefresh } = useWeather();
  const {
    isDay,
    bgColor,
    isDark,
    textColor,
    needsun,
    needSunCloud,
    needFog,
    needSnow,
    needCloudOnly,
    needRain,
    needHeavyRain,
    needThunderstorm,
    showStars,
  } = useWeatherTheme(weatherData);

  if (!weatherData) {
    return <LoadingScreen bgColor={bgColor} />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: bgColor }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDark ? '#ffffff' : '#000000'}
          colors={['#f59e0b']}
        />
      }
    >
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {showStars && <AnimatedStars />}

        <TempSection weatherData={weatherData} textColor={textColor} isDark={isDark} />
        <HighLow weatherData={weatherData} textColor={textColor} isDark={isDark} />

        <View style={styles.ani}>
          {needsun && (
            <View>
              {isDay === 1 ? (
                <Sun width={280} height={180} />
              ) : (
                <Moon width={280} height={180} />
              )}
            </View>
          )}

          {needSunCloud && (
            <View style={styles.clds}>
              {isDay === 1 ? (
                <SunCloud width={280} height={180} />
              ) : (
                <MoonCloud width={280} height={180} />
              )}
            </View>
          )}

          {needFog && (
            <FogCloud width={280} height={180} />
          )}

          {needSnow && (
            <Snowflake size={180} />
          )}

          {needCloudOnly && (
            <View style={styles.clds}>
              <Cloud width={280} height={170} />
            </View>
          )}

          {needRain && (
            <RainCloud />
          )}

          {needHeavyRain && (
            <HeavyRainCloud />
          )}

          {needThunderstorm && (
            <ThunderstormCloud width={280} height={180} />
          )}
        </View>

        <Info weatherData={weatherData} aqi={aqi} textColor={textColor} isDark={isDark} />
        <GraphDiagram weatherData={weatherData} textColor={textColor} isDark={isDark} />
        <Hour weatherData={weatherData} textColor={textColor} isDark={isDark} />
        <Place weatherData={weatherData} placeData={placeData} textColor={textColor} isDark={isDark} />
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={bgColor} translucent={true} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ani: {
    display: 'flex',
    position: 'relative',
    top: -40,
  },
  container: {
    display: 'flex',
    gap: 20,
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  clds: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
