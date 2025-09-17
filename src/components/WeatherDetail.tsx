import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Gauge, Eye, Sunrise, Sunset, Wind, Droplets, Thermometer } from 'lucide-react';
import { ForecastData, ForecastItem, City } from '../types/weather';
import { getForecast } from '../utils/api';

// Chart.js imports
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import type { TooltipItem } from 'chart.js';

// Register Chart.js elements
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const WeatherDetail: React.FC = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const navigate = useNavigate();
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        const fetchForecast = async () => {
            if (!cityName) return;

            setLoading(true);
            try {
                const data = await getForecast(cityName);
                setForecast(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Hava durumu tahmini alınamadı');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [cityName]);

    useEffect(() => {
        if (forecast && chartRef.current) {
            renderTemperatureChart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forecast, selectedDayIndex]);

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

    const getDailyForecasts = () => {
        if (!forecast) return {};
        const dailyForecasts: { [key: string]: ForecastItem[] } = {};

        forecast.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toLocaleDateString('tr-TR');

            if (!dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = [];
            }
            dailyForecasts[dateKey].push(item);
        });

        return dailyForecasts;
    };

    const getSelectedDayForecasts = () => {
        const dailyForecasts = getDailyForecasts();
        const dates = Object.keys(dailyForecasts);

        if (dates.length > selectedDayIndex) {
            return dailyForecasts[dates[selectedDayIndex]];
        }

        return [];
    };

    const getSelectedDayData = () => {
        const forecasts = getSelectedDayForecasts();
        if (forecasts.length === 0 || !forecast) return null;

        const temps = forecasts.map(f => f.main.temp);
        const feelsLike = forecasts.map(f => f.main.feels_like);
        const humidity = forecasts.map(f => f.main.humidity);
        const pressures = forecasts.map(f => f.main.pressure);
        const windSpeeds = forecasts.map(f => f.wind.speed);
        const visibilities = forecasts.map(f => f.visibility);

        const weatherCount: { [key: string]: number } = {};
        forecasts.forEach(f => {
            const main = f.weather[0].main;
            weatherCount[main] = (weatherCount[main] || 0) + 1;
        });
        const mainWeather = Object.keys(weatherCount).reduce((a, b) =>
            weatherCount[a] > weatherCount[b] ? a : b
        );
        const weatherItem = forecasts.find(f => f.weather[0].main === mainWeather) || forecasts[0];

        let sunrise = forecast.city.sunrise;
        let sunset = forecast.city.sunset;
        let sunDataAvailable = true;

        const selectedDate = new Date(forecasts[0].dt * 1000);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (!isToday) {
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const dayForecasts = forecast.list.filter(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate >= startOfDay && itemDate <= endOfDay;
            });

            const hasSunData = dayForecasts.some(item => item.sys && (item.sys.sunrise || item.sys.sunset));

            if (hasSunData) {
                const sunDataItem = dayForecasts.find(item => item.sys && (item.sys.sunrise || item.sys.sunset));
                if (sunDataItem && sunDataItem.sys) {
                    sunrise = sunDataItem.sys.sunrise || sunrise;
                    sunset = sunDataItem.sys.sunset || sunset;
                }
            } else {
                sunDataAvailable = false;
                const dayOfYear = Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
                sunrise = startOfDay.getTime() / 1000 + (6 * 3600) + (dayOfYear % 10 * 60);
                sunset = startOfDay.getTime() / 1000 + (18 * 3600) - (dayOfYear % 10 * 60);
            }
        }

        return {
            date: selectedDate,
            temp: {
                min: Math.min(...forecasts.map(f => f.main.temp_min)),
                max: Math.max(...forecasts.map(f => f.main.temp_max)),
                avg: temps.reduce((a, b) => a + b, 0) / temps.length,
            },
            feels_like: feelsLike.reduce((a, b) => a + b, 0) / feelsLike.length,
            humidity: humidity.reduce((a, b) => a + b, 0) / humidity.length,
            pressure: pressures.reduce((a, b) => a + b, 0) / pressures.length,
            wind: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
            weather: weatherItem.weather[0],
            visibility: visibilities.reduce((a, b) => a + b, 0) / visibilities.length,
            sunrise,
            sunset,
            sunDataAvailable
        };
    };

    const renderTemperatureChart = () => {
        if (!forecast || !chartRef.current) return;

        const forecasts = getSelectedDayForecasts();
        if (forecasts.length === 0) return;

        const labels = forecasts.map(item => {
            const date = new Date(item.dt * 1000);
            return date.toLocaleTimeString('tr-TR', { hour: '2-digit' });
        });

        const temperatures = forecasts.map(item => Math.round(item.main.temp));

        if (chartInstance.current) chartInstance.current.destroy();

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Sıcaklık (°C)',
                    data: temperatures,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '24 Saatlik Sıcaklık Değişimi',
                        font: { size: 16 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context: TooltipItem<'line'>) {
                                return `Sıcaklık: ${context.parsed.y}°C`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Sıcaklık (°C)' }
                    },
                    x: {
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 12
                        }
                    }
                }
            }
        });
    };

    const getDayName = (dateStr: string, index: number) => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const parts = dateStr.split('.');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day);

        if (date.toDateString() === today.toDateString()) return 'Bugün';
        if (date.toDateString() === tomorrow.toDateString()) return 'Yarın';

        return date.toLocaleDateString('tr-TR', { weekday: 'long' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="animate-pulse">
                        <div className="h-12 w-12 bg-blue-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !forecast) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Geri Dön
                    </button>
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="text-red-500 text-5xl mb-4">
                            <i className="fas fa-exclamation-circle"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Hata Oluştu</h3>
                        <p className="text-gray-600">{error || 'Hava durumu bilgisi alınamadı'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const dailyForecasts = getDailyForecasts();
    const dates = Object.keys(dailyForecasts);
    const selectedDayData = getSelectedDayData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-white rounded-lg shadow-sm"
                >
                    <ArrowLeft size={20} className="mr-2" /> Geri Dön
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                            {forecast.city.name}, {forecast.city.country}
                            <span className="text-blue-500 ml-2">
                                <i className="fas fa-location-dot"></i>
                            </span>
                        </h2>

                        <div className="flex items-center bg-gray-100 rounded-lg p-2 w-full md:w-auto">
                            <Calendar size={18} className="text-gray-500 mr-2" />
                            <select
                                value={selectedDayIndex}
                                onChange={(e) => setSelectedDayIndex(parseInt(e.target.value))}
                                className="bg-transparent outline-none w-full"
                            >
                                {dates.slice(0, 7).map((date, index) => (
                                    <option key={date} value={index}>
                                        {getDayName(date, index)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Günlük Hava Durumu Özeti */}
                    {selectedDayData && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                            <div className="bg-blue-50 p-3 md:p-4 rounded-xl text-center">
                                <p className="text-sm md:text-base text-gray-600">Maksimum</p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600">
                                    {Math.round(selectedDayData.temp.max)}°C
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 md:p-4 rounded-xl text-center">
                                <p className="text-sm md:text-base text-gray-600">Minimum</p>
                                <p className="text-xl md:text-2xl font-bold text-green-600">
                                    {Math.round(selectedDayData.temp.min)}°C
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-3 md:p-4 rounded-xl text-center">
                                <p className="text-sm md:text-base text-gray-600">Ortalama</p>
                                <p className="text-xl md:text-2xl font-bold text-yellow-600">
                                    {Math.round(selectedDayData.temp.avg)}°C
                                </p>
                            </div>
                            <div className="bg-indigo-50 p-3 md:p-4 rounded-xl text-center">
                                <p className="text-sm md:text-base text-gray-600">Hissedilen</p>
                                <p className="text-xl md:text-2xl font-bold text-indigo-600">
                                    {Math.round(selectedDayData.feels_like)}°C
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sıcaklık Grafiği */}
                    <div className="mb-6 md:mb-8 h-64 md:h-80">
                        <canvas ref={chartRef}></canvas>
                    </div>

                    {/* Saatlik Hava Durumu */}
                    <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                        <i className="fas fa-clock text-blue-500 mr-2"></i>
                        Saatlik Tahminler
                    </h3>
                    <div className="overflow-x-auto pb-4">
                        <div className="flex space-x-3 md:space-x-4 min-w-max">
                            {getSelectedDayForecasts().map((item, index) => {
                                const time = new Date(item.dt * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit' });
                                const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

                                return (
                                    <div key={index} className="flex-shrink-0 w-20 md:w-24 text-center bg-gray-50 rounded-xl p-3 shadow-sm">
                                        <p className="font-medium text-gray-700 text-sm md:text-base">{time}</p>
                                        <img src={iconUrl} alt={item.weather[0].description} className="mx-auto w-8 h-8 md:w-10 md:h-10 my-2" />
                                        <p className="text-base md:text-lg font-bold text-gray-800">{Math.round(item.main.temp)}°C</p>
                                        <p className="text-xs text-gray-600 capitalize">{getTurkishDescription(item.weather[0].description)}</p>
                                        <div className="flex justify-center items-center mt-2 text-xs text-gray-500">
                                            <Droplets size={12} className="mr-1" />
                                            <span>{item.main.humidity}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Detaylı Hava Bilgileri */}
                {selectedDayData && (
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center">
                            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                            Detaylı Hava Bilgileri
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <div className="flex items-center p-3 md:p-4 bg-blue-50 rounded-xl">
                                <Gauge className="text-blue-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Basınç</p>
                                    <p className="text-sm md:text-base">{Math.round(selectedDayData.pressure)} hPa</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-green-50 rounded-xl">
                                <Eye className="text-green-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Görüş Mesafesi</p>
                                    <p className="text-sm md:text-base">{(selectedDayData.visibility / 1000).toFixed(1)} km</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-purple-50 rounded-xl">
                                <Droplets className="text-purple-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Nem</p>
                                    <p className="text-sm md:text-base">{Math.round(selectedDayData.humidity)}%</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-orange-50 rounded-xl">
                                <Wind className="text-orange-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Rüzgar</p>
                                    <p className="text-sm md:text-base">{selectedDayData.wind.toFixed(1)} m/s</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-red-50 rounded-xl">
                                <Sunrise className="text-red-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Gün Doğumu</p>
                                    <p className="text-sm md:text-base">
                                        {selectedDayData.sunDataAvailable
                                            ? new Date(selectedDayData.sunrise * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                                            : 'Veri Yok'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-indigo-50 rounded-xl">
                                <Sunset className="text-indigo-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Gün Batımı</p>
                                    <p className="text-sm md:text-base">
                                        {selectedDayData.sunDataAvailable
                                            ? new Date(selectedDayData.sunset * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                                            : 'Veri Yok'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-yellow-50 rounded-xl">
                                <Thermometer className="text-yellow-500 mr-3" size={20} />
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Hava Durumu</p>
                                    <p className="text-sm md:text-base capitalize">{getTurkishDescription(selectedDayData.weather.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-teal-50 rounded-xl">
                                <i className="fas fa-temperature-low text-teal-500 mr-3 text-lg"></i>
                                <div>
                                    <p className="font-semibold text-sm md:text-base">Çiğ Noktası</p>
                                    <p className="text-sm md:text-base">{Math.round(selectedDayData.temp.min)}°C</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDetail;