import React, { useState } from 'react';
import { Menu, X, MessageCircle, Users, Laptop, Accessibility, ChevronDown, Eye, Ear, HandHeart, FileText, MapPin, Mic, Bot, AlertCircle, Camera, Volume2, Heart, Shield, Globe, Zap, Star, Award } from 'lucide-react';

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
            <li><a href="/home
            " className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
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

const IncluVerseAbout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
  const pages = [
    'img_analyzer',
    'grievance',
    'busbuddybol',
    'signlang',
    'voicefeed',
    'chatbot',
    'emergency'
  ];

  const features = [
    {
      id: 'pdf-analyzer',
      icon: FileText,
      title: 'PDFs/Images Analyzer',
      subtitle: 'Advanced Document Processing',
      description: 'Our AI-powered document analyzer transforms inaccessible content into accessible formats. Using cutting-edge OCR and natural language processing, it converts PDFs, images, and documents into audio descriptions, structured text, and Braille-ready formats.',
      capabilities: [
        'OCR text extraction from images and scanned documents',
        'Text-to-speech conversion with natural voice synthesis',
        'Document structure analysis and navigation aids',
        'Multi-language support for global accessibility',
        'Braille formatting and conversion',
        'Mathematical equation recognition and audio description'
      ],
      beneficiaries: 'Visually impaired users, dyslexic individuals, and those with reading difficulties'
    },
    {
      id: 'grievance',
      icon: Shield,
      title: 'Grievance Handler',
      subtitle: 'Advocacy & Rights Protection',
      description: 'A comprehensive system for reporting, tracking, and resolving accessibility issues and discrimination cases. Our platform ensures that disabled individuals have a voice and can seek justice for rights violations.',
      capabilities: [
        'Anonymous and secure grievance filing system',
        'Case tracking with real-time status updates',
        'Legal resource connections and advocacy support',
        'Community solidarity and peer support networks',
        'Integration with disability rights organizations',
        'Evidence collection and documentation tools'
      ],
      beneficiaries: 'All disabled individuals facing discrimination or accessibility barriers'
    },
    {
      id: 'bus-buddy',
      icon: MapPin,
      title: 'Bus Buddy Bol',
      subtitle: 'Smart Transportation Assistant',
      description: 'Revolutionary public transportation companion that provides real-time navigation, accessibility information, and safety features tailored for disabled travelers.',
      capabilities: [
        'Real-time bus tracking with accessibility status',
        'Audio announcements for stops and route changes',
        'Wheelchair accessibility information for each vehicle',
        'Emergency assistance integration',
        'Route planning with accessibility considerations',
        'Community-sourced accessibility ratings and reviews'
      ],
      beneficiaries: 'Mobility-impaired users, visually impaired travelers, and all disabled commuters'
    },
    {
      id: 'sign-language',
      icon: HandHeart,
      title: 'Sign Language Translator',
      subtitle: 'Breaking Communication Barriers',
      description: 'State-of-the-art AI system that provides real-time translation between sign language and spoken/written language, enabling seamless communication for the deaf and hard-of-hearing community.',
      capabilities: [
        'Real-time sign language to text/speech conversion',
        'Text/speech to sign language avatar translation',
        'Support for multiple sign language dialects (ASL, BSL, ISL)',
        'Video call integration for remote communication',
        'Educational modules for learning sign language',
        'Cultural context and expression recognition'
      ],
      beneficiaries: 'Deaf and hard-of-hearing individuals, their families, and communication partners'
    },
    {
      id: 'voice-feedback',
      icon: Mic,
      title: 'Voice Feedback System',
      subtitle: 'Intelligent Voice Interface',
      description: 'Advanced voice recognition and response system that allows users to navigate, control, and interact with digital content through natural speech commands and receives comprehensive audio feedback.',
      capabilities: [
        'Natural language processing for complex commands',
        'Personalized voice profiles and preferences',
        'Context-aware responses and suggestions',
        'Multi-modal interaction (voice + gesture + touch)',
        'Emotion recognition and empathetic responses',
        'Integration with smart home and IoT devices'
      ],
      beneficiaries: 'Visually impaired users, individuals with motor disabilities, and speech therapy patients'
    },
    {
      id: 'ai-chatbot',
      icon: Bot,
      title: 'AI-Powered Chatbot',
      subtitle: '24/7 Intelligent Support',
      description: 'Sophisticated AI companion trained specifically on disability-related topics, providing personalized assistance, emotional support, and practical guidance around the clock.',
      capabilities: [
        'Disability-specific knowledge base and expertise',
        'Emotional intelligence and crisis intervention',
        'Personalized recommendations and adaptive learning',
        'Multi-language support and cultural sensitivity',
        'Integration with healthcare and support services',
        'Privacy-first design with secure data handling'
      ],
      beneficiaries: 'All disabled individuals seeking information, support, and companionship'
    },
    {
      id: 'emergency',
      icon: AlertCircle,
      title: 'Emergency Response',
      subtitle: 'Critical Safety Network',
      description: 'Comprehensive emergency system designed specifically for disabled individuals, providing rapid response, location services, and specialized assistance during critical situations.',
      capabilities: [
        'One-touch emergency activation with location sharing',
        'Specialized emergency responder training integration',
        'Medical information and disability profile sharing',
        'Family and caregiver automatic notification',
        'Integration with local emergency services',
        'Predictive risk assessment and prevention alerts'
      ],
      beneficiaries: 'All disabled individuals, especially those living independently or in vulnerable situations'
    }
  ];

  const stats = [
    { number: '50M+', label: 'Disabled People Served', icon: Users },
    { number: '150+', label: 'Countries Supported', icon: Globe },
    { number: '99.9%', label: 'Uptime Reliability', icon: Zap },
    { number: '4.9/5', label: 'User Satisfaction', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header className="backdrop-blur-md bg-white/95 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center min-w-0">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                IncluVerse
              </div>
              <div className="hidden lg:block ml-4 h-6 w-px bg-gray-300"></div>
              <div className="hidden lg:block ml-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                All-in-One Platform for Disabled People
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg">Home</a>
              <a href="#" className="text-blue-600 font-semibold text-base lg:text-lg">About</a>
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

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 backdrop-blur-lg bg-white/95 shadow-2xl z-50 border-t border-gray-200/50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Our Accessibility Solutions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={`/${pages[index]}`}
                    className="block px-4 lg:px-6 py-3 lg:py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-medium border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md text-sm lg:text-base"
                  >
                    {item}
                  </a>
                ))}
              </div>
              
              <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-medium">Home</a>
                  <a href="#" className="block px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-semibold">About</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

     
      {/* Mission Statement */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-8">
              Our Mission
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-xl">
                <Heart className="h-16 w-16 text-red-500 mb-6" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Built by the Community, for the Community
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  IncluVerse was founded and developed by disabled individuals who understand firsthand the challenges and barriers faced daily. Our lived experiences drive every decision, feature, and innovation.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Inclusive Design First</h4>
                  <p className="text-gray-600">Every feature is designed with accessibility as the foundation, not an afterthought.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Community-Driven Development</h4>
                  <p className="text-gray-600">Our roadmap is shaped by community feedback and real-world needs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellence in Accessibility</h4>
                  <p className="text-gray-600">We exceed international accessibility standards and continuously innovate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that represent real lives transformed and barriers broken down
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-20">
            <div className="mb-4 lg:mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
                Platform Features
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              Comprehensive Accessibility Solutions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each feature is meticulously designed to address specific challenges faced by disabled individuals, backed by cutting-edge AI and community insights.
            </p>
          </div>

          <div className="space-y-16 lg:space-y-24">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={feature.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}>
                  <div className="w-full lg:w-1/2">
                    <div className={`bg-gradient-to-br ${
                      index % 4 === 0 ? 'from-blue-100 to-purple-100' :
                      index % 4 === 1 ? 'from-green-100 to-blue-100' :
                      index % 4 === 2 ? 'from-purple-100 to-pink-100' :
                      'from-orange-100 to-red-100'
                    } rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-xl`}>
                      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 text-center">
                        <IconComponent className={`h-16 w-16 lg:h-20 lg:w-20 mx-auto mb-4 ${
                          index % 4 === 0 ? 'text-blue-600' :
                          index % 4 === 1 ? 'text-green-600' :
                          index % 4 === 2 ? 'text-purple-600' :
                          'text-red-600'
                        }`} />
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{feature.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-2">
                        {feature.subtitle}
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Capabilities:</h4>
                      <ul className="space-y-3">
                        {feature.capabilities.map((capability, capIndex) => (
                          <li key={capIndex} className="flex items-start space-x-3">
                            <div className="bg-green-100 rounded-full p-1 flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-gray-600 text-sm lg:text-base">{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">Primary Beneficiaries:</h4>
                      <p className="text-gray-600 text-sm lg:text-base">{feature.beneficiaries}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
              Cutting-Edge Technology
            </h2>
            <p className="text-lg lg:text-xl opacity-90 max-w-3xl mx-auto">
              Powered by advanced AI, machine learning, and user-centered design principles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
              <Bot className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Advanced AI Integration</h3>
              <p className="text-white/80">Machine learning algorithms trained specifically on accessibility data and user interactions.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
              <Shield className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Privacy-First Design</h3>
              <p className="text-white/80">End-to-end encryption and local processing ensure your personal data remains secure and private.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 md:col-span-2 lg:col-span-1">
              <Globe className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Global Accessibility</h3>
              <p className="text-white/80">Multi-language support and cultural sensitivity built into every feature and interaction.</p>
            </div>
          </div>
        </div>
      </section>

    

      {/* Chat Button */}
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

export default IncluVerseAbout;