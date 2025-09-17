import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddCityForm from './components/AddCityForm';
import CityList from './components/CityList';
import WeatherDetail from './components/WeatherDetail';
import ErrorToast from './components/ErrorToast';
import About from './components/About';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';

interface SavedCity {
  id: number;
  name: string;
}

// Hero Section Bileşeni - Responsive Versiyon
const HeroSection: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 mb-6 md:mb-12 mt-2 md:mt-4 shadow-lg md:shadow-xl border border-gray-100 mx-2 md:mx-0">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-4 py-1 md:px-6 md:py-2 mb-4 md:mb-6 text-xs md:text-sm">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Canlı Veri Akışı Aktif</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 px-2">
          Dünya'nın Hava Durumu
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            Anlık ve Doğru
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
          200.000'den fazla şehir için gerçek zamanlı hava durumu bilgileri.
          Detaylı tahminler ve uzman analizleriyle her zaman bir adım önde olun.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 w-full sm:w-auto justify-center sm:justify-start">
            <div className="text-lg sm:text-xl">🌍</div>
            <div>
              <div className="font-semibold text-gray-800 text-xs sm:text-sm">200.000+</div>
              <div className="text-xs text-gray-600">Şehir</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 w-full sm:w-auto justify-center sm:justify-start">
            <div className="text-lg sm:text-xl">⏰</div>
            <div>
              <div className="font-semibold text-gray-800 text-xs sm:text-sm">7/24</div>
              <div className="text-xs text-gray-600">Güncel Veri</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 w-full sm:w-auto justify-center sm:justify-start">
            <div className="text-lg sm:text-xl">🎯</div>
            <div>
              <div className="font-semibold text-gray-800 text-xs sm:text-sm">%99.9</div>
              <div className="text-xs text-gray-600">Doğruluk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AppContent bileşeni
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>('weather-cities', []);
  const { weatherData, loading, error, clearError, addCity, addCurrentLocation, removeCity, loadSavedCities } = useWeather();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Ekran boyutu değişikliğini izle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Kayıtlı şehirleri yükleme useEffect'i
  useEffect(() => {
    const migrateData = () => {
      const currentData = localStorage.getItem('weather-cities');
      if (currentData) {
        try {
          const parsed = JSON.parse(currentData);
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            const newData = parsed.map((city: string, index: number) => ({ id: index, name: city }));
            localStorage.setItem('weather-cities', JSON.stringify(newData));
            setSavedCities(newData);
          }
        } catch (error) {
          console.error('Migration error:', error);
        }
      }
    };

    migrateData();
    
    if (savedCities.length > 0) {
      loadSavedCities(savedCities);
    }
  }, [setSavedCities, loadSavedCities, savedCities]);

  const handleAddCity = async (city: string) => {
    try {
      const success = await addCity(city);
      return success;
    } catch (err) {
      return false;
    }
  };

  const handleRemoveCity = (id: number) => {
    removeCity(id);
    setSavedCities(prev => prev.filter(city => city.id !== id));
  };

  const handleAddCurrentLocation = async () => {
    try {
      const cityName = await addCurrentLocation();
      return cityName;
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <ErrorToast message={error} onClose={clearError} />

      <main className="pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5">
          <HeroSection />

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="w-full lg:w-1/4">
              <AddCityForm
                onAddCity={handleAddCity}
                onAddCurrentLocation={handleAddCurrentLocation}
                loading={loading}
                availableCities={[]}
              />
            </div>

            <div className="w-full lg:w-3/4">
              <CityList
                weatherData={weatherData}
                onRemoveCity={handleRemoveCity}
                onShowDetails={(city) => navigate(`/detail/${city}`)}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/detail/:cityName" element={<WeatherDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;