import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, PauseCircle, Image as ImageIcon, FileText, Download, Settings2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

// ✅ Set the correct worker URL from a known version available on CDNJS
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [imageData, setImageData] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [imageSettings, setImageSettings] = useState({
    contrast: 100,
    brightness: 100,
    grayscale: false,
  });
  const speechSynthesisRef = useRef(null);

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

  const languageGroups = {
    'en-US': 'English',
    'hi-IN': 'Hindi',
    'kn-IN': 'Kannada',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'mr-IN': 'Marathi'
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.match('image.*|application/pdf')) {
        alert("Please upload a valid image or PDF file.");
        return;
      }
      setFile(selectedFile);
      setFileType(selectedFile.type);
      setExtractedText('');
      setProgress(0);
      if (speaking) stopSpeaking();
      setImageData(URL.createObjectURL(selectedFile));
    }
  };

  const processImage = async (imageFile) => {
    try {
      const imageUrl = URL.createObjectURL(imageFile);
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: info => {
          if (info.status === 'recognizing text') {
            setProgress(info.progress);
          }
        }
      });
      return result.data.text;
    } catch (error) {
      console.error('Error processing image:', error);
      return '';
    }
  };

  const processPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    } catch (error) {
      console.error('Error processing PDF:', error);
      return '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    let text = '';
    try {
      if (fileType.startsWith('image/')) {
        text = await processImage(file);
      } else if (fileType === 'application/pdf') {
        text = await processPDF(file);
      }
      setExtractedText(text);
    } catch (error) {
      console.error('Error analyzing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startSpeaking = () => {
    if (!extractedText || speaking) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(extractedText);
    const voice = availableVoices.find(v => v.lang.startsWith(selectedLanguage)) || availableVoices.find(v => v.lang === 'en-US');
    utterance.voice = voice;
    utterance.lang = selectedLanguage;
    speechSynthesisRef.current = utterance;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'extracted_text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Image & PDF Analyzer</h1>
          <p className="text-lg text-gray-600">Accessible tool to extract and read aloud text from images or PDFs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="file-upload" className="w-full max-w-md flex flex-col items-center px-4 py-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
              <Upload className="w-12 h-12 text-blue-500 mb-2" />
              <span className="text-sm text-gray-600">{file ? file.name : "Click to upload or drag and drop"}</span>
              <input id="file-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
            </label>

            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                  Processing...
                </>
              ) : 'Analyze Content'}
            </button>

            {isProcessing && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" style={{ width: `${progress * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>

        {extractedText && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  {fileType?.startsWith('image/') ? <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> : <FileText className="w-6 h-6 mr-2 text-blue-500" />}
                  Extracted Text
                </h2>
                <div className="flex items-center space-x-2">
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="px-2 py-1 border rounded-md text-sm">
                    {Object.entries(languageGroups).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <button onClick={speaking ? stopSpeaking : startSpeaking} className="flex items-center px-3 py-2 rounded-md text-sm transition"
                    style={{
                      backgroundColor: speaking ? '#FEE2E2' : '#DBEAFE',
                      color: speaking ? '#DC2626' : '#1D4ED8',
                    }}>
                    {speaking ? <><PauseCircle className="w-4 h-4 mr-1" /> Stop</> : <><Play className="w-4 h-4 mr-1" /> Speak</>}
                  </button>
                  <button onClick={handleDownload} className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </button>
                </div>
              </div>
              <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{extractedText}</p>
              </div>
            </div>

            {imageData && fileType?.startsWith('image/') && (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> Image Preview
                  </h2>
                  <Settings2 className="w-5 h-5 text-gray-500" />
                </div>

                <div className="mb-4 space-y-2">
                  <label className="block text-sm text-gray-700">Contrast</label>
                  <input type="range" min="50" max="200" value={imageSettings.contrast}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, contrast: e.target.value }))} className="w-full" />
                  <label className="block text-sm text-gray-700">Brightness</label>
                  <input type="range" min="50" max="200" value={imageSettings.brightness}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, brightness: e.target.value }))} className="w-full" />
                  <label className="block text-sm text-gray-700">Grayscale</label>
                  <input type="checkbox" checked={imageSettings.grayscale}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, grayscale: e.target.checked }))} />
                </div>

                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={imageData}
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain"
                    style={{
                      filter: `
                        contrast(${imageSettings.contrast}%)
                        brightness(${imageSettings.brightness}%)
                        ${imageSettings.grayscale ? 'grayscale(100%)' : ''}
                      `
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
