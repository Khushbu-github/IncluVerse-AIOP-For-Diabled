import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, PauseCircle, Image as ImageIcon, FileText, Download, Settings2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const ImageAnalyzer = () => {
  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' }
  ];

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
    <div
      className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-50 px-6 py-12"
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 'normal',
        color: '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide bg-blue-100 rounded-full px-4 py-1 inline-block mb-3">Empowering Independence</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            PDF/Image <span className="text-blue-600">Analyzer</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image or PDF and experience accessible, AI-powered text extraction and reading in your preferred language.
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 space-y-6">
          <label htmlFor="file-upload" className="w-full flex flex-col items-center px-6 py-10 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-400 transition">
            <Upload className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-gray-500">{file ? file.name : 'Click or drag & drop to upload image or PDF'}</span>
            <input id="file-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
          </label>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition"
            >
              {isProcessing ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>

          {isProcessing && (
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </div>

        {extractedText && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  {fileType.startsWith('image/') ? <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> : <FileText className="w-6 h-6 mr-2 text-blue-500" />}
                  Extracted Text
                </h2>
                <div className="flex gap-2">
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="border px-2 py-1 rounded-md text-sm">
                    {languages.map(({ code, name }) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <button onClick={speaking ? stopSpeaking : startSpeaking} className={`px-3 py-2 text-sm rounded-md flex items-center ${speaking ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {speaking ? <><PauseCircle className="w-4 h-4 mr-1" /> Stop</> : <><Play className="w-4 h-4 mr-1" /> Speak</>}
                  </button>
                  <button onClick={handleDownload} className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md flex items-center hover:bg-green-200">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl h-64 overflow-y-auto whitespace-pre-wrap text-gray-700">
                {extractedText}
              </div>
            </div>

            {imageData && fileType.startsWith('image/') && (
              <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
                <h2 className="text-xl font-bold flex items-center">
                  <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> Image Preview
                </h2>
                <div className="space-y-2">
                  <label className="block text-sm">Contrast</label>
                  <input type="range" min="50" max="200" value={imageSettings.contrast}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, contrast: e.target.value }))} className="w-full" />
                  <label className="block text-sm">Brightness</label>
                  <input type="range" min="50" max="200" value={imageSettings.brightness}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, brightness: e.target.value }))} className="w-full" />
                  <label className="block text-sm">Grayscale</label>
                  <input type="checkbox" checked={imageSettings.grayscale}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, grayscale: e.target.checked }))} />
                </div>
                <div className="rounded-xl overflow-hidden bg-gray-100 border aspect-video">
                  <img
                    src={imageData}
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain"
                    style={{
                      filter: `contrast(${imageSettings.contrast}%) brightness(${imageSettings.brightness}%) ${imageSettings.grayscale ? 'grayscale(100%)' : ''}`
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
