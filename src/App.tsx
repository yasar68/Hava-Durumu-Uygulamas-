import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddCityForm from './components/AddCityForm';
import CityList from './components/CityList';
import WeatherDetail from './components/WeatherDetail';
import ErrorToast from './components/ErrorToast';
import About from './components/About'; // About bileşenini import ettik
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';

interface SavedCity {
  id: number;
  name: string;
}

// Hero Section Bileşeni - BASİT VERSİYON
const HeroSection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 mb-12 mt-4 shadow-xl border border-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-6 py-2 mb-6">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white">Canlı Veri Akışı Aktif</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          Dünya'nın Hava Durumu
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Anlık ve Doğru
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          200.000'den fazla şehir için gerçek zamanlı hava durumu bilgileri.
          Detaylı tahminler ve uzman analizleriyle her zaman bir adım önde olun.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-6 py-3 border border-gray-200">
            <div className="text-2xl">🌍</div>
            <div>
              <div className="font-semibold text-gray-800">200.000+</div>
              <div className="text-sm text-gray-600">Şehir</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-6 py-3 border border-gray-200">
            <div className="text-2xl">⏰</div>
            <div>
              <div className="font-semibold text-gray-800">7/24</div>
              <div className="text-sm text-gray-600">Güncel Veri</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-6 py-3 border border-gray-200">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-semibold text-gray-800">%99.9</div>
              <div className="text-sm text-gray-600">Doğruluk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AppContent bileşeninde
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>('weather-cities', []);
  const { weatherData, loading, error, clearError, addCity, addCurrentLocation, removeCity, loadSavedCities } = useWeather();

  // Kayıtlı şehirleri yükleme useEffect'i
  useEffect(() => {
    // Eski formatı yeni formata dönüştür
    const migrateData = () => {
      const currentData = localStorage.getItem('weather-cities');
      if (currentData) {
        try {
          const parsed = JSON.parse(currentData);
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            // Eski format, yeni formata dönüştür
            const newData = parsed.map((city: string) => ({ id: 0, name: city }));
            localStorage.setItem('weather-cities', JSON.stringify(newData));
            setSavedCities(newData);
            console.log('Data migrated to new format');
          }
        } catch (error) {
          console.error('Migration error:', error);
        }
      }
    };

    migrateData();
    
    // Kayıtlı şehirleri yükle
    if (savedCities.length > 0) {
      loadSavedCities(savedCities);
    }
  }, [setSavedCities, loadSavedCities, savedCities]); // savedCities'i dependency array'e ekledik

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

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
            <div className="lg:col-span-1">
              <AddCityForm
                onAddCity={handleAddCity}
                onAddCurrentLocation={handleAddCurrentLocation}
                loading={loading}
                availableCities={[]}
              />
            </div>

            <div className="lg:col-span-3">
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