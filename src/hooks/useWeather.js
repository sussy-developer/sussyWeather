import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export function useWeather() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [placeData, setPlaceData] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission is needed to fetch weather data');
        return null;
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(currentLocation.coords);
      return currentLocation.coords;
    } catch (e) {
      console.log('Location request error:', e.message);
      return null;
    }
  }

  async function fetchWeather(coords = location) {
    if (!coords) return;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&forecast_hours=12&timezone=auto`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err.message);
    }
  }

  async function fetchPlace(coords = location) {
    if (!coords) return;
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setPlaceData(data);
    } catch (e) {
      console.log('Failed to fetch place name:', e.message);
    }
  }

  async function fetchAqi(coords = location) {
    if (!coords) return;
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.latitude}&longitude=${coords.longitude}&current=us_aqi`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setAqi(data);
    } catch (err) {
      console.log('Failed to fetch AQI:', err.message);
    }
  }

  async function fetchAll(coords) {
    if (!coords) return;
    await Promise.all([
      fetchWeather(coords),
      fetchPlace(coords),
      fetchAqi(coords),
    ]);
  }

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchAll(location);
    }
  }, [location]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      let coords = location;
      try {
        const freshLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        if (freshLoc?.coords) {
          coords = freshLoc.coords;
          setLocation(coords);
        }
      } catch (locErr) {
        console.log('Using existing coordinates for refresh');
      }
      await fetchAll(coords);
    } catch (err) {
      console.error('Refresh error:', err.message);
    } finally {
      setRefreshing(false);
    }
  }

  return {
    location,
    weatherData,
    placeData,
    aqi,
    refreshing,
    onRefresh,
  };
}
