import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Play,
  PauseCircle,
  Image as ImageIcon,
  FileText,
  Download,
  Settings2,
} from "lucide-react";
import Tesseract from "tesseract.js";
import * as pdfjs from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

const callGroqAPI = async (textToTranslate, targetLang) => {
  try {
    console.log('Sending to API:', { targetLang, textToTranslate });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following English text to ${targetLang}. Only return the translated text, nothing else.`
          },
          {
            role: "user",
            content: textToTranslate
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      throw new Error(`Groq API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    
    // Verify that we got a translation and not the original text
    if (translatedText === textToTranslate) {
      throw new Error('Translation failed - received original text');
    }
    
    return translatedText;
  } catch (error) {
    console.error('Groq API call failed:', error);
    throw error;
  }
};

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const ImageAnalyzer = () => {
  // CSS styles for different scripts
  const styles = {
    fontHindi: {
      fontFamily: "'Noto Sans Devanagari', sans-serif",
    },
    fontKannada: {
      fontFamily: "'Noto Sans Kannada', sans-serif",
    },
    fontTamil: {
      fontFamily: "'Noto Sans Tamil', sans-serif",
    },
    fontTelugu: {
      fontFamily: "'Noto Sans Telugu', sans-serif",
    }
  };

  const getLanguageStyle = (langCode) => {
    switch (langCode) {
      case 'hi-IN':
        return styles.fontHindi;
      case 'kn-IN':
        return styles.fontKannada;
      case 'ta-IN':
        return styles.fontTamil;
      case 'te-IN':
        return styles.fontTelugu;
      default:
        return {};
    }
  };

  const languages = {
    "en-US": {
      name: "English",
      translations: {
        title: "PDF/Image Analyzer",
        subtitle: "Empowering Independence",
        description:
          "Upload an image or PDF and experience accessible, AI-powered text extraction and reading in your preferred language.",
        uploadText: "Click or drag & drop to upload image or PDF",
        analyzeButton: "Analyze Content",
        analyzingText: "Analyzing...",
        extractedText: "Extracted Text",
        translatedText: "Translated Text",
        translationPlaceholder: "Translated text will appear here...",
        copyButton: "Copy",
        textCopied: "Text copied!",
        invalidFile: "Please upload a valid image or PDF file.",
        speakButton: "Speak",
        stopButton: "Stop",
        downloadButton: "Download",
        contrastLabel: "Contrast",
        brightnessLabel: "Brightness",
        grayscaleLabel: "Grayscale",
        imagePreview: "Image Preview",
      },
    },
    "hi-IN": {
      name: "हिंदी",
      translations: {
        title: "पीडीएफ/इमेज विश्लेषक",
        subtitle: "स्वतंत्रता को सशक्त बनाना",
        description:
          "एक छवि या पीडीएफ अपलोड करें और अपनी पसंदीदा भाषा में सुलभ, एआई-संचालित पाठ निष्कर्षण और पठन का अनुभव करें।",
        uploadText: "छवि या पीडीएफ अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें",
        analyzeButton: "विश्लेषण करें",
        analyzingText: "विश्लेषण कर रहे हैं...",
        extractedText: "निकाला गया पाठ",
        translatedText: "अनुवादित पाठ",
        translationPlaceholder: "अनुवादित पाठ यहां दिखाई देगा...",
        invalidFile: "कृपया एक वैध छवि या पीडीएफ फ़ाइल अपलोड करें।",
        speakButton: "बोलें",
        stopButton: "रुकें",
        downloadButton: "डाउनलोड करें",
        contrastLabel: "कंट्रास्ट",
        brightnessLabel: "चमक",
        grayscaleLabel: "ग्रेस्केल",
        imagePreview: "छवि पूर्वावलोकन",
      },
    },
    "kn-IN": {
      name: "ಕನ್ನಡ",
      translations: {
        title: "ಪಿಡಿಎಫ್/ಚಿತ್ರ ವಿಶ್ಲೇಷಕ",
        subtitle: "ಸ್ವಾತಂತ್ರ್ಯವನ್ನು ಸ357ಕ್ತಗೊಳಿಸುವುದು",
        description:
          "ಚಿತ್ರ ಅಥವಾ ಪಿಡಿಎಫ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಆದ752ತೆಯ ಭಾಷೆಯಲ್ಲಿ ಪ್ರವೇಶಿಸಬಹುದಾದ, AI-ಸಾಮರ್ಥ್ಯದ ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ ಮತ್ತು ಓದುವಿಕೆಯನ್ನು ಅನುಭವಿಸಿ.",
        uploadText: "ಚಿತ್ರ ಅಥವಾ ಪಿಡಿಎಫ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಎಳೆದು ಬಿಡಿ",
        analyzeButton: "ವಿಶ್ಲೇಷಿಸಿ",
        analyzingText: "ವ392ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        extractedText: "ಹೊರತೆಗೆದ ಪಠ್ಯ",
        translatedText: "ಅನುವಾದಿತ ಪಠ್ಯ",
        translationPlaceholder: "ಅನುವಾದಿತ ಪಠ್ಯವು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ...",
        invalidFile: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಚಿತ್ರ ಅಥವಾ ಪಿಡಿಎಫ್ ಫೈಲ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
        speakButton: "ಮಾತನಾಡಿ",
        stopButton: "ನಿಲ್ಲಿಸಿ",
        downloadButton: "ಡೌನ್‌ಲೋಡ್",
        contrastLabel: "ಕಾಂಟ್ರಾಸ್ಟ್",
        brightnessLabel: "ಪ್ರಕಾಶಮಾನತೆ",
        grayscaleLabel: "ಗ್ರೇಸ್ಕೇಲ್",
        imagePreview: "ಚಿತ್ರ ಪೂರ್ವವೀಕ್ಷಣೆ",
      },
    },
    "ta-IN": {
      name: "தமிழ்",
      translations: {
        title: "பிடிஎஃப்/படம் பகுப்பாய்வி",
        subtitle: "சுதந்த274த்தை மேம்படுத்துதல்",
        description:
          "படம் அல்லது பிடிஎஃப் பதிவேற்றி உங்கள் விருப்பமான மொழியில் அணுகக்கூடிய, AI-இயக்கப்பட்ட உரை பிரித்தெடுத்தல் மற்றும் வாசிப்பை அனுபவியுங்கள்.",
        upload012Text: "படம் அல்லது பிடிஎஃப் பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்",
        analyzeButton: "பகுப்பாய்வு செய்",
        analyzingText: "பகுப்பாய்வு செய்கிறது...",
        extractedText: "பிரித்தெடுக்கப்பட்ட உரை",
        translatedText: "மொழிபெயர்க்கப்பட்ட உரை",
        translationPlaceholder: "மொழிபெயர்க்கப்பட்ட உரை இங்கே தோன்றும்...",
        invalidFile: "தயவுசெய்து சரியான படம் அல்லது பிடிஎஃப் கோப்பைப் பதிவேற்றவும்.",
        speakButton: "பேசு",
        stopButton: "நிறுத்து",
        downloadButton: "பதிவிறக்கு",
        contrastLabel: "மாறுபாடு",
        brightnessLabel: "பிரகாசம்",
        grayscaleLabel: "கிரேஸ்கேல்",
        imagePreview: "பட முன்னோட்டம்",
      },
    },
    "te-IN": {
      name: "తెలుగు",
      translations: {
        title: "పిడ101ఎఫ్/ఇమేజ్ విశ్లేషకుడు",
        subtitle: "స్వాతంత్ర్యాన్ని బలోపేతం చేయడం",
        description:
          "చిత్రం లేదా పిడిఎఫ్‌ను అప్‌లోడ్ చేసి మీకు ఇష్టమైన భాషలో అందుబాటులో ఉన్న, AI-ఆధారిత వచన సేకరణ మరియు చదవడాన్ని అనుభవించండి.",
        uploadText: "చిత్రం లేదా పిడిఎః అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి లేదా డ్రాగ్ చేసి డ్రాప్ చేయండి",
        analyzeButton: "విశ్లేషించు",
        analyzingText: "విశ్లేషిస్తోంది...",
        extractedText: "సేకరించిన వచనం",
        translatedText: "అనువదించబడిన వచనం",
        translationPlaceholder: "అనువదించబడిన వచనం ఇక్కడ కనిపిస్తುంది...",
        invalidFile: "దయచేసి చెల్లుబాటు అయ్యే చిత్రం లేదా పిడిఎఫ్ ఫైల్‌ను అప్‌లోడ్ చేయండి.",
        speakButton: "మాట్లాడు",
        stopButton: "ఆపు",
        downloadButton: "డౌన్‌లోడ్",
        contrastLabel: "కాంట్రాస్ట్",
        brightnessLabel: "ప్రకాశం",
        grayscaleLabel: "గ్రేస్కేల్",
        imagePreview: "చిత్రం ప్రివ్యూ",
      },
    },
  };

  const get102LanguageClass = (langCode) => {
    switch (langCode) {
      case 'hi-IN':
        return 'font-hindi';
      case 'kn-IN':
        return 'font-kannada';
      case 'ta-IN':
        return 'font-tamil';
      case 'te-IN':
        return 'font-telugu';
      default:
        return '';
    }
  };

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedSpeaking, setExtractedSpeaking] = useState(false);
  const [translatedSpeaking, setTranslatedSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [targetLanguage, setTargetLanguage] = useState("en-US");
  const [imageData, setImageData] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [imageSettings, setImageSettings] = useState({
    contrast: 100,
    brightness: 100,
    grayscale: false,
  });
  const speechSynthesisRef = useRef(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
     if (voices.length === 0) {
        setTimeout(loadVoices, 100);
      } else {
        setAvailableVoices(voices);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.match("image.*|application/pdf")) {
        alert(currentTranslations.invalidFile);
        return;
      }
      setFile(selectedFile);
      setFileType(selectedFile.type);
      setExtractedText("");
      setTranslatedText("");
      setProgress(0);
      if (extractedSpeaking || translatedSpeaking) {
        stopSpeaking();
      }
      setImageData(URL.createObjectURL(selectedFile));
      if (selectedFile.type === "application/pdf") {
        renderPdfPreview(selectedFile);
      } else {
        setPdfPreviewUrl(null);
      }
    }
  };

  const processImage = async (imageFile) => {
    try {
      const imageUrl = URL.createObjectURL(imageFile);
      const result = await Tesseract.recognize(imageUrl, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            setProgress(info.progress);
          }
        },
      });
      return result.data.text;
    } catch (error) {
      console.error("Error processing image:", error);
      return "";
    }
  };

  const processPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      return text;
    } catch (error) {
     console.error("Error processing PDF:", error);
      return "";
    }
  };

  const translateText = async (text, targetLang) => {
    try {
      // Map language codes to language names for the API prompt
      const languageMap = {
        'hi-IN': 'Hindi',
        'kn-IN': 'Kannada',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
        'en-US': 'English'
      };

      // Get the target language name from the map
      const targetApiLang = languageMap[targetLang];

      if (!targetApiLang) {
        throw new Error('Invalid target language');
      }

      // Split text into smaller chunks (to avoid hitting API limits)
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      let translatedChunks = [];

      for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        // Only translate if target language is not English
        if (targetApiLang !== 'English') {
          const result = await callGroqAPI(chunk.trim(), targetApiLang);
          translatedChunks.push(result);
          // Add small delay between chunks
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          translatedChunks.push(chunk.trim());
        }
      }

      return translatedChunks.join(' ');
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  };

  const handleTranslate = async () => {
    if (!extractedText || !targetLanguage) return;
    
    setIsTranslating(true);
    try {
      // Add a small delay to prevent rapid consecutive requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const translatedResult = await translateText(extractedText, targetLanguage);
      if (translatedResult) {
        setTranslatedText(translatedResult);
      } else {
        setTranslatedText('Translation failed. The text could not be translated.');
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation service unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let text = "";
      if (fileType.startsWith("image/")) {
        text = await processImage(file);
      } else if (fileType === "application/pdf") {
        text = await processPDF(file);
      }
      
      setExtractedText(text);
      
      // Automatically translate if a non-English language is selected
      if (targetLanguage !== "en-US") {
        await handleTranslate();
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const start105ExtractedSpeaking = (text, lang) => {
    if (!text) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`No voice found for language ${lang}, using default voice`);
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setExtractedSpeaking(false);
      };

      utterance.onend = () => {
        setExtractedSpeaking(false);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setExtractedSpeaking(true);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setExtractedSpeaking(false);
    }
  };

  const startTranslatedSpeaking = (text, lang) => {
    if (!text) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find an exact match first
      let voice = voices.find(v => v.lang === lang);
      // If no exact match, try to find a match for the base language
      if (!voice) {
        const baseLang = lang.split('-')[0];
        voice = voices.find(v => v163.lang.startsWith(baseLang));
      }
      
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`No voice found for language ${lang}, using default voice`);
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setTranslatedSpeaking(false);
      };

      utterance.onend = () => {
        setTranslatedSpeaking(false);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setTranslatedSpeaking(true);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setTranslatedSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setExtractedSpeaking(false);
    setTranslatedSpeaking(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "extracted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentTranslations = languages[selectedLanguage].translations;

  // New download function for the currently displayed text (extracted or translated)
  const handleCurrentDownload = () => {
    const textToDownload = isTranslating || target164Language !== "en-US" ? translatedText : extractedText;
    const element = document.createElement("a");
    const file = new Blob([textToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `text_${targetLanguage}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderPdfPreview = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      setPdfPreviewUrl(canvas.toDataURL());
    } catch (error) {
      setPdfPreviewUrl(null);
      console.error('Error rendering PDF preview:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 relative">
          <div className="inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-blue-100 text-blue-600 rounded-full text-sm sm:text-base font-medium mb-4 sm:mb-6">
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
            {currentTranslations.subtitle}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            <span className="text-blue-600">{currentTranslations.title}</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            {currentTranslations.description}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-6 sm:mb-10">
          <label
            htmlFor="file-upload"
            className="w-full flex flex-col items-center px-6 py-10 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
          >
            <Upload className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-gray-500 text-sm sm:text-base">
              {file ? file.name : currentTranslations.uploadText}
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </label>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition text-base sm:text-lg"
            >
              {isProcessing ? currentTranslations.analyzingText : currentTranslations.analyzeButton}
            </button>
          </div>

          {isProcessing && (
            <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Extracted Text & Preview */}
        {extractedText && fileType === "application/pdf" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[32rem]">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-blue-500" />
                    {isTranslating ? currentTranslations.translatedText : currentTranslations.extractedText}
                  </h2>
                  <select
                    value={targetLanguage}
                    onChange={(e) => {
                      setTargetLanguage(e.target.value);
                      if (extractedText) {
                        handleTranslate();
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-purple-300"
                  >
                    {Object.entries(languages).map(([code, lang]) => (
                      <option key={code} value={code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textToSpeak = isTranslating || targetLanguage !== "en-US" ? translatedText : extractedText;
                      const langToSpeak = isTranslating || targetLanguage !== "en-US" ? targetLanguage : selectedLanguage;
                      if (translatedSpeaking || extractedSpeaking) {
                        stopSpeaking();
                      } else if (textToSpeak) {
                        startTranslatedSpeaking(textToSpeak, langToSpeak);
                      }
                    }}
                    className={`px-3 py-2 text-sm sm:text-base rounded-xl flex items-center ${
                      translatedSpeaking || extractedSpeaking ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}
                    disabled={!extractedText}
                  >
                    {translatedSpeaking || extractedSpeaking ? (
                      <>
                        <PauseCircle className="w-4 h-4 mr-1" /> {currentTranslations.stopButton}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" /> {currentTranslations.speakButton}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCurrentDownload}
                    className="px-3 py-2 bg-green-100 text-green-700 text-sm sm:text-base rounded-xl flex items-center hover:bg-green-200"
                  >
                    <Download className="w-4 h-4 mr-1" /> {currentTranslations.downloadButton}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 text-sm sm:text-lg" style={getLanguageStyle(targetLanguage)}>
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {currentTranslations.analyzingText}
                  </div>
                ) : (targetLanguage === "en-US" || !translatedText || translatedText === "Translation failed. The text could not be translated.") ? (
                  extractedText
                ) : (
                  translatedText
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-4 flex flex-col h-full items-center justify-center">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center mb-4">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-blue-500" /> PDF Preview
              </h2>
              <div className="flex-1 w-full flex items-center justify-center">
                {pdfPreviewUrl && (
                  <img src={pdfPreviewUrl} alt="PDF Preview" className="w-full h-auto max-h-full rounded-xl border object-contain" />
                )}
              </div>
            </div>
          </div>
        )}

        {extractedText && fileType && fileType.startsWith("image/") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-blue-500" />
                    {currentTranslations.extractedText}
                  </h2>
                  <select
                    value={targetLanguage}
                    onChange={(e) => {
                      setTargetLanguage(e.target.value);
                      if (extractedText) {
                        handleTranslate();
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-purple-300"
                  >
                    {Object.entries(languages).map(([code, lang]) => (
                      <option key={code} value={code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textToSpeak = extractedText;
                      const langToSpeak = targetLanguage;
                      if (extractedSpeaking) {
                        stopSpeaking();
                      } else if (textToSpeak) {
                        start105ExtractedSpeaking(textToSpeak, langToSpeak);
                      }
                    }}
                    className={`px-3 py-2 text-sm sm:text-base rounded-xl flex items-center ${
                      extractedSpeaking ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}
                    disabled={!extractedText}
                  >
                    {extractedSpeaking ? (
                      <>
                        <PauseCircle className="w-4 h-4 mr-1" /> {currentTranslations.stopButton}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" /> {currentTranslations.speakButton}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCurrentDownload}
                    className="px-3 py-2 bg-green-100 text-green-700 text-sm sm:text-base rounded-xl flex items-center hover:bg-green-200"
                  >
                    <Download className="w-4 h-4 mr-1" /> {currentTranslations.downloadButton}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 text-sm sm:text-lg" style={getLanguageStyle(targetLanguage)}>
                {extractedText}
              </div>
            </div>
            {imageData && (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-4">
                <h2 className="text-xl font-bold flex items-center">
                  <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> {currentTranslations.imagePreview}
                </h2>
                <div className="space-y-2">
                  <label className="block text-sm">{currentTranslations.contrastLabel}</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={imageSettings.contrast}
                    onChange={(e) =>
                      setImageSettings((prev) => ({ ...prev, contrast: e.target.value }))
                    }
                    className="w-full"
                  />
                  <label className="block text-sm">{currentTranslations.brightnessLabel}</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={imageSettings.brightness}
                    onChange={(e) =>
                      setImageSettings((prev) => ({ ...prev, brightness: e.target.value }))
                    }
                    className="w-full"
                  />
                  <label className="block text-sm">{currentTranslations.grayscaleLabel}</label>
                  <input
                    type="checkbox"
                    checked={imageSettings.grayscale}
                    onChange={(e) =>
                      setImageSettings((prev) => ({ ...prev, grayscale: e.target.checked }))
                    }
                  />
                </div>
                <div className="rounded-xl overflow-hidden bg-gray-100 border aspect-video">
                  <img
                    src={imageData}
                    alt={currentTranslations.imagePreview}
                    className="w-full h-full object-contain"
                    style={{
                      filter: `contrast(${imageSettings.contrast}%) brightness(${imageSettings.brightness}%) ${
                        imageSettings.grayscale ? "grayscale(100%)" : ""
                      }`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;
