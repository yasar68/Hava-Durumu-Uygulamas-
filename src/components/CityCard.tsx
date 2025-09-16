import React from 'react';
import { WeatherData } from '../types/weather';
import { X, ChevronRight, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

interface CityCardProps {
  weatherData: WeatherData;
  onRemove: (id: number) => void;
  onShowDetails: (city: string) => void;
}

const CityCard: React.FC<CityCardProps> = ({ weatherData, onRemove, onShowDetails }) => {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '⛅',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  const getTurkishDescription = (description: string) => {
    const descriptions: { [key: string]: string } = {
      'clear sky': 'Açık',
      'few clouds': 'Az Bulutlu',
      'scattered clouds': 'Parçalı Bulutlu',
      'broken clouds': 'Çok Bulutlu',
      'overcast clouds': 'Bulutlu',
      'light rain': 'Hafif Yağmurlu',
      'moderate rain': 'Orta Şiddetli Yağmurlu',
      'heavy rain': 'Şiddetli Yağmurlu',
      'shower rain': 'Sağanak Yağışlı',
      'thunderstorm': 'Gök Gürültülü Fırtına',
      'snow': 'Karlı',
      'mist': 'Sisli',
      'fog': 'Sisli'
    };
    return descriptions[description] || description;
  };

  const getBackgroundClass = (main: string) => {
    const backgroundMap: { [key: string]: string } = {
      'Clear': 'bg-gradient-to-br from-yellow-100 to-orange-100',
      'Clouds': 'bg-gradient-to-br from-blue-50 to-gray-100',
      'Rain': 'bg-gradient-to-br from-blue-100 to-indigo-100',
      'Drizzle': 'bg-gradient-to-br from-blue-50 to-cyan-100',
      'Thunderstorm': 'bg-gradient-to-br from-purple-100 to-indigo-200',
      'Snow': 'bg-gradient-to-br from-cyan-50 to-blue-100',
      'Mist': 'bg-gradient-to-br from-gray-50 to-gray-100',
      'Fog': 'bg-gradient-to-br from-gray-100 to-gray-200'
    };
    
    return backgroundMap[main] || 'bg-gradient-to-br from-blue-50 to-indigo-100';
  };

  return (
    <div className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${getBackgroundClass(weatherData.weather[0].main)}`}>
      {/* Şehir adı ve kapat butonu */}
      <div className="flex justify-between items-start p-4">
        <div className="flex items-center">
          <MapPin size={16} className="text-red-500 mr-1" />
          <h2 className="text-lg font-bold text-gray-800">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
        </div>
        <button
          onClick={() => onRemove(weatherData.id)}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-30 transition-colors"
          aria-label="Şehri kaldır"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>
      
      {/* Ana hava durumu bilgisi */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-gray-800">
              {Math.round(weatherData.main.temp)}°C
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Hissedilen: {Math.round(weatherData.main.feels_like)}°C
            </div>
          </div>
          <div className="text-4xl">
            {getWeatherIcon(weatherData.weather[0].icon)}
          </div>
        </div>
        
        <div className="text-sm font-medium text-gray-700 mt-1">
          {getTurkishDescription(weatherData.weather[0].description)}
        </div>
      </div>
      
      {/* Detaylı bilgiler */}
      <div className="grid grid-cols-2 gap-2 p-4 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center text-sm">
          <Thermometer size={14} className="text-blue-500 mr-1" />
          <span className="text-gray-700">{Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°</span>
        </div>
        <div className="flex items-center text-sm">
          <Droplets size={14} className="text-blue-400 mr-1" />
          <span className="text-gray-700">%{weatherData.main.humidity}</span>
        </div>
        <div className="flex items-center text-sm">
          <Wind size={14} className="text-gray-500 mr-1" />
          <span className="text-gray-700">{weatherData.wind.speed} m/s</span>
        </div>
        <div className="flex items-center text-sm">
          <Eye size={14} className="text-gray-600 mr-1" />
          <span className="text-gray-700">{(weatherData.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
      
      {/* Detay butonu */}
      <button
        onClick={() => onShowDetails(weatherData.name)}
        className="w-full flex items-center justify-center py-3 bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 text-blue-600 font-medium mt-2"
      >
        <span>Detaylı Bilgi</span>
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default CityCard;