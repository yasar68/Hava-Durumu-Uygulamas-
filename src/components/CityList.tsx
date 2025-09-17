import React from 'react';
import { WeatherData } from '../types/weather';
import CityCard from './CityCard';

interface CityListProps {
  weatherData: WeatherData[];
  onRemoveCity: (id: number) => void;
  onShowDetails: (city: string) => void;
}

const CityList: React.FC<CityListProps> = ({ weatherData, onRemoveCity, onShowDetails }) => {
  if (weatherData.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center border border-gray-100 max-w-sm sm:max-w-md w-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <div className="text-blue-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 sm:h-16 sm:w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Henüz hiç şehir eklenmemiş
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Hava durumu bilgilerini görmek için şehir ekleyin
          </p>
          <div className="animate-bounce mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {weatherData.map((data) => (
          <CityCard
            key={data.id}
            weatherData={data}
            onRemove={onRemoveCity}
            onShowDetails={onShowDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default CityList;
