import axios from 'axios';
import { WeatherData, ForecastData } from '../types/weather';

// API anahtarını environment variables'tan al
// Eğer environment variable tanımlı değilse, demo key kullan
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'demo-key';

// Eğer demo key kullanılıyorsa uyarı göster
if (API_KEY === 'demo-key') {
  console.warn('OpenWeather API anahtarı bulunamadı. Lütfen .env dosyasında REACT_APP_OPENWEATHER_API_KEY değişkenini tanımlayın.');
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await api.get('/weather', {
      params: { q: city },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Şehir bulunamadı');
    } else if (error.response?.status === 401) {
      throw new Error('API anahtarı geçersiz');
    } else {
      throw new Error('Hava durumu verisi alınamadı');
    }
  }
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await api.get('/weather', {
      params: { lat, lon },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Konumun hava durumu alınamadı');
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await api.get('/forecast', {
      params: { q: city },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Hava tahmini alınamadı');
  }
};