import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  Shield, 
  Globe, 
  Users, 
  Zap, 
  ArrowRight,
  Code,
  Heart,
  Target,
  ExternalLink,
  Thermometer,
  Droplets,
  Wind,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const About: React.FC = () => {
  const [citiesWeather, setCitiesWeather] = useState<any[]>([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dünyanın en popüler 20 şehri
  const popularCities = [
    { id: 745044, name: "İstanbul", country: "TR" },
    { id: 2643743, name: "Londra", country: "GB" },
    { id: 5128581, name: "New York", country: "US" },
    { id: 2988507, name: "Paris", country: "FR" },
    { id: 2950159, name: "Berlin", country: "DE" },
    { id: 3435907, name: "Buenos Aires", country: "AR" },
    { id: 1850147, name: "Tokyo", country: "JP" },
    { id: 2147714, name: "Sidney", country: "AU" },
    { id: 6167865, name: "Toronto", country: "CA" },
    { id: 703448, name: "Kiev", country: "UA" },
    { id: 292223, name: "Dubai", country: "AE" },
    { id: 3451190, name: "Rio de Janeiro", country: "BR" },
    { id: 1816670, name: "Pekin", country: "CN" },
    { id: 2800866, name: "Brüksel", country: "BE" },
    { id: 3067696, name: "Prag", country: "CZ" },
    { id: 3117735, name: "Madrid", country: "ES" },
    { id: 3169070, name: "Roma", country: "IT" },
    { id: 524901, name: "Moskova", country: "RU" },
    { id: 360630, name: "Kahire", country: "EG" },
    { id: 1273294, name: "Delhi", country: "IN" }
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6 md:w-8 md:h-8" />,
      title: "200.000+ Şehir",
      description: "Dünya genelinde 200.000'den fazla şehir için hava durumu bilgisi"
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Anlık Veri",
      description: "7/24 kesintisiz ve güncel hava durumu verileri"
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Güvenilir Kaynak",
      description: "OpenWeather API ile doğruluğu kanıtlanmış veriler"
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Kullanıcı Dostu",
      description: "Modern ve kolay kullanılabilir arayüz"
    }
  ];

  const team = [
    {
      name: "Yaşar Satılmış",
      role: "Frontend Geliştirici",
      expertise: "React, TypeScript, Tailwind CSS"
    },
    {
      name: "OpenWeather",
      role: "Veri Sağlayıcı",
      expertise: "Hava Durumu API Hizmetleri"
    }
  ];

  // API'den hava durumu verilerini çek
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const weatherData = [];
        
        // İlk 5 şehir için veri çek (mobil performans için)
        const citiesToFetch = window.innerWidth < 768 ? popularCities.slice(0, 5) : popularCities;
        
        for (const city of citiesToFetch) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=4441dbbe1b7fb642dce0d7539de57212&units=metric&lang=tr`
          );
          
          if (response.ok) {
            const data = await response.json();
            weatherData.push(data);
          } else {
            console.error(`${city.name} için hava durumu alınamadı`);
          }
        }
        
        setCitiesWeather(weatherData);
        setLoading(false);
      } catch (error) {
        console.error("Hava durumu verileri alınırken hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Her 10 saniyede bir şehir değiştir
    const interval = setInterval(() => {
      setCurrentCityIndex((prevIndex) => (prevIndex + 1) % Math.min(popularCities.length, 5));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // API Dökümantasyonu linkine git
  const handleAPIDocumentation = () => {
    window.open('https://openweathermap.org/api', '_blank', 'noopener,noreferrer');
  };

  // Hava durumu ikonunu getir
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl md:rounded-2xl mb-4 md:mb-6">
              <Cloud className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Hakkımızda
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              HavaDurumu, dünyanın dört bir yanındaki şehirler için doğru ve güncel 
              hava durumu bilgileri sunan modern bir meteoroloji platformudur.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg md:shadow-xl border border-gray-100 mb-12 md:mb-16">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                  Misyonumuz
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">
                  Hava durumu bilgilerini herkes için erişilebilir, anlaşılır ve 
                  güvenilir hale getiriyoruz. Teknoloji ve meteorolojiyi birleştirerek 
                  hayatları kolaylaştırmayı amaçlıyoruz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-semibold text-sm md:text-base">%99.9 Doğruluk</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-semibold text-sm md:text-base">Anlık Güncelleme</span>
                  </div>
                </div>
              </div>
              
              {/* Popüler Şehirler Hava Durumu */}
              <div className="flex justify-center">
                {loading ? (
                  <div className="w-56 h-56 md:w-64 md:h-64 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <div className="text-gray-500">Yükleniyor...</div>
                  </div>
                ) : citiesWeather.length > 0 ? (
                  <div className="relative w-full max-w-xs md:max-w-sm">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold">
                            {citiesWeather[currentCityIndex]?.name}
                          </h3>
                          <p className="opacity-90 text-sm md:text-base">
                            {new Date().toLocaleDateString('tr-TR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <img 
                            src={getWeatherIcon(citiesWeather[currentCityIndex]?.weather[0]?.icon)}
                            alt={citiesWeather[currentCityIndex]?.weather[0]?.description}
                            className="w-12 h-12 md:w-16 md:h-16"
                          />
                          <p className="capitalize mt-1 text-xs md:text-sm">
                            {citiesWeather[currentCityIndex]?.weather[0]?.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-end justify-between mt-4 md:mt-6 gap-2 md:gap-0">
                        <div className="text-4xl md:text-5xl font-bold">
                          {Math.round(citiesWeather[currentCityIndex]?.main?.temp)}°C
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1 text-xs md:text-sm">
                            <Thermometer className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span>Hissedilen: {Math.round(citiesWeather[currentCityIndex]?.main?.feels_like)}°C</span>
                          </div>
                          <div className="flex items-center mb-1 text-xs md:text-sm">
                            <Droplets className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span>Nem: {citiesWeather[currentCityIndex]?.main?.humidity}%</span>
                          </div>
                          <div className="flex items-center text-xs md:text-sm">
                            <Wind className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span>Rüzgar: {Math.round(citiesWeather[currentCityIndex]?.wind?.speed * 3.6)} km/s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Şehir İlerleme Göstergesi */}
                    <div className="flex justify-center mt-4 space-x-2">
                      {citiesWeather.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentCityIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentCityIndex(index)}
                          aria-label={`Şehir ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* Küçük Şehir Listesi */}
                    <div className="mt-4 md:mt-6">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-600 mb-2 flex items-center">
                        <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Dünyanın Gözde Şehirleri
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {citiesWeather.slice(0, window.innerWidth < 768 ? 3 : 5).map((city, index) => (
                          <div 
                            key={index}
                            className={`text-center p-2 rounded-lg transition-colors text-xs ${
                              currentCityIndex === index 
                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <div className="truncate">{city.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 md:w-64 md:h-64 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <div className="text-gray-500">Hava durumu verisi alınamadı</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Neden Bizi Seçmelisiniz?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-blue-600 mb-3 md:mb-4">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-white mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Teknoloji Stack'imiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">⚛️</div>
                <div className="font-semibold text-sm md:text-base">React 18</div>
                <div className="text-xs md:text-sm opacity-80">Modern UI</div>
              </div>
              <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">🟦</div>
                <div className="font-semibold text-sm md:text-base">TypeScript</div>
                <div className="text-xs md:text-sm opacity-80">Tip Güvenliği</div>
              </div>
              <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">🎨</div>
                <div className="font-semibold text-sm md:text-base">Tailwind CSS</div>
                <div className="text-xs md:text-sm opacity-80">Stil</div>
              </div>
              <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">🌤️</div>
                <div className="font-semibold text-sm md:text-base">OpenWeather</div>
                <div className="text-xs md:text-sm opacity-80">API</div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Ekibimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 text-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2 md:mb-3 text-sm md:text-base">{member.role}</p>
                  <p className="text-gray-600 text-sm md:text-base">{member.expertise}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg md:shadow-xl border border-gray-100 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
              Hava Durumu Keşfetmeye Hazır mısınız?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Hemen şehir ekleyin ve dünyanın hava durumu bilgilerine anında erişin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 text-sm md:text-base"
              >
                Şehir Eklemeye Başla
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Link>
              <button 
                onClick={handleAPIDocumentation}
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-gray-300 text-gray-700 rounded-xl md:rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm md:text-base"
              >
                <Code className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                API Dökümantasyonu
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* API Info Section */}
          <div className="bg-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-blue-200 mt-8 md:mt-12">
            <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 md:mb-6 text-center">
              🚀 Geliştiriciler İçin
            </h3>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2 md:mb-3 text-sm md:text-base">OpenWeather API</h4>
                <p className="text-blue-600 mb-3 md:mb-4 text-sm md:text-base">
                  Uygulamamız OpenWeather API'yi kullanarak gerçek zamanlı hava durumu 
                  verileri sağlar. API'yi kendi projelerinizde de kullanabilirsiniz.
                </p>
                <ul className="text-blue-600 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>• 200.000+ şehir için veri</li>
                  <li>• 5 günlük hava tahmini</li>
                  <li>• Saatlik veri güncellemeleri</li>
                  <li>• Ücretsiz ve premium planlar</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2 md:mb-3 text-sm md:text-base">API Özellikleri</h4>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center text-blue-600 text-sm md:text-base">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                    <span>JSON ve XML format desteği</span>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm md:text-base">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                    <span>GPS koordinat desteği</span>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm md:text-base">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                    <span>Çoklu dil desteği</span>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm md:text-base">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                    <span>Detaylı meteorolojik veriler</span>
                  </div>
                </div>
                <button 
                  onClick={handleAPIDocumentation}
                  className="mt-3 md:mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm md:text-base"
                >
                  Tam API dökümantasyonunu inceleyin
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 md:mt-12">
            <div className="inline-flex items-center space-x-2 text-gray-500 text-sm md:text-base">
              <span>Made with</span>
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-current" />
              <span>in Türkiye</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;