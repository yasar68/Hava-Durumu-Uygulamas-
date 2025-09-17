import React from 'react';
import { Github, Mail, Heart, Cloud, Sun } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20 relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-lg">
                <Sun className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">HavaDurumu</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-full md:max-w-md text-center md:text-left">
              Dünya'nın her yerinden anlık hava durumu bilgilerine erişin. 
              Doğru tahminler ve detaylı analizlerle her zaman hazırlıklı olun.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://github.com/yasar68"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:info@havadurumu.com"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Şehirler</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tahminler</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Harita</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Destek</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Yardım Merkezi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">İletişim</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div className="text-gray-300">
              © {currentYear} HavaDurumu. Tüm hakları saklıdır.
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-400 items-center">
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart size={16} className="text-red-500 fill-current" />
                <span>in Türkiye</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Cloud size={16} />
                <span>OpenWeather API</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Sun size={16} />
                <span>%99.9 Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"></div>
    </footer>
  );
};

export default Footer;
