import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Search, Navigation, Loader } from 'lucide-react';

interface AddCityFormProps {
  onAddCity: (city: string) => void;
  onAddCurrentLocation: () => void;
  loading: boolean;
  availableCities: string[];
}

const AddCityForm: React.FC<AddCityFormProps> = ({
  onAddCity,
  onAddCurrentLocation,
  loading,
  availableCities
}) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    if (city.trim() && availableCities.length > 0) {
      const filteredSuggestions = availableCities.filter(
        c => c.toLowerCase().includes(city.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city, availableCities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onAddCity(city.trim());
      setCity('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setShowSuggestions(false);
    onAddCity(suggestion);
    setCity('');
  };

  const handleCurrentLocationClick = async () => {
    setIsLocationLoading(true);
    try {
      await onAddCurrentLocation();
    } catch (error) {
      console.error('Konum ekleme hatası:', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center mb-4 md:mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 md:p-2 rounded-lg">
          <MapPin className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold ml-2 md:ml-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Şehir Ekle
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="relative mb-3 md:mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Şehir adı yazın (örn: İstanbul, Ankara)"
            className="w-full p-3 md:p-4 pl-9 md:pl-10 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 md:focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm md:text-base"
            disabled={loading}
          />
          {city && (
            <button
              type="button"
              onClick={() => setCity('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 md:mt-2 bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 md:px-4 py-2 md:py-3 cursor-pointer hover:bg-blue-50 transition-all duration-150 flex items-center border-b border-gray-100 last:border-b-0 text-sm md:text-base"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </form>
      
      <div className="flex gap-2 md:gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !city.trim()}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 md:p-4 rounded-lg md:rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm md:text-base"
        >
          {loading ? (
            <Loader className="animate-spin mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Plus className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
          )}
          {loading ? 'Ekleniyor...' : 'Şehir Ekle'}
        </button>
        
        <button
          onClick={handleCurrentLocationClick}
          disabled={loading || isLocationLoading}
          className="px-3 md:px-4 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 md:p-4 rounded-lg md:rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium relative group text-sm md:text-base"
          title="Mevcut konumunuzu ekle"
        >
          {isLocationLoading ? (
            <Loader className="animate-spin w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <>
              <Navigation className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute -top-8 -left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Konumumu Ekle
              </span>
            </>
          )}
        </button>
      </div>

      {/* İpucu metni */}
      <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500 text-center">
        <p>Popüler şehirler: İstanbul, Ankara, İzmir, Bursa, Antalya</p>
      </div>
    </div>
  );
};

export default AddCityForm;