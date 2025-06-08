import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Send, MessageSquare, Globe, Volume2, Loader2, StopCircle, Bot
} from "lucide-react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transliterating, setTransliterating] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-IN");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const speechSynthesisRef = useRef(null);
  const iframeRef = useRef(null);

  const languageMap = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
    "ta-IN": "Tamil"
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(loadVoices, 100);
      } else {
        setAvailableVoices(voices);
      }
    };
    
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Handle Spline iframe load
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplineLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  const transliterateToPhonetic = async (text) => {
    if (!text || !text.trim()) return text;
  
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  
    if (!hasHindi && !hasKannada && !hasTamil) {
      return text;
    }
  
    try {
      setTransliterating(true);
      
      // Simplified transliteration for demo purposes
      const phoneticMap = {
        'नमस्ते': 'Namaste',
        'धन्यवाद': 'Dhanyawad',
        'ಧನ್ಯವಾದ': 'Dhanyavada',
        'ನಮಸ್ತೆ': 'Namaste',
        'வணக்கம்': 'Vanakkam'
      };
      
      let phoneticText = text;
      Object.entries(phoneticMap).forEach(([original, phonetic]) => {
        phoneticText = phoneticText.replace(new RegExp(original, 'g'), phonetic);
      });
      
      return phoneticText;
    } catch (error) {
      console.error("Transliteration error:", error);
      return text;
    } finally {
      setTransliterating(false);
    }
  };
  
  const getLanguageFromText = (text) => {
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  
    if (hasHindi) return 'hi-IN';
    if (hasKannada) return 'kn-IN';
    if (hasTamil) return 'ta-IN';
    return 'en-IN';
  };
  
  const hasVoiceSupport = (language) => {
    return availableVoices.some(voice => 
      voice.lang === language || 
      voice.lang.startsWith(language.split('-')[0])
    );
  };
  
  const startSpeaking = async (text) => {
    if (!text || speaking || !window.speechSynthesis) return;
  
    try {
      const detectedLanguage = getLanguageFromText(text);
      
      let finalText = text;
      let targetLanguage = detectedLanguage;
      let shouldUseNativeVoice = true;
  
      if (detectedLanguage !== 'en-IN' && !hasVoiceSupport(detectedLanguage)) {
        finalText = await transliterateToPhonetic(text);
        targetLanguage = 'en-IN';
        shouldUseNativeVoice = false;
      }
  
      stopSpeaking();
  
      const utterance = new SpeechSynthesisUtterance(finalText);
  
      let voice;
      if (shouldUseNativeVoice && detectedLanguage !== 'en-IN') {
        voice = availableVoices.find(v => v.lang === detectedLanguage) ||
                availableVoices.find(v => v.lang.startsWith(detectedLanguage.split('-')[0]));
      }
      
      if (!voice) {
        voice = availableVoices.find(v => v.lang === 'en-IN') ||
                availableVoices.find(v => v.lang === 'en-US') ||
                availableVoices.find(v => v.lang.startsWith('en')) ||
                availableVoices[0];
      }
  
      if (voice) {
        utterance.voice = voice;
      }
  
      utterance.lang = targetLanguage;
      utterance.rate = shouldUseNativeVoice ? 1.0 : 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
  
      speechSynthesisRef.current = utterance;
  
      utterance.onend = () => setSpeaking(false);
      utterance.onstart = () => setSpeaking(true);
      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        setSpeaking(false);
      };
  
      window.speechSynthesis.speak(utterance);
  
    } catch (error) {
      console.error("Error in text-to-speech process:", error);
      setSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
  
    try {
      // Simulate API response for demo
      const responses = [
        "Hello! I'm here to help you with IncluVerse features. You can ask me about PDF/Image Analyzer, Grievance Handler, Bus Buddy Bol, or Emergency Support.",
        "IncluVerse is an all-in-one platform designed to serve people with disabilities. How can I assist you today?",
        "I can help you navigate our accessibility features. What would you like to know about?",
        "Our platform includes various tools to make digital content more accessible. Which feature interests you?"
      ];
      
      const assistantReply = responses[Math.floor(Math.random() * responses.length)];
      const updatedMessages = [...newMessages, { role: "assistant", content: assistantReply }];
      setMessages(updatedMessages);
      startSpeaking(assistantReply);
  
      // Auto-redirect logic
      const routeMap = {
        "pdf": "/img_analyzer",
        "image": "/img_analyzer",
        "grievance": "/greviance",
        "bus": "/busbuddybol",
        "emergency": "/emergency"
      };
  
      const lowerInput = input.toLowerCase();
      const redirectPath = Object.keys(routeMap).find(keyword =>
        lowerInput.includes(keyword)
      );
  
      if (redirectPath) {
        setTimeout(() => {
          alert(`Redirecting to ${routeMap[redirectPath]}...`);
        }, 3000);
      }
  
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = "I'm having trouble connecting right now. Please try again.";
      const updatedMessages = [...newMessages, { role: "assistant", content: errorMessage }];
      setMessages(updatedMessages);
    }
  
    setInput("");
    setLoading(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);
    recognition.onerror = (e) => {
      console.error("Voice error:", e);
      setRecognizing(false);
    };
    recognition.onresult = (e) => {
      if (e.results && e.results[0] && e.results[0][0]) {
        setInput(e.results[0][0].transcript);
      }
    };
    
    recognition.start();
  };

  return (
    <div className="min-h-screen relative bg-white" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      
      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex min-h-screen">
        
        {/* Left Side - Spline 3D Model with White Background */}
        <div className="w-3/5 relative bg-white overflow-hidden">
          {/* White Background Layer */}
          <div className="absolute inset-0 bg-white z-0"></div>
          
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white">
              <div className="text-center bg-gray-100 rounded-2xl p-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Loading 3D Assistant...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src="https://my.spline.design/superkidrobotcopy-e6hz8QI45qGSg8R2B25pVWRR/"
            frameBorder="0"
            width="100%"
            height="100%"
            className={`relative z-10 transition-opacity duration-500 ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setSplineLoaded(true)}
            title="3D Robot Assistant"
            style={{ 
              background: 'white',
              backgroundColor: 'white',
              border: 'none'
            }}
          />
          
          {/* Status Indicator for Desktop */}
          {splineLoaded && (
            <div className="absolute top-6 left-6 z-20">
              <div className="inline-flex items-center px-3 py-2 bg-white shadow-lg border border-gray-200 text-green-700 rounded-full text-xs font-medium">
                <div className={`w-2 h-2 bg-green-500 rounded-full mr-2 ${speaking ? 'animate-pulse' : ''}`}></div>
                Assistant Ready
              </div>
              
              {speaking && (
                <div className="mt-2">
                  <div className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded-full text-xs shadow-lg">
                    <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                    Speaking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      

{/* Right Side - Chat Interface */}
<div className="w-4/5 flex items-center justify-center p-8" style={{backgroundColor: '#B5EFE5'}}>
  <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative">
    {/* Your chat interface content goes here */}

            {/* Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl" />
      
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-3">
                <Globe className="w-10 h-4 mr-2" />
                Inclusive Communication
              </div>
              <h1 className="text-3xl font-bold text-gray-900">IncluVerse Chatbot</h1>
              {transliterating && (
                <div className="mt-2 text-sm text-orange-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Transliterating...
                </div>
              )}
            </div>
      
            {/* Language Select */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Globe className="w-5 h-5 text-gray-500" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-4 focus:ring-blue-300 bg-white/90 backdrop-blur-sm min-w-0"
              >
                <option value="en-IN">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="kn-IN">Kannada</option>
                <option value="ta-IN">Tamil</option>
              </select>
            </div>
      
            {/* Chat Area */}
            <div className="border border-gray-200/50 bg-gray-50/80 backdrop-blur-sm rounded-2xl h-64 overflow-y-auto p-4 text-sm text-gray-700 mb-6">
              {messages.length === 0 ? (
                <div className="text-center mt-20">
                  <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">Start chatting with the bot...</p>
                  <p className="text-xs text-gray-300 mt-2">Ask about IncluVerse features!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-sm px-4 py-2 rounded-xl shadow-sm text-sm ${
                      msg.role === "user" 
                        ? "bg-blue-500 text-white" 
                        : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200/50"
                    }`}>
                      {msg.content}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => startSpeaking(msg.content)}
                          disabled={speaking}
                          className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Volume2 className="w-3 h-3 inline" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
      
            {/* Input Section */}
            <div className="flex items-center gap-2 mb-4">
              <input
                className="flex-1 border border-gray-300/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    <Send className="w-4 h-4 inline mr-1" />
                    Send
                  </>
                )}
              </button>
            </div>
      
            {/* Voice Buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={handleVoiceInput}
                disabled={recognizing || loading}
                className={`px-6 py-3 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
                  recognizing 
                    ? "bg-purple-500 text-white animate-pulse" 
                    : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {recognizing ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-bounce"></div>
                      <MicOff className="w-4 h-4 inline mr-2" />
                      Listening...
                    </div>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 inline mr-2" />
                    Start Voice
                  </>
                )}
              </button>
      
              {speaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-6 py-3 text-sm font-medium bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all hover:shadow-lg"
                >
                  <StopCircle className="w-4 h-4 inline mr-2" />
                  Stop Speaking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Original Centered Design with White Background */}
      <div className="lg:hidden">
        {/* Full Screen Spline Background for Mobile with White Background */}
        <div className="fixed inset-0 w-full h-full bg-white overflow-hidden">
          {/* White Background Layer */}
          <div className="absolute inset-0 bg-white z-0"></div>
          
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white">
              <div className="text-center bg-gray-100 rounded-2xl p-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Loading 3D Assistant...</p>
              </div>
            </div>
          )}
          
          <iframe
            src="https://my.spline.design/superkidrobotcopy-e6hz8QI45qGSg8R2B25pVWRR/"
            frameBorder="0"
            width="100%"
            height="100%"
            className={`relative z-10 transition-opacity duration-500 ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setSplineLoaded(true)}
            title="3D Robot Assistant"
            style={{ 
              background: 'white',
              backgroundColor: 'white',
              border: 'none'
            }}
          />
          
          {/* Status Indicator for Mobile */}
          {splineLoaded && (
            <div className="absolute top-6 left-6 z-20">
              <div className="inline-flex items-center px-3 py-2 bg-white shadow-lg border border-gray-200 text-green-700 rounded-full text-xs font-medium">
                <div className={`w-2 h-2 bg-green-500 rounded-full mr-2 ${speaking ? 'animate-pulse' : ''}`}></div>
                Assistant Ready
              </div>
              
              {speaking && (
                <div className="mt-2">
                  <div className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded-full text-xs shadow-lg">
                    <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                    Speaking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Section - Floating for Mobile */}
        <div className="relative z-30 min-h-screen flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative">
            
            {/* Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl" />
      
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center px-3 py-2 bg-blue-100/80 text-blue-700 rounded-full text-xs font-medium mb-3">
                <Globe className="w-3 h-3 mr-2" />
                Inclusive Communication
              </div>
              <h1 className="text-2xl font-bold text-gray-900">IncluVerse Chatbot</h1>
              {transliterating && (
                <div className="mt-2 text-sm text-orange-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Transliterating...
                </div>
              )}
            </div>
      
            {/* Language Select */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-4 focus:ring-blue-300 bg-white/90 backdrop-blur-sm min-w-0"
              >
                <option value="en-IN">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="kn-IN">Kannada</option>
                <option value="ta-IN">Tamil</option>
              </select>
            </div>
      
            {/* Chat Area */}
            <div className="border border-gray-200/50 bg-gray-50/80 backdrop-blur-sm rounded-2xl h-48 overflow-y-auto p-3 text-sm text-gray-700 mb-4">
              {messages.length === 0 ? (
                <div className="text-center mt-12">
                  <Bot className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">Start chatting with the bot...</p>
                  <p className="text-xs text-gray-300 mt-2">Ask about IncluVerse features!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-xl shadow-sm text-xs ${
                      msg.role === "user" 
                        ? "bg-blue-500 text-white" 
                        : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200/50"
                    }`}>
                      {msg.content}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => startSpeaking(msg.content)}
                          disabled={speaking}
                          className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Volume2 className="w-3 h-3 inline" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
      
            {/* Input Section */}
            <div className="flex items-center gap-2 mb-4">
              <input
                className="flex-1 border border-gray-300/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/90 backdrop-blur-sm min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    <Send className="w-4 h-4 inline mr-1" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>
      
            {/* Voice Buttons */}
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                onClick={handleVoiceInput}
                disabled={recognizing || loading}
                className={`px-4 py-2 text-xs font-medium rounded-full shadow-md transition-all duration-300 ${
                  recognizing 
                    ? "bg-purple-500 text-white animate-pulse" 
                    : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {recognizing ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-bounce"></div>
                      <MicOff className="w-3 h-3 inline mr-1" />
                      <span className="hidden sm:inline">Listening...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3 inline mr-1" />
                    <span className="hidden sm:inline">Start Voice</span>
                    <span className="sm:hidden">Voice</span>
                  </>
                )}
              </button>
      
              {speaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 text-xs font-medium bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all hover:shadow-lg"
                >
                  <StopCircle className="w-3 h-3 inline mr-1" />
                  <span className="hidden sm:inline">Stop Speaking</span>
                  <span className="sm:hidden">Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;