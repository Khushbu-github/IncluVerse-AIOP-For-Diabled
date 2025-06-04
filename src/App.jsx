import React, { useState } from 'react';
import { Menu, X, MessageCircle, Users, Laptop, Accessibility, ChevronDown } from 'lucide-react';

const IncluVerseLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeChecked, setSubscribeChecked] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribing with email:', email);
    // Handle subscription logic here
  };

  const menuItems = [
    'PDFs/images analyser',
    'Grievance Handler',
    'Bus Buddy Bol',
    'Sign Language Translator',
    'Voice Feedback',
    'AI-Powered Chatbot'
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      {/* Enhanced Professional Header */}
      <header className="bg-white shadow-lg relative border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8 lg:py-10">
            <div className="flex items-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">IncluVerse</div>
              <div className="hidden lg:block ml-4 h-8 w-px bg-gray-300"></div>
              <div className="hidden lg:block ml-4 text-sm text-gray-600 font-medium">
                Accessibility Solutions
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-12">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg">About</a>
             
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 flex items-center transition-colors duration-200 font-medium text-lg"
              >
                Solutions
                <ChevronDown className="ml-1 h-5 w-5" />
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Get Started
              </button>
            </nav>
            <button 
              onClick={toggleMenu}
              className="md:hidden p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 border-t border-gray-200">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Solutions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-medium border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-6">
          
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight whitespace-nowrap">
                Breaking Barriers <div className="text-blue-600">Together</div>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                Enhancing Lives of Diverse Communities through cutting-edge accessibility solutions and inclusive technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
             
                <button className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 rounded-3xl p-12 h-[500px] flex items-center justify-center shadow-2xl">
                  <div className="bg-white rounded-2xl shadow-2xl p-12 w-96 h-64 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Laptop className="h-24 w-24 text-blue-500" />
                  </div>
                </div>
                {/* Enhanced floating elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full opacity-60 animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-green-500 rounded-full opacity-60 animate-pulse delay-1000 shadow-lg"></div>
                <div className="absolute top-1/4 -right-4 w-6 h-6 bg-purple-500 rounded-full opacity-60 animate-pulse delay-500 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Our Services
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Comprehensive Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide innovative accessibility solutions designed to create an inclusive digital world for everyone, regardless of their abilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Community Empowerment */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-green-200 via-emerald-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20"></div>
                <Users className="h-24 w-24 text-green-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Community Empowerment
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Building stronger, more inclusive communities through collaborative initiatives and support systems that foster connection and growth.
                </p>
              </div>
            </div>

            {/* Access Tech */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                <Laptop className="h-24 w-24 text-blue-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Access Tech
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Innovative technology solutions designed to enhance accessibility and digital inclusion for all users, breaking down digital barriers.
                </p>
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-purple-200 via-pink-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>
                <Accessibility className="h-24 w-24 text-purple-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Accessibility
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive accessibility services and tools to ensure equal access and participation for everyone in the digital landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Our Purpose
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Mission & Vision</h2>
            <div className="bg-white rounded-3xl shadow-xl p-10 lg:p-16 border border-gray-200">
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
                IncluVerse is committed to revolutionizing accessibility for individuals with diverse needs worldwide. Our platform integrates cutting-edge AI technology, community engagement features, and stringent privacy and security measures to empower and serve the diverse community globally, ensuring a more inclusive and accessible future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-3xl p-10 lg:p-16 border border-gray-200">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
              <div className="lg:w-1/2">
                <div className="text-4xl font-bold text-gray-900 mb-8">IncluVerse</div>
                <div className="text-gray-600 space-y-4 text-lg">
                  <p className="flex items-center">
                    <span className="font-semibold">Phone:</span>
                    <span className="ml-3">123-456-7890</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold">Email:</span>
                    <span className="ml-3">info@incluverse.com</span>
                  </p>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                  Empowering Diversity and Inclusion
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={subscribeChecked}
                      onChange={(e) => setSubscribeChecked(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-4 text-gray-600">
                      Yes, subscribe me to your newsletter. *
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    Subscribe Now
                  </button>
                </div>
                
                <div className="mt-8">
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 font-medium">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Chat Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center space-x-3 z-50">
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold text-lg">Let's Chat!</span>
      </button>
    </div>
  );
};

export default IncluVerseLanding;