import React from "react";
import { NavLink } from "react-router-dom";
import { Sun, CloudRain, CloudSnow, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Sun className="text-white" size={28} />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HavaDurumu
              </span>
              <p className="text-[10px] sm:text-xs text-gray-500 -mt-1">
                by WeatherApp
              </p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200/50">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`
              }
            >
              <CloudRain size={18} />
              <span>Ana Sayfa</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`
              }
            >
              <CloudSnow size={18} />
              <span>Hakkında</span>
            </NavLink>
          </div>

          {/* Weather Indicators & Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Sistem Aktif - sadece md ve üstü */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </div>

            {/* Icon */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="bg-blue-100 rounded-full p-2">
                <Sun size={18} className="text-blue-600" />
              </div>
            </div>

            {/* Hamburger Menu Button - sadece mobilde */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="flex flex-col py-4 space-y-2 px-4">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`
              }
            >
              <CloudRain size={18} />
              <span>Ana Sayfa</span>
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`
              }
            >
              <CloudSnow size={18} />
              <span>Hakkında</span>
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
