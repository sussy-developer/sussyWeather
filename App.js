import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeatherApi } from "openmeteo";

import TempSection from './src/components/tempe/TempSection'
import Hour from './src/components/houarly/Hour';
import RainCloud from './src/components/RainCloud/RainCloud'
import Cloud from './src/components/vectors/Cloud';
import SunCloud from './src/components/vectors/SunCloud';
import MoonCloud from './src/components/vectors/MoonCloud';
import Sun from './src/components/vectors/Sun'
import Info from './src/components/info/Info';
import Moon from './src/components/vectors/Moon';
import AnimatedStars from './src/components/vectors/AnimatedStars';
import Place from './src/components/place/Place';


function getWeatherBgColor(code, isDay) {
  // Night-time background colors (isDay === 0)
  if (isDay === 0) {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return '#1e293b'; // Rainy night
    }
    if ([1, 2, 3].includes(code)) {
      return '#262d3d'; // Cloudy night
    }
    if ([45, 48].includes(code)) {
      return '#334155'; // Foggy night
    }
    if ([95, 96, 99].includes(code)) {
      return '#0f172a'; // Thunderstorm night
    }
    return '#111827'; // Clear night
  }

  // Day-time background colors (isDay === 1 or fallback before data loads)
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return '#ffffff';
  }
  if ([1, 2, 3].includes(code)) {
    return 'rgb(168, 156, 123)';
  }
  if ([45, 48].includes(code)) {
    return '#9e9e9e';
  }
  if ([95, 96, 99].includes(code)) {
    return '#374151';
  }

  return 'rgb(255, 240, 197)';
}


export default function App() {
  const [isNight, setIsNight] = useState(true);
  const [location, setLocation] = useState(null); //location
  const [weatherData, setWeatherData] = useState(null);
  const [placeData, setPlaceData] = useState(null);
  const [aqi, setAqi] = useState(null);


  useEffect(() => {
    async function requestlocation() {
      try {
        //POPUP
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('permisson denied', 'permission is need to fetch the weather data');
          return;
        }

        //capture current  GPS
        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setLocation(currentLocation.coords);
      } catch {

      }
    }
    requestlocation();
  }, []);



  useEffect(() => {
    if (!location) return;

    async function fetchWeather() {
      const URL = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&forecast_hours=12&timezone=auto`;

      try {
        const res = await fetch(URL);
        // console.log('Status:', res.status, 'OK:', res.ok);
        const data = await res.json();
        // console.log('body : ', data);
        // data.current.is_day = 0;
        // data.current.weather_code = 3;
        // console.log(data.hourly.temperature_2m)
        // console.log(data.hourly.time)

        setWeatherData(data);
      } catch (err) {
        console.error('failed to fetch ', err.message);
      }
    }
    fetchWeather();


    async function fetchplace() {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`;
      try {
        const place = await fetch(url);
        // console.log('Status:', place.status, 'OK:', place.ok);
        const placename = await place.json()
        // console.log (placename)
        // console.log(placename.city);
        setPlaceData(placename);
      } catch (e) {
        console.log('failed to fetch the place name ... ', e.message);
      }
    }

    fetchplace();




    async function fetchAqi() {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi`;
      try {
        const res = await fetch(url);
        console.log('status: ',res.status, 'ok : ', res.ok);
        const data = await res.json();
        console.log(data);
        setAqi(data);
      } catch (err) {
        console.log('Failed to fetch AQI:', err.message);
      }
    }

    fetchAqi()
  }, [location]);






  const weatherCode = weatherData?.current?.weather_code;
  const isDay = weatherData?.current?.is_day;
  const bgColor = getWeatherBgColor(weatherCode, isDay);
  const isDeepGray = [95, 96, 99].includes(weatherCode);
  const isDark = isDay === 0 || isDeepGray;
  const textColor = isDark ? '#ffffffa4' : '#2e2e2eca';

  const needsun = [0].includes(weatherCode);
  const isClearNight = isDay === 0 && needsun;

  const cloudCodes = [1, 2, 3];
  const needCloud = cloudCodes.includes(weatherCode);

  const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
  const needrain = rainCodes.includes(weatherCode);






  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {isClearNight && <AnimatedStars />}
      <TempSection weatherData={weatherData} textColor={textColor} isDark={isDark} />

      <View style={styles.ani}>

        {/* sun */}
        {needsun && (
          <View>
            {
              isDay == 1 ? (
                <Sun width={280} height={180} />
              ) : (
                <Moon width={280} height={180} />
              )
            }
          </View>

        )}


        {/* clouddy */}
        {needCloud && (
          <View style={styles.clds}>
            {isDay === 1 ? (
              <SunCloud width={280} height={180} />
            ) : (
              <MoonCloud width={280} height={180} />
            )}

          </View>
        )}


        {/* raining */}
        {needrain && (
          <RainCloud />
        )}
      </View>

      <Info weatherData={weatherData} aqi = {aqi} textColor={textColor} isDark={isDark} />

      <Hour weatherData={weatherData} textColor={textColor} isDark={isDark} />

      <Place weatherData={weatherData} placeData={placeData} textColor={textColor} isDark={isDark} />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
}







const styles = StyleSheet.create({

  ani: {
    display: 'flex',
    position: 'relative',
    top: -40
  },
  container: {
    display: 'flex',
    gap: 20,
    flex: 1,
    padding: 10,
    paddingTop: 40,
    alignItems: 'center',
  },
  clds: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
