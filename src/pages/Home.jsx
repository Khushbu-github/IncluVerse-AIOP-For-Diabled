import React, { useState } from 'react';
import { Menu, X, MessageCircle, Users, Laptop, Accessibility, ChevronDown, Eye, Ear, HandHeart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">IncluVerse</h3>
          <p className="text-gray-300">Empowering independence through accessibility.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 IncluVerse. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const IncluVerseLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeChecked, setSubscribeChecked] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const handleNavigation = (path) => {
    // In a real application with React Router, you would use navigate(path)
    // For now, we'll use window.location to navigate
    window.location.href = path;
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleLearnMore = () => {
    // Navigate to about page
    window.location.href = '/about';
  };

  const menuItems = [
    'PDFs/Images Analyzer',
    'Grievance Handler',
    'Bus Buddy Bol',
    'Sign Language Translator',
    'AI-Powered Chatbot',
    'Emergency'
  ];
  const pages = [
    'img_analyzer',
    'grievance',
    'busbuddybol',
    'signlang',
    'chatbot',
    'emergency'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Enhanced Professional Header */}
      <header className="backdrop-blur-md bg-white/95 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center min-w-0">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform duration-200"
              >
                IncluVerse
              </button>
              <div className="hidden lg:block ml-4 h-6 w-px bg-gray-300"></div>
              <div className="hidden lg:block ml-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                All-in-One Platform for Disabled People
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg"
              >
                About
              </button>
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 flex items-center transition-colors duration-200 font-medium text-base lg:text-lg"
              >
                Solutions
                <ChevronDown className={`ml-1 h-4 w-4 lg:h-5 lg:w-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </nav>
            
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 backdrop-blur-lg bg-white/95 shadow-2xl z-50 border-t border-gray-200/50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Our Accessibility Solutions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(`/${pages[index]}`)}
                    className="block w-full text-left px-4 lg:px-6 py-3 lg:py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-medium border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md text-sm lg:text-base"
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              {/* Mobile navigation items */}
              <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <button 
                    onClick={() => handleNavigation('/')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-medium"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => handleNavigation('/about')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-medium"
                  >
                    About
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-4 lg:mb-6">
                <span className="inline-block px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg">
                  Empowering Independence
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 lg:mb-8 leading-tight">
                Breaking Barriers{' '}
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Together
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-6 lg:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The all-in-one platform designed by and for disabled people, featuring AI-powered tools, community support, and assistive technologies that enhance independence and quality of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleLearnMore}
                  className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 lg:px-10 py-3 lg:py-4 rounded-xl text-base lg:text-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 aspect-square flex items-center justify-center shadow-2xl">
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 w-full max-w-xs flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Accessibility className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-blue-500" />
                  </div>
                </div>
                
                {/* Enhanced floating elements */}
                <div className="absolute -top-3 -left-3 w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full opacity-60 animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full opacity-60 animate-pulse delay-1000 shadow-lg"></div>
                <div className="absolute top-1/4 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-60 animate-pulse delay-500 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-20">
            <div className="mb-4 lg:mb-6">
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
                Our Core Services
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              Comprehensive Disability Support
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From assistive technologies to community connection, we provide everything disabled people need to thrive independently and confidently in their daily lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Assistive Technology */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
              <div className="h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-colors duration-300"></div>
                <Eye className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-blue-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                  Assistive Technology
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  Advanced AI-powered tools including text-to-speech, image recognition, sign language translation, and document analysis to support various disabilities.
                </p>
              </div>
            </div>

            {/* Community Support */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
              <div className="h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-green-200 via-emerald-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 group-hover:from-green-400/30 group-hover:to-blue-400/30 transition-colors duration-300"></div>
                <Users className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-green-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                  Community Support
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  Connect with other disabled individuals, share experiences, access peer support, and build meaningful relationships within our inclusive community.
                </p>
              </div>
            </div>

            {/* Daily Living Tools */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1 border border-gray-100 group">
              <div className="h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-purple-200 via-pink-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-colors duration-300"></div>
                <HandHeart className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-purple-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                  Daily Living Support
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  Practical tools for everyday challenges including transportation assistance, voice feedback systems, and grievance handling to enhance independence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 lg:mb-8">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
                Our Mission
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-12">
              Empowering Disabled Lives
            </h2>
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-16 border border-gray-200">
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 lg:mb-8">
                IncluVerse is the world's first comprehensive platform designed exclusively for disabled people, by disabled people. We combine cutting-edge AI technology, assistive tools, and community support to break down barriers and create a world where disability is not a limitation.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Our platform addresses the unique challenges faced by people with visual, hearing, mobility, and cognitive disabilities, providing personalized solutions that enhance independence, foster community connection, and ensure equal access to information and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Chat Button */}
      <button 
        onClick={() => handleNavigation('/chatbot')}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 lg:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 lg:space-x-3 z-50 group" 
        aria-label="Open accessibility chat"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
        <span className="hidden sm:inline font-semibold text-sm lg:text-lg whitespace-nowrap">
          Need Help?
        </span>
      </button>
      
      <Footer />
    </div>
  );
};

export default IncluVerseLanding;