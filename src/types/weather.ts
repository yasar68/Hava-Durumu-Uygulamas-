// Hava durumu verileri için TypeScript arayüzleri
// Bu sayede TypeScript, veri yapılarını anlayabilir ve hata kontrolü yapabilir

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  weather: Weather[];
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  dt_txt: string;
  sys?: Sys; // opsiyonel, bazı forecast itemlarda bulunmayabilir
}

export interface City {
  id: number;
  name: string;
  country: string;
  timezone: number;
  sunrise: number; // Unix timestamp
  sunset: number;  // Unix timestamp
}

export interface ForecastData {
  list: ForecastItem[];
  city: City;
}
