import React, { useState } from 'react';
import { Menu, X, MessageCircle, Users, Laptop, Accessibility, ChevronDown, Eye, Ear, HandHeart } from 'lucide-react';
import Footer from '../components/footer';


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
    'PDFs/Images Analyzer',
    'Grievance Handler',
    'Bus Buddy Bol',
    'Sign Language Translator',
    'Voice Feedback',
    'AI-Powered Chatbot',
    'Emergency'
  ];
  const pages= [
    'img_analyzer',
    'greviance',
    'busbuddybol',
    'signlang',
    'voicefeed',
    'chatbot',
    'emergency'
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      {/* Enhanced Professional Header */}
      <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8 lg:py-8">
            <div className="flex items-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">IncluVerse</div>
              <div className="hidden lg:block ml-4 h-8 w-px bg-gray-300"></div>
              <div className="hidden lg:block ml-4 text-sm text-gray-600 font-medium">
                All-in-One Platform for Disabled People
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
                <ChevronDown className={`ml-1 h-5 w-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Accessibility Solutions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={`/${pages[index]}`}
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
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Empowering Independence
                </span>
              </div>
               <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight whitespace-nowrap">
                Breaking Barriers <div className="text-blue-600">Together</div>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                The all-in-one platform designed by and for disabled people, featuring AI-powered tools, community support, and assistive technologies that enhance independence and quality of life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Learn More
                </button>
                {/* <button className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  Explore Features
                </button> */}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 rounded-3xl p-12 h-[500px] flex items-center justify-center shadow-2xl">
                  <div className="bg-white rounded-2xl shadow-2xl p-12 w-96 h-64 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Accessibility className="h-24 w-24 text-blue-500" />
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
                Our Core Services
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Comprehensive Disability Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From assistive technologies to community connection, we provide everything disabled people need to thrive independently and confidently in their daily lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Assistive Technology */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                <Eye className="h-24 w-24 text-blue-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Assistive Technology
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced AI-powered tools including text-to-speech, image recognition, sign language translation, and document analysis to support various disabilities.
                </p>
              </div>
            </div>

            {/* Community Support */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-green-200 via-emerald-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20"></div>
                <Users className="h-24 w-24 text-green-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Community Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with other disabled individuals, share experiences, access peer support, and build meaningful relationships within our inclusive community.
                </p>
              </div>
            </div>

            {/* Daily Living Tools */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1 border border-gray-100">
              <div className="h-72 bg-gradient-to-br from-purple-200 via-pink-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>
                <HandHeart className="h-24 w-24 text-purple-600 relative z-10" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Daily Living Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Practical tools for everyday challenges including transportation assistance, voice feedback systems, and grievance handling to enhance independence.
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
                Our Mission
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Empowering Disabled Lives</h2>
            <div className="bg-white rounded-3xl shadow-xl p-10 lg:p-16 border border-gray-200">
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
                IncluVerse is the world's first comprehensive platform designed exclusively for disabled people, by disabled people. We combine cutting-edge AI technology, assistive tools, and community support to break down barriers and create a world where disability is not a limitation.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform addresses the unique challenges faced by people with visual, hearing, mobility, and cognitive disabilities, providing personalized solutions that enhance independence, foster community connection, and ensure equal access to information and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

 
      {/* Enhanced Chat Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center space-x-3 z-50" aria-label="Open accessibility chat">
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold text-lg">Need Help?</span>
      </button>
      <Footer/>
    </div>
    
  );
};

export default IncluVerseLanding;