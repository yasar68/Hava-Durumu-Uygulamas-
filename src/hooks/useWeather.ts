// hooks/useWeather.ts
import { useState, useCallback } from 'react'; // useCallback'i import et
import { WeatherData } from '../types/weather';
import { getWeather, getWeatherByCoords } from '../utils/api';

// Geolocation hata kodlarını kullanıcı dostu mesajlara çevir
const getGeolocationError = (code: number): string => {
  switch (code) {
    case 1:
      return 'Konum erişimi reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
    case 2:
      return 'Konum bilgisi alınamadı. Lütfen internet bağlantınızı kontrol edin.';
    case 3:
      return 'Konum bilgisi almak zaman aşımına uğradı.';
    default:
      return 'Konum bilgisi alınamadı.';
  }
};
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Kayıtlı şehirleri yükle - useCallback ile sarmala
  const loadSavedCities = useCallback(async (cities: Array<{id: number, name: string}>) => {
    if (cities.length === 0) return;

    try {
      setLoading(true);
      // Sadece geçerli ID'leri olan şehirleri yükle
      const validCities = cities.filter(city => city.id !== 0);
      
      if (validCities.length === 0) {
        setLoading(false);
        return;
      }
      
      const promises = validCities.map(city => getWeather(city.name));
      
      const results = await Promise.allSettled(promises);
      
      const successfulResults: WeatherData[] = [];
      const failedCities: string[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          successfulResults.push(result.value);
        } else if (result.status === 'rejected') {
          failedCities.push(validCities[index].name);
          console.error(`${validCities[index].name} şehri yüklenirken hata oluştu:`, result.reason);
        }
      });
      
      setWeatherData(successfulResults);
      
      if (failedCities.length > 0) {
        setError(`${failedCities.join(', ')} şehirleri yüklenemedi`);
      }
    } catch (err) {
      setError('Şehirler yüklenirken genel bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCity = async (city: string): Promise<boolean> => {
    // Şehir zaten listede var mı kontrol et
    if (weatherData.some(data => data.name.toLowerCase() === city.toLowerCase())) {
      setError(`${city} zaten listede mevcut`);
      return false;
    }

    try {
      setLoading(true);
      const data = await getWeather(city);
      if (data) {
        setWeatherData(prev => [...prev, data]);

        // localStorage'a ID ve isim ile kaydet
        const currentSavedCities = JSON.parse(localStorage.getItem('weather-cities') || '[]');
        const updatedCities = [...currentSavedCities, { id: data.id, name: data.name }];
        localStorage.setItem('weather-cities', JSON.stringify(updatedCities));

        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.message || `${city} şehri eklenirken hata oluştu`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCurrentLocation = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('Konum bilgisi alınamıyor');
        reject(new Error('Konum bilgisi alınamıyor'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            const data = await getWeatherByCoords(latitude, longitude);

            if (data) {
              // Konum zaten listede var mı kontrol et
              if (weatherData.some(item => item.name.toLowerCase() === data.name.toLowerCase())) {
                setError(`${data.name} zaten listede mevcut`);
                resolve(null);
                return;
              }

              setWeatherData(prev => [...prev, data]);

              // localStorage'a ID ve isim ile kaydet
              const currentSavedCities = JSON.parse(localStorage.getItem('weather-cities') || '[]');
              const updatedCities = [...currentSavedCities, { id: data.id, name: data.name }];
              localStorage.setItem('weather-cities', JSON.stringify(updatedCities));

              resolve(data.name);
            } else {
              resolve(null);
            }
          } catch (err: any) {
            const errorMessage = err.message || 'Konumunuz eklenirken hata oluştu';
            setError(errorMessage);
            reject(err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          const errorMessage = getGeolocationError(error.code);
          setError(errorMessage);
          reject(new Error(errorMessage));
        }
      );
    });
  };

  const removeCity = (id: number) => {
    console.log('removeCity called with id:', id);

    // State'den kaldır
    setWeatherData(prev => prev.filter(data => data.id !== id));

    // localStorage'dan ID ile kaldır
    const currentSavedCities = JSON.parse(localStorage.getItem('weather-cities') || '[]');
    const updatedCities = currentSavedCities.filter((city: any) => city.id !== id);
    localStorage.setItem('weather-cities', JSON.stringify(updatedCities));

    console.log('City removed from localStorage');
  };

  return {
    weatherData,
    loading,
    error,
    clearError,
    addCity,
    addCurrentLocation,
    removeCity,
    loadSavedCities
  };
};