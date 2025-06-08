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
  const [splineLoaded, setSplineLoaded] = useState(false);
  const speechSynthesisRef = useRef(null);
  const iframeRef = useRef(null);

  const languageMap = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
    "ta-IN": "Tamil"
  };

  // Translations for UI elements
  const translations = {
    "en-IN": {
      title: "IncluVerse Chatbot",
      subtitle: "Inclusive Communication",
      placeholder: "Type your message... (e.g., 'pdf analyzer', 'bus route')",
      startChat: "Start chatting with your AI assistant...",
      tryExamples: "Try: \"PDF analyzer\", \"bus route\", \"emergency help\", or \"report issue\"",
      voiceInput: "Voice Input",
      listening: "Listening...",
      stop: "Stop",
      loading3d: "Loading 3D Assistant...",
      quickActions: {
        analyzePdf: "Analyze PDF",
        reportIssue: "Report Issue", 
        findBus: "Find Bus Route",
        emergency: "Emergency Help"
      },
      quickPrompts: {
        analyzePdf: "I want to analyze a PDF document",
        reportIssue: "I need to file a grievance",
        findBus: "Help me find accessible bus routes",
        emergency: "I need emergency assistance"
      }
    },
    "hi-IN": {
      title: "इंक्लूवर्स चैटबॉट",
      subtitle: "समावेशी संचार",
      placeholder: "अपना संदेश टाइप करें... (जैसे 'पीडीएफ विश्लेषक', 'बस मार्ग')",
      startChat: "अपने एआई सहायक के साथ चैट करना शुरू करें...",
      tryExamples: "कोशिश करें: \"पीडीएफ विश्लेषक\", \"बस मार्ग\", \"आपातकालीन सहायता\", या \"समस्या रिपोर्ट\"",
      voiceInput: "आवाज़ इनपुट",
      listening: "सुन रहा है...",
      stop: "रोकें",
      loading3d: "3D सहायक लोड हो रहा है...",
      quickActions: {
        analyzePdf: "पीडीएफ विश्लेषण",
        reportIssue: "समस्या रिपोर्ट",
        findBus: "बस मार्ग खोजें",
        emergency: "आपातकालीन सहायता"
      },
      quickPrompts: {
        analyzePdf: "मैं एक पीडीएफ दस्तावेज़ का विश्लेषण करना चाहता हूं",
        reportIssue: "मुझे शिकायत दर्ज करनी है",
        findBus: "सुलभ बस मार्ग खोजने में मेरी सहायता करें",
        emergency: "मुझे आपातकालीन सहायता चाहिए"
      }
    },
    "kn-IN": {
      title: "ಇಂಕ್ಲೂವರ್ಸ್ ಚಾಟ್‌ಬಾಟ್",
      subtitle: "ಸಮಾವೇಶಕ ಸಂವಹನ",
      placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ... (ಉದಾ. 'ಪಿಡಿಎಫ್ ವಿಶ್ಲೇಷಕ', 'ಬಸ್ ಮಾರ್ಗ')",
      startChat: "ನಿಮ್ಮ AI ಸಹಾಯಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ...",
      tryExamples: "ಪ್ರಯತ್ನಿಸಿ: \"ಪಿಡಿಎಫ್ ವಿಶ್ಲೇಷಕ\", \"ಬಸ್ ಮಾರ್ಗ\", \"ತುರ್ತು ಸಹಾಯ\", ಅಥವಾ \"ಸಮಸ್ಯೆ ವರದಿ\"",
      voiceInput: "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
      listening: "ಕೇಳುತ್ತಿದೆ...",
      stop: "ನಿಲ್ಲಿಸಿ",
      loading3d: "3D ಸಹಾಯಕ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      quickActions: {
        analyzePdf: "ಪಿಡಿಎಫ್ ವಿಶ್ಲೇಷಣೆ",
        reportIssue: "ಸಮಸ್ಯೆ ವರದಿ",
        findBus: "ಬಸ್ ಮಾರ್ಗ ಹುಡುಕಿ",
        emergency: "ತುರ್ತು ಸಹಾಯ"
      },
      quickPrompts: {
        analyzePdf: "ನಾನು ಪಿಡಿಎಫ್ ದಾಖಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಬಯಸುತ್ತೇನೆ",
        reportIssue: "ನನಗೆ ದೂರು ದಾಖಲಿಸಬೇಕು",
        findBus: "ಪ್ರವೇಶಿಸಬಹುದಾದ ಬಸ್ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಲು ನನಗೆ ಸಹಾಯ ಮಾಡಿ",
        emergency: "ನನಗೆ ತುರ್ತು ಸಹಾಯ ಬೇಕು"
      }
    },
    "ta-IN": {
      title: "இன்க்ளூவர்ஸ் சாட்பாட்",
      subtitle: "உள்ளடக்கிய தொடர்பு",
      placeholder: "உங்கள் செய்தியை டைப் செய்யுங்கள்... (எ.கா. 'பிடிஎஃப் பகுப்பாய்வி', 'பேருந்து வழி')",
      startChat: "உங்கள் AI உதவியாளருடன் அரட்டையைத் தொடங்குங்கள்...",
      tryExamples: "முயற்சி செய்யுங்கள்: \"பிடிஎஃப் பகுப்பாய்வி\", \"பேருந்து வழி\", \"அவசர உதவி\", அல்லது \"பிரச்சினை அறிக்கை\"",
      voiceInput: "குரல் உள்ளீடு",
      listening: "கேட்டுக்கொண்டிருக்கிறது...",
      stop: "நிறுத்து",
      loading3d: "3D உதவியாளர் ஏற்றப்படுகிறது...",
      quickActions: {
        analyzePdf: "பிடிஎஃப் பகுப்பாய்வு",
        reportIssue: "பிரச்சினை அறிக்கை",
        findBus: "பேருந்து வழி கண்டறிய",
        emergency: "அவசர உதவி"
      },
      quickPrompts: {
        analyzePdf: "நான் ஒரு பிடிஎஃப் ஆவணத்தை பகுப்பாய்வு செய்ய விரும்புகிறேன்",
        reportIssue: "நான் ஒரு புகாரை பதிவு செய்ய வேண்டும்",
        findBus: "அணுகக்கூடிய பேருந்து வழிகளைக் கண்டறிய எனக்கு உதவுங்கள்",
        emergency: "எனக்கு அவசர உதவி தேவை"
      }
    }
  };

  // Get current language translations
  const t = translations[selectedLang];

  // Enhanced route mapping with multilingual variations
  const routeMap = {
    "pdf": {
      path: "/img_analyzer",
      variations: {
        "en-IN": ["pdf", "pdfs", "image", "analyzer", "analyse", "analyze", "document", "scan", "read", "text", "extract"],
        "hi-IN": ["पीडीएफ", "पीडीएफस", "छवि", "विश्लेषक", "विश्लेषण", "दस्तावेज़", "स्कैन", "पढ़ना", "पाठ", "निकालना"],
        "kn-IN": ["ಪಿಡಿಎಫ್", "ಚಿತ್ರ", "ವಿಶ್ಲೇಷಕ", "ವಿಶ್ಲೇಷಣೆ", "ದಾಖಲೆ", "ಸ್ಕ್ಯಾನ್", "ಓದು", "ಪಠ್ಯ"],
        "ta-IN": ["பிடிஎஃப்", "படம்", "பகுப்பாய்வி", "பகுப்பாய்வு", "ஆவணம்", "ஸ்கேன்", "படி", "உரை"]
      }
    },
    "grievance": {
      path: "/greviance",
      variations: {
        "en-IN": ["grievance", "greviance", "complaint", "issue", "problem", "report", "feedback", "concern", "help"],
        "hi-IN": ["शिकायत", "समस्या", "मुद्दा", "रिपोर्ट", "फीडबैक", "चिंता", "सहायता", "दूरू"],
        "kn-IN": ["ದೂರು", "ಸಮಸ್ಯೆ", "ವರದಿ", "ಪ್ರತಿಕ್ರಿಯೆ", "ಕಾಳಜಿ", "ಸಹಾಯ"],
        "ta-IN": ["புகார்", "பிரச்சினை", "அறிக்கை", "கருத்து", "கவலை", "உதவி"]
      }
    },
    "bus": {
      path: "/busbuddybol",
      variations: {
        "en-IN": ["bus", "buddy", "bol", "transport", "travel", "navigation", "route", "public transport"],
        "hi-IN": ["बस", "परिवहन", "यात्रा", "नेवगेशन", "मार्ग", "सार्वजनिक परिवहन"],
        "kn-IN": ["ಬಸ್", "ಸಾರಿಗೆ", "ಪ್ರಯಾಣ", "ಮಾರ್ಗ", "ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ"],
        "ta-IN": ["பேருந்து", "போக்குவரத்து", "பயணம், வழி", "பொது போக்குவரத்து"]
      }
    },
    "emergency": {
      path: "/emergency",
      variations: {
        "en-IN": ["emergency", "emergancy", "urgent", "help", "sos", "crisis", "danger", "medical", "safety"],
        "hi-IN": ["आपातकाल", "तुरंत", "सहायता", "संकट", "खतरा", "चिकित्सा", "सुरक्षा"],
        "kn-IN": ["ತುರ್ತು", "ಸಹಾಯ", "ಬಿಕ್ಕಟ್ಟು", "ಅಪಾಯ", "ವೈದ್ಯಕೀಯ", "ಸುರಕ್ಷತೆ"],
        "ta-IN": ["அவசரம்", "உதவி", "நெருக்கடி", "ஆபத்து", "மருத்துவ", "பாதுகாப்பு"]
      }
    }
  };

  // Levenshtein distance function for fuzzy matching
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Smart matching function with multilingual support
  const findBestMatch = (input) => {
    const inputLower = input.toLowerCase();
    let bestMatch = null;
    let bestScore = Infinity;
    let directMatch = null;

    // Check for direct matches first in current language and English
    for (const [key, route] of Object.entries(routeMap)) {
      const currentLangVariations = route.variations[selectedLang] || [];
      const englishVariations = route.variations["en-IN"] || [];
      const allVariations = [...currentLangVariations, ...englishVariations];
      
      for (const variation of allVariations) {
        if (inputLower.includes(variation.toLowerCase())) {
          directMatch = { key, route, matchedWord: variation };
          break;
        }
      }
      if (directMatch) break;
    }

    if (directMatch) return directMatch;

    // If no direct match, use fuzzy matching
    const words = inputLower.split(/\s+/);
    
    for (const word of words) {
      if (word.length < 2) continue;
      
      for (const [key, route] of Object.entries(routeMap)) {
        const currentLangVariations = route.variations[selectedLang] || [];
        const englishVariations = route.variations["en-IN"] || [];
        const allVariations = [...currentLangVariations, ...englishVariations];
        
        for (const variation of allVariations) {
          const distance = levenshteinDistance(word, variation.toLowerCase());
          const threshold = Math.max(1, Math.floor(variation.length * 0.4));
          
          if (distance <= threshold && distance < bestScore) {
            bestScore = distance;
            bestMatch = { key, route, matchedWord: variation, distance };
          }
        }
      }
    }

    return bestMatch;
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
  
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  
    if (!hasHindi && !hasKannada && !hasTamil) {
      return text;
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
    if (!text || speaking) return;
  
    try {
      const detectedLanguage = getLanguageFromText(text);
      
      let finalText = text;
      let targetLanguage = detectedLanguage;
      let shouldUseNativeVoice = true;
  
      if (detectedLanguage !== 'en-IN' && !hasVoiceSupport(detectedLanguage)) {
        console.log(`No native voice support found for ${detectedLanguage}, transliterating to phonetic English`);
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
      // Check for smart matching
      const matchResult = findBestMatch(input);
      let assistantReply = "";
      
      if (matchResult) {
        // Get response in selected language
        const redirectMessages = {
          "en-IN": `I found that you're looking for "${matchResult.key}" services. Redirecting you to the ${matchResult.key} page in 3 seconds...`,
          "hi-IN": `मुझे लगता है कि आप "${matchResult.key}" सेवाओं की तलाश में हैं। 3 सेकंड में आपको ${matchResult.key} पेज पर भेज रहा हूं...`,
          "kn-IN": `ನೀವು "${matchResult.key}" ಸೇವೆಗಳನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಕಂಡುಕೊಂಡಿದ್ದೇನೆ. 3 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ${matchResult.key} ಪುಟಕ್ಕೆ ಮರುನಿರ್ದೇಶಿಸುತ್ತಿದ್ದೇನೆ...`,
          "ta-IN": `நீங்கள் "${matchResult.key}" சேவைகளைத் தேடுகிறீர்கள் என்று நான் கண்டறிந்தேன். 3 வினாடிகளில் உங்களை ${matchResult.key} பக்கத்திற்கு அனுப்புகிறேன்...`
        };
        
        assistantReply = redirectMessages[selectedLang] || redirectMessages["en-IN"];
        
        // Set redirect timer
        setTimeout(() => {
          window.location.href = matchResult.route.path;
        }, 3000);
      } else {
        // Use AI for general responses
        const chat = new ChatOpenAI({
          openAIApiKey: import.meta.env.VITE_GROQ_API_KEY,
          modelName: "llama3-70b-8192",
          configuration: { baseURL: "https://api.groq.com/openai/v1" },
          temperature: 0.7
        });

        const systemPrompts = {
          "en-IN": `You are IncluVerse's support chatbot.

Only answer questions in these categories:
1. About the website: IncluVerse is an all-in-one platform designed to serve the disabled.
2. Features of the IncluVerse website:
   - PDFs/Image Analyzer: Upload and analyze documents for accessibility
   - Grievance Handler: Report accessibility issues and complaints
   - Bus Buddy Bol: Find accessible transportation routes
   - Emergency Support: Get immediate help and emergency contacts
3. General accessibility and disability-related questions.

If the user asks anything beyond these categories, respond with:
"I'm here to assist with IncluVerse features and accessibility-related topics. Please ask something relevant."

Always reply in English.`,
          "hi-IN": `आप IncluVerse के सपोर्ट चैटबॉट हैं।

केवल इन श्रेणियों में प्रश्नों का उत्तर दें:
1. वेबसाइट के बारे में: IncluVerse विकलांग लोगों की सेवा के लिए डिज़ाइन किया गया एक ऑल-इन-वन प्लेटफॉर्म है।
2. IncluVerse वेबसाइट की विशेषताएं:
   - PDFs/Image Analyzer: पहुंच के लिए दस्तावेज़ अपलोड और विश्लेषण करें
   - Grievance Handler: पहुंच की समस्याओं और शिकायतों की रिपोर्ट करें
   - Bus Buddy Bol: सुलभ परिवहन मार्ग खोजें
   - Emergency Support: तत्काल सहायता और आपातकालीन संपर्क प्राप्त करें
3. सामान्य पहुंच और विकलांगता संबंधी प्रश्न।

यदि उपयोगकर्ता इन श्रेणियों से परे कुछ भी पूछता है, तो उत्तर दें:
"मैं IncluVerse सुविधाओं और पहुंच संबंधी विषयों में सहायता के लिए यहां हूं। कृपया कुछ प्रासंगिक पूछें।"

हमेशा हिंदी में उत्तर दें।`,
          "kn-IN": `ನೀವು IncluVerse ನ ಬೆಂಬಲ ಚಾಟ್‌ಬಾಟ್ ಆಗಿದ್ದೀರಿ।

ಈ ವರ್ಗಗಳಲ್ಲಿ ಮಾತ್ರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ:
1. ವೆಬ್‌ಸೈಟ್ ಬಗ್ಗೆ: IncluVerse ವಿಕಲಾಂಗರ ಸೇವೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಆಲ್-ಇನ್-ವನ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಗಿದೆ।
2. IncluVerse ವೆಬ್‌ಸೈಟ್‌ನ ವೈಶಿಷ್ಟ್ಯಗಳು:
   - PDFs/Image Analyzer: ಪ್ರವೇಶಕ್ಕಾಗಿ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ
   - Grievance Handler: ಪ್ರವೇಶ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ದೂರುಗಳನ್ನು ವರದಿ ಮಾಡಿ
   - Bus Buddy Bol: ಪ್ರವೇಶಿಸಬಹುದಾದ ಸಾರಿಗೆ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ
   - Emergency Support: ತಕ್ಷಣದ ಸಹಾಯ ಮತ್ತು ತುರ್ತು ಸಂಪರ್ಕಗಳನ್ನು ಪಡೆಯಿರಿ
3. ಸಾಮಾನ್ಯ ಪ್ರವೇಶ ಮತ್ತು ಅಂಗವೈಕಲ್ಯ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳು।

ಬಳಕೆದಾರರು ಈ ವರ್ಗಗಳನ್ನು ಮೀರಿ ಏನನ್ನಾದರೂ ಕೇಳಿದರೆ, ಪ್ರತಿಕ್ರಿಯಿಸಿ:
"ನಾನು IncluVerse ವೈಶಿಷ್ಟ್ಯಗಳು ಮತ್ತು ಪ್ರವೇಶ-ಸಂಬಂಧಿತ ವಿಷಯಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸಂಬಂಧಿತವಾದದ್ದನ್ನು ಕೇಳಿ।"

ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ।`,
          "ta-IN": `நீங்கள் IncluVerse இன் ஆதரவு சாட்பாட் ஆவீர்கள்।

இந்த வகைகளில் மட்டுமே கேள்விகளுக்கு பதிலளிக்கவும்:
1. வலைத்தளத்தைப் பற்றி: IncluVerse மாற்றுத்திறனாளிகளுக்கு சேவை செய்ய வடிவமைக்கப்பட்ட ஆல்-இன்-ஒன் பிளாட்ஃபார்ம் ஆகும்.
2. IncluVerse வலைத்தளத்தின் அம்சங்கள்:
   - PDFs/Image Analyzer: அணுகலுக்காக ஆவணங்களை பதிவேற்றி பகுப்பாய்வு செய்யுங்கள்
   - Grievance Handler: அணுகல் சிக்கல்கள் மற்றும் புகார்களை அறிக்கை செய்யுங்கள்
   - Bus Buddy Bol: அணுகக்கூடிய போக்குவரத்து வழிகளைக் கண்டறியுங்கள்
   - Emergency Support: உடனடி உதவி மற்றும் அவசர தொடர்புகளைப் பெறுங்கள்
3. பொதுவான அணுகல் மற்றும் மாற்றுத்திறன் தொடர்பான கேள்விகள்।

பயனர் இந்த வகைகளுக்கு அப்பால் எதையும் கேட்டால், பதிலளிக்கவும்:
"நான் IncluVerse அம்சங்கள் மற்றும் அணுகல் தொடர்பான தலைப்புகளில் உதவ இங்கே இருக்கிறேன். தயவுசெய்து பொருத்தமான ஒன்றைக் கேளுங்கள்."

எப்போதும் தமிழில் பதிலளிக்கவும்।`
        };
  
        const response = await chat.invoke([
          new SystemMessage(systemPrompts[selectedLang] || systemPrompts["en-IN"]),
          new HumanMessage(input)
        ]);
  
        assistantReply = response.content;
      }
  
      const updatedMessages = [...newMessages, { role: "assistant", content: assistantReply }];
      setMessages(updatedMessages);
      startSpeaking(assistantReply);
  
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessages = {
        "en-IN": "Sorry, I encountered an error. Please try again.",
        "hi-IN": "खुशी, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
        "kn-IN": "ಕ್ಷಮಿಸಿ, ನಾನು ದೋಷವನ್ನು ಎದುರಿಸಿದೆ। ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।",
        "ta-IN": "மன்னிக்கவும், நான் ஒரு பிழையை சந்தித்தேன். தயவுசெய்து மீண்டும் முயற்சிக்கவும்।"
      };
      const errorMessage = errorMessages[selectedLang] || errorMessages["en-IN"];
      const updatedMessages = [...newMessages, { role: "assistant", content: errorMessage }];
      setMessages(updatedMessages);
    }
  
    setInput("");
    setLoading(false);
  };
  
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const alertMessages = {
        "en-IN": "Speech Recognition not supported",
        "hi-IN": "स्पीच रिकग्निशन समर्थित नहीं है",
        "kn-IN": "ಸ್ಪೀಚ್ ರೆಕಗ್ನಿಷನ್ ಬೆಂಬಲಿತವಲ್ಲ",
        "ta-IN": "பேச்சு அங்கீகாரம் ஆதரிக்கப்படவில்லை"
      };
      return alert(alertMessages[selectedLang] || alertMessages["en-IN"]);
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
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  // Quick action buttons for common prompts
  const quickActions = [
    { text: t.quickActions.analyzePdf, action: () => setInput(t.quickPrompts.analyzePdf) },
    { text: t.quickActions.reportIssue, action: () => setInput(t.quickPrompts.reportIssue) },
    { text: t.quickActions.findBus, action: () => setInput(t.quickPrompts.findBus) },
    { text: t.quickActions.emergency, action: () => setInput(t.quickPrompts.emergency) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-6" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[85vh] relative overflow-hidden">
        
        {/* Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl" />
        
        {/* Main Container */}
        <div className="flex h-full">
          
          {/* Left Side - Chat */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                <Globe className="w-4 h-4 mr-2" />
                {t.subtitle}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.title}</h1>
            </div>
      
            {/* Language Select */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-gray-500" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base focus:ring-4 focus:ring-blue-300"
              >
                <option value="en-IN">English</option>
                <option value="hi-IN">हिंदी</option>
                <option value="kn-IN">ಕನ್ನಡ</option>
                <option value="ta-IN">தமிழ்</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  {action.text}
                </button>
              ))}
            </div>
      
            {/* Chat Area */}
            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-2xl overflow-y-auto p-4 text-sm text-gray-700 mb-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">{t.startChat}</p>
                    <p className="text-xs text-gray-500">{t.tryExamples}</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl whitespace-pre-line ${msg.role === "user" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
      
            {/* Input Section */}
            <div className="flex items-center gap-2 mb-4">
              <input
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
      
            {/* Voice Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={handleVoiceInput}
                disabled={recognizing || loading}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
                  recognizing ? "bg-purple-500 text-white animate-pulse" : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {recognizing ? (
                  <><MicOff className="w-4 h-4 inline mr-2" />{t.listening}</>
                ) : (
                  <><Mic className="w-4 h-4 inline mr-2" />{t.voiceInput}</>
                )}
              </button>
      
              {speaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                >
                  <StopCircle className="w-4 h-4 inline mr-2" />{t.stop}
                </button>
              )}

              {transliterating && (
                <div className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium bg-yellow-500 text-white rounded-full shadow-md">
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />Processing...
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - 3D Robot */}
          <div className="flex-1 relative bg-white rounded-r-3xl overflow-hidden">
            {!splineLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-500">{t.loading3d}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;