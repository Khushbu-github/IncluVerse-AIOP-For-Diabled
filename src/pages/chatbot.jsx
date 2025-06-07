// Updated chatbot.jsx (styled like grievance.jsx)
import React, { useState, useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  Mic, MicOff, Send, MessageSquare, Globe, Volume2, Loader2, StopCircle
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
  const speechSynthesisRef = useRef(null);

  const languageMap = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
    "ta-IN": "Tamil"
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) setTimeout(loadVoices, 100);
      else setAvailableVoices(voices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => window.speechSynthesis.onvoiceschanged = null;
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const transliterateToPhonetic = async (text) => {
    if (!text || !text.trim()) return text;
  
    // Check if text contains non-English characters
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  
    if (!hasHindi && !hasKannada && !hasTamil) {
      return text; // Already English or no transliteration needed
    }
  
    try {
      setTransliterating(true);
  
      const chat = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_GROQ_API_KEY,
        modelName: "llama3-70b-8192",
        configuration: {
          baseURL: "https://api.groq.com/openai/v1"
        },
        temperature: 0.2
      });
  
      const transliterationPrompt = `Convert the following text to phonetic English (romanized form) so it can be pronounced correctly by an English text-to-speech system. Keep English words as they are, and convert only the non-English scripts to their phonetic English equivalents.
  
  Examples:
  - नमस्ते → Namaste
  - ನಮಸ್ತೆ → Namaste  
  - வணக்கம் → Vanakkam
  - धन्यवाद → Dhanyawad
  - ಧನ್ಯವಾದ → Dhanyavada
  
  Text to convert: ${text}
  
  Only provide the phonetic English version:`;
  
      const response = await chat.invoke([
        new SystemMessage("You are an expert in transliterating Indian languages to phonetic English. Convert the given text to readable English phonetics while preserving meaning and pronunciation."),
        new HumanMessage(transliterationPrompt)
      ]);
  
      const phoneticText = response.content.trim();
      console.log(`Original: ${text}`);
      console.log(`Phonetic: ${phoneticText}`);
      return phoneticText;
  
    } catch (error) {
      console.error("Transliteration error:", error);
      return text; // Return original text if transliteration fails
    } finally {
      setTransliterating(false);
    }
  };
  
  const getLanguageFromText = (text) => {
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  
    // Return the first detected language (you can modify priority as needed)
    if (hasHindi) return 'hi-IN';
    if (hasKannada) return 'kn-IN';
    if (hasTamil) return 'ta-IN';
    return 'en-IN'; // Default to English
  };
  
  const hasVoiceSupport = (language) => {
    // Check if any available voice supports the detected language
    return availableVoices.some(voice => 
      voice.lang === language || 
      voice.lang.startsWith(language.split('-')[0])
    );
  };
  
  const startSpeaking = async (text) => {
    if (!text || speaking) return;
  
    try {
      // Detect the language of the text
      const detectedLanguage = getLanguageFromText(text);
      
      let finalText = text;
      let targetLanguage = detectedLanguage;
      let shouldUseNativeVoice = true;
  
      // Check if we have voice support for the detected language
      if (detectedLanguage !== 'en-IN' && !hasVoiceSupport(detectedLanguage)) {
        console.log(`No native voice support found for ${detectedLanguage}, transliterating to phonetic English`);
        // Convert to phonetic English only if no native voice is available
        finalText = await transliterateToPhonetic(text);
        targetLanguage = 'en-IN';
        shouldUseNativeVoice = false;
      } else if (detectedLanguage !== 'en-IN') {
        console.log(`Native voice support found for ${detectedLanguage}, using original text`);
      }
  
      stopSpeaking();
  
      const utterance = new SpeechSynthesisUtterance(finalText);
  
      // Find the best voice for the target language
      let voice;
      if (shouldUseNativeVoice && detectedLanguage !== 'en-IN') {
        // Try to find native voice for the detected language
        voice = availableVoices.find(v => v.lang === detectedLanguage) ||
                availableVoices.find(v => v.lang.startsWith(detectedLanguage.split('-')[0]));
      }
      
      // Fallback to English voice (for transliterated text or if no native voice found)
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
      
      // Adjust speech rate based on whether text was transliterated
      utterance.rate = shouldUseNativeVoice ? 1.0 : 0.8; // Slower for transliterated text
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
      const chat = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_GROQ_API_KEY,
        modelName: "llama3-70b-8192",
        configuration: { baseURL: "https://api.groq.com/openai/v1" },
        temperature: 0.7
      });

      const response = await chat.invoke([
        new SystemMessage(`Respond in ${languageMap[selectedLang]}.`),
        new HumanMessage(input)
      ]);

      const updatedMessages = [...newMessages, { role: "assistant", content: response.content }];
      setMessages(updatedMessages);
      startSpeaking(response.content);
    } catch (err) {
      console.error("Chat error:", err);
    }

    setInput("");
    setLoading(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

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
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-10" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-3xl relative">
  
        {/* Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl" />
  
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            <Globe className="w-4 h-4 mr-2" />
            Inclusive Communication
          </div>
          <h1 className="text-3xl font-bold text-gray-900">IncluVerse Chatbot</h1>
        </div>
  
        {/* Language Select */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Globe className="w-5 h-5 text-gray-500" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base focus:ring-4 focus:ring-blue-300"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="kn-IN">Kannada</option>
            <option value="ta-IN">Tamil</option>
          </select>
        </div>
  
        {/* Chat Area */}
        <div className="border border-gray-200 bg-gray-50 rounded-2xl h-64 overflow-y-auto p-4 text-sm text-gray-700 mb-6">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-24">Start chatting with the bot...</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-xl ${msg.role === "user" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* Input Section */}
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4 inline mr-1" />} Send
          </button>
        </div>
  
        {/* Voice Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleVoiceInput}
            disabled={recognizing || loading}
            className={`px-6 py-3 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
              recognizing ? "bg-purple-500 text-white animate-pulse" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {recognizing ? (
              <><MicOff className="w-4 h-4 inline mr-2" /> Listening...</>
            ) : (
              <><Mic className="w-4 h-4 inline mr-2" /> Start Voice</>
            )}
          </button>
  
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="px-6 py-3 text-sm font-medium bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
            >
              <StopCircle className="w-4 h-4 inline mr-2" /> Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Chatbot;
