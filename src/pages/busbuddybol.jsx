import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MapPin, Clock, Bus, Navigation, Languages, User, ExternalLink } from 'lucide-react';

const BusBuddyBol = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [busRoutes, setBusRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  // Language configurations
  const languages = {
    en: {
      name: 'English',
      code: 'en-US',
      voice: 'en-US',
      translations: {
        title: 'Bus Buddy Bol',
        subtitle: 'Your Voice-Enabled Bus Route Assistant',
        micButton: 'Tap to speak',
        micListening: 'Listening...',
        stopListening: 'Stop listening',
        toggleVoice: 'Toggle voice output',
        languageSelect: 'Select Language',
        searchPlaceholder: 'Ask: "Which bus goes from Majestic to Jayanagar?"',
        noResults: 'No bus routes found. Try asking about popular routes in Bangalore.',
        loading: 'Finding bus routes...',
        error: 'Sorry, I could not process your request. Please try again.',
        route: 'Route',
        duration: 'Duration',
        frequency: 'Every',
        minutes: 'minutes',
        busNumber: 'Bus',
        from: 'from',
        to: 'to',
        via: 'via',
        accessibility: 'Wheelchair accessible',
        voiceInstructions: 'Use the microphone button or type your question about bus routes.',
        apiError: 'Unable to fetch bus information. Please check your connection and try again.',
        viewOnMaps: 'View Route on Maps',
        clickToNavigate: 'Click to open in Google Maps'
      }
    },
    hi: {
      name: 'हिंदी',
      code: 'hi-IN',
      voice: 'hi-IN',
      translations: {
        title: 'बस बडी बोल',
        subtitle: 'आपका आवाज़-सक्षम बस रूट सहायक',
        micButton: 'बोलने के लिए टैप करें',
        micListening: 'सुन रहा है...',
        stopListening: 'सुनना बंद करें',
        toggleVoice: 'आवाज़ आउटपुट टॉगल करें',
        languageSelect: 'भाषा चुनें',
        searchPlaceholder: 'पूछें: "मैजेस्टिक से जयनगर कौन सी बस जाती है?"',
        noResults: 'कोई बस रूट नहीं मिला। बैंगलोर के लोकप्रिय रूट के बारे में पूछें।',
        loading: 'बस रूट खोज रहे हैं...',
        error: 'माफ़ करें, मैं आपका अनुरोध प्रोसेस नहीं कर सका। कृपया फिर से कोशिश करें।',
        route: 'रूट',
        duration: 'अवधि',
        frequency: 'हर',
        minutes: 'मिनट',
        busNumber: 'बस',
        from: 'से',
        to: 'तक',
        via: 'के द्वारा',
        accessibility: 'व्हीलचेयर सुलभ',
        voiceInstructions: 'माइक्रोफोन बटन का उपयोग करें या बस रूट के बारे में अपना प्रश्न टाइप करें।',
        apiError: 'बस जानकारी प्राप्त करने में असमर्थ। कृपया अपना कनेक्शन जांचें और फिर से कोशिश करें।',
        viewOnMaps: 'मैप्स पर रूट देखें',
        clickToNavigate: 'गूगल मैप्स में खोलने के लिए क्लिक करें'
      }
    },
    kn: {
      name: 'ಕನ್ನಡ',
      code: 'kn-IN',
      voice: 'kn-IN',
      translations: {
        title: 'ಬಸ್ ಬಡ್ಡಿ ಬೋಲ್',
        subtitle: 'ನಿಮ್ಮ ಧ್ವನಿ-ಸಕ್ರಿಯ ಬಸ್ ಮಾರ್ಗ ಸಹಾಯಕ',
        micButton: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
        micListening: 'ಕೇಳುತ್ತಿದೆ...',
        stopListening: 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
        toggleVoice: 'ಧ್ವನಿ ಔಟ್‌ಪುಟ್ ಟಾಗಲ್ ಮಾಡಿ',
        languageSelect: 'ಭಾಷೆ ಆಯ್ಕೆ',
        searchPlaceholder: 'ಕೇಳಿ: "ಮೆಜೆಸ್ಟಿಕ್‌ನಿಂದ ಜಯನಗರಕ್ಕೆ ಯಾವ ಬಸ್ ಹೋಗುತ್ತದೆ?"',
        noResults: 'ಯಾವುದೇ ಬಸ್ ಮಾರ್ಗಗಳು ಸಿಗಲಿಲ್ಲ। ಬೆಂಗಳೂರಿನ ಜನಪ್ರಿಯ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ।',
        loading: 'ಬಸ್ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕುತ್ತಿದೆ...',
        error: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ। ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।',
        route: 'ಮಾರ್ಗ',
        duration: 'ಅವಧಿ',
        frequency: 'ಪ್ರತಿ',
        minutes: 'ನಿಮಿಷಗಳು',
        busNumber: 'ಬಸ್',
        from: 'ನಿಂದ',
        to: 'ಗೆ',
        via: 'ಮೂಲಕ',
        accessibility: 'ವೀಲ್‌ಚೇರ್ ಪ್ರವೇಶಿಸಬಹುದಾದ',
        voiceInstructions: 'ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಬಳಸಿ ಅಥವಾ ಬಸ್ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ।',
        apiError: 'ಬಸ್ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ। ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।',
        viewOnMaps: 'ನಕ್ಷೆಯಲ್ಲಿ ಮಾರ್ಗ ನೋಡಿ',
        clickToNavigate: 'ಗೂಗಲ್ ನಕ್ಷೆಗಳಲ್ಲಿ ತೆರೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ'
      }
    },
    ta: {
      name: 'தமிழ்',
      code: 'ta-IN',
      voice: 'ta-IN',
      translations: {
        title: 'பஸ் பட்டி போல்',
        subtitle: 'உங்கள் குரல்-இயக்கப்பட்ட பஸ் வழி உதவியாளர்',
        micButton: 'பேசுவதற்கு தட்டுங்கள்',
        micListening: 'கேட்கிறது...',
        stopListening: 'கேட்பதை நிறுத்துங்கள்',
        toggleVoice: 'குரல் வெளியீட்டை மாற்றுங்கள்',
        languageSelect: 'மொழி தேர்வு',
        searchPlaceholder: 'கேளுங்கள்: "மஜஸ்டிக்கிலிருந்து ஜெயநகருக்கு எந்த பஸ் போகிறது?"',
        noResults: 'பஸ் வழிகள் எதுவும் கிடைக்கவில்லை. பெங்களூரின் பிரபலமான வழிகளைப் பற்றி கேளுங்கள்.',
        loading: 'பஸ் வழிகளைத் தேடுகிறது...',
        error: 'மன்னிக்கவும், உங்கள் கோரிக்கையை செயல்படுத்த முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
        route: 'வழி',
        duration: 'காலம்',
        frequency: 'ஒவ்வொரு',
        minutes: 'நிமிடங்கள்',
        busNumber: 'பஸ்',
        from: 'இலிருந்து',
        to: 'க்கு',
        via: 'வழியாக',
        accessibility: 'சக்கர நாற்காலி அணுகக்கூடிய',
        voiceInstructions: 'மைக்ரோஃபோன் பொத்தானைப் பயன்படுத்தவும் அல்லது பஸ் வழிகள் பற்றிய உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்.',
        apiError: 'பஸ் தகவலைப் பெற முடியவில்லை. தயவுசெய்து உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
        viewOnMaps: 'வரைபடத்தில் வழியைப் பார்க்கவும்',
        clickToNavigate: 'கூகிள் மேப்ஸில் திறக்க கிளிக் செய்யுங்கள்'
      }
    }
  };

  const t = languages[currentLanguage].translations;

  // Function to open Google Maps with directions
  const openGoogleMaps = (route) => {
    const origin = encodeURIComponent(route.from);
    const destination = encodeURIComponent(route.to);
    const travelMode = 'transit'; // Use public transit mode
    
    // Create Google Maps URL with directions
    const mapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}/@12.9716,77.5946,11z/data=!3m1!4b1!4m2!4m1!3e3`;
    
    // Alternative URL format that specifically shows transit directions
    const transitUrl = `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&dirflg=r`;
    
    // Open in new tab/window
    window.open(transitUrl, '_blank', 'noopener,noreferrer');
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[currentLanguage].code;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processVoiceQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setError(t.error);
        setIsListening(false);
      };
    }
  }, [currentLanguage]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setError('');
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[currentLanguage].voice;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Function to call Gemini API
  const callGeminiAPI = async (query) => {
    try {
      const prompt = `You are a Bangalore bus route expert. The user is asking: "${query}"

Please provide bus route information for Bangalore (BMTC) in the following JSON format. If you don't have exact real-time data, provide realistic and helpful information based on known Bangalore bus routes:

{
  "routes": [
    {
      "number": "bus_number",
      "from": "source_location",
      "to": "destination_location", 
      "via": "intermediate_stops",
      "duration": "estimated_time",
      "frequency": number_in_minutes,
      "accessible": true/false
    }
  ]
}

Focus on major routes and popular destinations in Bangalore. If the query is unclear, provide general information about common routes. Always return valid JSON.`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return parsedData.routes || [];
      }
      
      return [];
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const processVoiceQuery = async (query) => {
    setIsLoading(true);
    setError('');
    setBusRoutes([]);
    
    try {
      const routes = await callGeminiAPI(query);
      setBusRoutes(routes);
      
      if (routes.length > 0) {
        const response = `Found ${routes.length} bus route${routes.length > 1 ? 's' : ''} for your journey.`;
        speak(response);
      } else {
        speak(t.noResults);
      }
    } catch (error) {
      setError(t.apiError);
      speak(t.apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = languages[langCode].code;
    }
  };

  const handleTextInput = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        setTranscript(query);
        processVoiceQuery(query);
        e.target.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bus className="w-10 h-10 text-blue-600" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-800">{t.title}</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">{t.subtitle}</p>
          
          {/* Language Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <label className="sr-only" htmlFor="language-select">{t.languageSelect}</label>
            <select
              id="language-select"
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              aria-label={t.languageSelect}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                voiceEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}
              aria-label={t.toggleVoice}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>
          </div>
        </header>

        {/* Voice Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-blue-800 text-lg" role="instruction">
            {t.voiceInstructions}
          </p>
        </div>

        {/* Voice Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              aria-label={isListening ? t.stopListening : t.micButton}
              aria-pressed={isListening}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <p className="mt-2 text-lg font-medium text-gray-700">
              {isListening ? t.micListening : t.micButton}
            </p>
          </div>

          {/* Text Input Alternative */}
          <div className="mt-4">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={handleTextInput}
              aria-label="Type your bus route question"
              disabled={isLoading}
            />
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-800" role="status">
                <strong>You asked:</strong> {transcript}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">{t.loading}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6" role="alert">
            <p className="text-red-800 text-lg">{error}</p>
          </div>
        )}

        {/* Bus Routes Results */}
        {busRoutes.length > 0 && (
          <div className="space-y-4" role="region" aria-label="Bus route results">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bus Routes Found
            </h2>
            
            {busRoutes.map((route, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:bg-blue-50"
                role="article"
                aria-labelledby={`route-${index}`}
                onClick={() => openGoogleMaps(route)}
                title={t.clickToNavigate}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 id={`route-${index}`} className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      {t.busNumber} {route.number}
                      <ExternalLink className="w-5 h-5 text-blue-500" aria-hidden="true" />
                    </h3>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        {route.from} {t.to} {route.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" aria-hidden="true" />
                        {t.via} {route.via}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {route.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {t.frequency} {route.frequency} {t.minutes}
                    </p>
                    {route.accessible && (
                      <div className="flex items-center gap-2 mt-2">
                        <User className="w-4 h-4 text-green-600" aria-hidden="true" />
                        <span className="text-green-600 font-medium">{t.accessibility}</span>
                      </div>
                    )}
                    <div className="mt-3 text-sm text-blue-600 font-medium">
                      {t.viewOnMaps} →
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        openGoogleMaps(route);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                      aria-label={`Open route ${route.number} in Google Maps`}
                    >
                      <MapPin className="w-4 h-4" />
                      {t.viewOnMaps}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        speak(`Bus ${route.number} goes from ${route.from} to ${route.to} via ${route.via}. Journey time is ${route.duration} and buses run every ${route.frequency} minutes.`);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                      aria-label={`Listen to details for bus ${route.number}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && busRoutes.length === 0 && transcript && !error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center" role="status">
            <p className="text-yellow-800 text-lg">{t.noResults}</p>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg" role="status" aria-live="polite">
            <Volume2 className="w-4 h-4 animate-pulse" />
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
};

export default BusBuddyBol;