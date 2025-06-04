import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Send, Wifi, WifiOff, Clock, CheckCircle, AlertCircle, Globe,
  MessageSquare, User, Users, Settings, Search, Filter, Eye, Reply,
  FileText, Calendar, Star, ArrowRight, ChevronDown, ChevronUp,
  Accessibility, Volume2, EyeOff, ArrowLeft, PlusCircle
} from 'lucide-react';

const GrievanceHandler = () => {
  // State management (unchanged)
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [complaints, setComplaints] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('file');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [userRole, setUserRole] = useState('user');

  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' }
  ];

  const sampleResponses = [
    "Thank you for bringing this to our attention. We have forwarded your complaint to the relevant department and will investigate this matter within 3-5 business days.",
    "We acknowledge your concern and are taking immediate action to address this issue. You should see improvements within the next 24-48 hours.",
    "Your feedback is valuable to us. We have escalated this matter to our senior team and will provide you with a detailed response within one week.",
    "We apologize for the inconvenience caused. This issue has been resolved and measures have been put in place to prevent future occurrences.",
    "Thank you for your patience. After thorough investigation, we have implemented the necessary changes and your concern has been addressed."
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showAlert('Voice recognition error. Please try again.', 'error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    loadComplaints();
    initializeSampleData();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineComplaints();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const initializeSampleData = () => {
    const saved = localStorage.getItem('grievance_complaints');
    if (!saved) {
      const sampleComplaints = [
        {
          id: 1,
          text: "The wheelchair ramp at the main entrance is too steep and difficult to navigate. It needs to be rebuilt according to accessibility standards.",
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          language: 'en-US',
          status: 'resolved',
          synced: true,
          priority: 'high',
          category: 'Accessibility',
          response: "Thank you for reporting this critical accessibility issue. We have engaged contractors to rebuild the ramp according to ADA standards. Work will begin next week and should be completed within 10 days.",
          responseDate: new Date(Date.now() - 86400000).toISOString(),
          rating: 5
        },
        {
          id: 2,
          text: "सार्वजनिक शौचालय में दिव्यांगजनों के लिए उचित सुविधा नहीं है। कृपया इसे ठीक करवाएं।",
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          language: 'hi-IN',
          status: 'in-progress',
          synced: true,
          priority: 'medium',
          category: 'Public Facilities',
          response: "आपकी शिकायत पर तुरंत कार्यवाही की जा रही है। हमने संबंधित विभाग को निर्देश दिए हैं और 7 दिनों में सुधार कार्य पूरा हो जाएगा।",
          responseDate: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 3,
          text: "The audio announcement system in public transport is not working properly. Visually impaired passengers are facing difficulties.",
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
          language: 'en-US',
          status: 'submitted',
          synced: true,
          priority: 'high',
          category: 'Transportation'
        }
      ];
      localStorage.setItem('grievance_complaints', JSON.stringify(sampleComplaints));
      setComplaints(sampleComplaints);
    }
  };

  const loadComplaints = () => {
    try {
      const saved = localStorage.getItem('grievance_complaints');
      if (saved) {
        setComplaints(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const saveComplaints = (newComplaints) => {
    try {
      localStorage.setItem('grievance_complaints', JSON.stringify(newComplaints));
      setComplaints(newComplaints);
    } catch (error) {
      console.error('Error saving complaints:', error);
      showAlert('Error saving complaint locally', 'error');
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showAlert('Speech recognition not supported in this browser', 'error');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      showAlert('Listening... Speak your complaint', 'info');
    }
  };

  const submitComplaint = async () => {
    if (!transcript.trim()) {
      showAlert('Please record your complaint first', 'error');
      return;
    }
    setIsSubmitting(true);
    const complaint = {
      id: Date.now(),
      text: transcript.trim(),
      timestamp: new Date().toISOString(),
      language: selectedLanguage,
      status: isOnline ? 'submitted' : 'offline',
      synced: isOnline,
      priority: 'medium',
      category: 'General'
    };
    const newComplaints = [complaint, ...complaints];
    saveComplaints(newComplaints);
    if (isOnline) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        complaint.status = 'submitted';
        complaint.synced = true;
        saveComplaints(newComplaints);
        showAlert('Complaint submitted successfully!', 'success');
      } catch (error) {
        complaint.status = 'offline';
        complaint.synced = false;
        saveComplaints(newComplaints);
        showAlert('Complaint saved offline. Will sync when connection is restored.', 'warning');
      }
    } else {
      showAlert('Complaint saved offline. Will sync when connection is restored.', 'warning');
    }
    setTranscript('');
    setIsSubmitting(false);
  };

  const addResponse = (complaintId) => {
    if (!responseText.trim()) {
      showAlert('Please enter a response', 'error');
      return;
    }
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          response: responseText.trim(),
          responseDate: new Date().toISOString(),
          status: 'in-progress'
        };
      }
      return complaint;
    });
    saveComplaints(updatedComplaints);
    setResponseText('');
    showAlert('Response added successfully', 'success');
  };

  const updateStatus = (complaintId, newStatus) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return { ...complaint, status: newStatus };
      }
      return complaint;
    });
    saveComplaints(updatedComplaints);
    showAlert('Status updated successfully', 'success');
  };

  const generateAutoResponse = (complaintId) => {
    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          response: randomResponse,
          responseDate: new Date().toISOString(),
          status: 'in-progress'
        };
      }
      return complaint;
    });
    saveComplaints(updatedComplaints);
    showAlert('Auto-response generated', 'success');
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const syncOfflineComplaints = async () => {
    const offlineComplaints = complaints.filter(c => !c.synced);
    if (offlineComplaints.length === 0) return;
    try {
      const updatedComplaints = complaints.map(complaint => {
        if (!complaint.synced) {
          return { ...complaint, status: 'submitted', synced: true };
        }
        return complaint;
      });
      saveComplaints(updatedComplaints);
      showAlert(`${offlineComplaints.length} offline complaints synced successfully!`, 'success');
    } catch (error) {
      showAlert('Error syncing offline complaints', 'error');
    }
  };

  const getStatusBadge = (complaint) => {
    const statusConfig = {
      submitted: { icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Submitted' },
      'in-progress': { icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200', text: 'In Progress' },
      resolved: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', text: 'Resolved' },
      offline: { icon: Clock, color: 'text-gray-600 bg-gray-50 border-gray-200', text: 'Pending Sync' }
    };
    const config = statusConfig[complaint.status] || statusConfig.submitted;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${config.color}`} aria-label={`Status: ${config.text}`}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded ${colors[priority] || colors.medium}`} aria-label={`Priority: ${priority?.toUpperCase() || 'MEDIUM'}`}>
        {priority?.toUpperCase() || 'MEDIUM'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 relative">
          <div className="absolute inset-0 bg-pattern-dots opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='13' cy='13' r='2'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
          <div className="inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-blue-100 text-blue-600 rounded-full text-sm sm:text-base font-medium mb-4 sm:mb-6">
            <Accessibility className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
            EMPOWERING VOICES
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Grievance <span className="text-blue-600">Management System</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            A fully accessible platform with voice input, multilingual support, 
            and comprehensive response management for inclusive grievance handling.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-10">
          <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('file')}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                activeTab === 'file'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="File a new complaint"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2 sm:mr-3" aria-hidden="true" />
              File Complaint
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                activeTab === 'view'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              } mt-2 sm:mt-0 sm:ml-2`}
              aria-label="View all complaints"
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2 sm:mr-3" aria-hidden="true" />
              View Complaints ({complaints.length})
            </button>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className={`inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`} aria-live="polite">
            {isOnline ? <Wifi className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" /> : <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-4 focus:ring-blue-300"
              aria-label="Select user role"
            >
              <option value="user">👤 User View</option>
              <option value="admin">👥 Admin View</option>
            </select>

            {activeTab === 'file' && (
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" aria-hidden="true" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-4 focus:ring-blue-300"
                  aria-label="Select language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Alert Message */}
        {alertMessage && (
          <div className={`mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl border w-full ${
            alertType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            alertType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            alertType === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`} role="alert">
            <div className="flex items-center">
              {alertType === 'success' && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />}
              {alertType === 'error' && <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />}
              {alertType === 'warning' && <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />}
              <span className="text-sm sm:text-lg">{alertMessage}</span>
            </div>
          </div>
        )}

        {/* File Complaint Tab */}
        {activeTab === 'file' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-6 sm:mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
              <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" aria-hidden="true" />
              File Your Complaint
            </h2>
            
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <label className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-0">Voice Input</label>
                <button
                  onClick={toggleListening}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[48px] ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={isListening ? "Listening... Your speech will appear here" : "Click 'Start Recording' to begin voice input, or type your complaint here"}
                  className="w-full h-32 sm:h-40 p-4 sm:p-5 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 resize-none text-sm sm:text-lg"
                  disabled={isListening}
                  aria-label="Complaint input"
                />
                {isListening && (
                  <div className="absolute top-3 right-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={submitComplaint}
              disabled={!transcript.trim() || isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base sm:text-lg font-medium rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
              aria-label={isOnline ? 'Submit complaint' : 'Save complaint offline'}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                  {isOnline ? 'Submitting...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />
                  {isOnline ? 'Submit Complaint' : 'Save Offline'}
                </>
              )}
            </button>
          </div>
        )}

        {/* View Complaints Tab */}
        {activeTab === 'view' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-sm sm:text-lg"
                      aria-label="Search complaints"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" aria-hidden="true" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-lg focus:ring-4 focus:ring-blue-300"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4 sm:space-y-6">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm sm:text-lg text-gray-500">No complaints found</p>
                </div>
              ) : (
                filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            {getStatusBadge(complaint)}
                            {getPriorityBadge(complaint.priority)}
                            {complaint.category && (
                              <span className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded hidden sm:inline" aria-label={`Category: ${complaint.category}`}>
                                {complaint.category}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center text-xs sm:text-base text-gray-500 gap-3 sm:gap-6 mb-3 sm:mb-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" aria-hidden="true" />
                              {new Date(complaint.timestamp).toLocaleString()}
                            </span>
                            <span className="hidden sm:inline">
                              {languages.find(l => l.code === complaint.language)?.name || complaint.language}
                            </span>
                            <span className="text-xs sm:text-sm bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded">
                              ID: {complaint.id}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedComplaint(
                            expandedComplaint === complaint.id ? null : complaint.id
                          )}
                          className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[40px]"
                          aria-label={expandedComplaint === complaint.id ? 'Collapse complaint details' : 'Expand complaint details'}
                        >
                          {expandedComplaint === complaint.id ? (
                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <p className="text-gray-800 text-sm sm:text-lg leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {complaint.text}
                        </p>
                      </div>

                      {/* Expanded Content */}
                      {expandedComplaint === complaint.id && (
                        <div className="border-t pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                          <div>
                            <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 flex items-center">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
                              Full Complaint:
                            </h4>
                            <p className="text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-xl text-sm sm:text-lg">{complaint.text}</p>
                          </div>

                          {complaint.response ? (
                            <div>
                              <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 flex items-center">
                                <Reply className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
                                Official Response:
                              </h4>
                              <div className="bg-blue-50 border border-blue-200 p-3 sm:p-5 rounded-xl">
                                <p className="text-gray-800 text-sm sm:text-lg mb-2 sm:mb-3">{complaint.response}</p>
                                {complaint.responseDate && (
                                  <p className="text-xs sm:text-base text-blue-600">
                                    Responded on: {new Date(complaint.responseDate).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              {complaint.status === 'resolved' && userRole === 'user' && (
                                <div className="mt-3 sm:mt-4">
                                  <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-3">Rate this response:</p>
                                  <div className="flex space-x-1 sm:space-x-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        onClick={() => {
                                          const updatedComplaints = complaints.map(c => 
                                            c.id === complaint.id ? { ...c, rating } : c
                                          );
                                          saveComplaints(updatedComplaints);
                                          showAlert('Thank you for your feedback!', 'success');
                                        }}
                                        className={`p-1 sm:p-2 ${
                                          complaint.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                                        } hover:text-yellow-400 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-300 min-h-[40px]`}
                                        aria-label={`Rate ${rating} stars`}
                                      >
                                        <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Response Status:</h4>
                              <p className="text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-xl text-sm sm:text-lg">
                                {complaint.status === 'submitted' ? 
                                  'Your complaint has been received and is being reviewed.' :
                                  'Response pending from the concerned department.'
                                }
                              </p>
                            </div>
                          )}

                          {userRole === 'admin' && (
                            <div className="border-t pt-4 sm:pt-6">
                              <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
                                <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
                                Admin Actions:
                              </h4>
                              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <button
                                  onClick={() => updateStatus(complaint.id, 'submitted')}
                                  className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[40px]"
                                  aria-label="Mark complaint as submitted"
                                >
                                  Mark as Submitted
                                </button>
                                <button
                                  onClick={() => updateStatus(complaint.id, 'in-progress')}
                                  className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-orange-100 text-orange-800 rounded-xl hover:bg-orange-200 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300 min-h-[40px]"
                                  aria-label="Mark complaint as in progress"
                                >
                                  Mark In Progress
                                </button>
                                <button
                                  onClick={() => updateStatus(complaint.id, 'resolved')}
                                  className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 min-h-[40px]"
                                  aria-label="Mark complaint as resolved"
                                >
                                  Mark Resolved
                                </button>
                                <button
                                  onClick={() => generateAutoResponse(complaint.id)}
                                  className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300 min-h-[40px]"
                                  aria-label="Generate auto response"
                                >
                                  Generate Auto Response
                                </button>
                              </div>
                              {!complaint.response && (
                                <div className="space-y-3 sm:space-y-4">
                                  <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Enter your response to this complaint..."
                                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 resize-none text-sm sm:text-lg"
                                    rows={4}
                                    aria-label="Enter response to complaint"
                                  />
                                  <button
                                    onClick={() => addResponse(complaint.id)}
                                    disabled={!responseText.trim()}
                                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-lg font-medium rounded-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
                                    aria-label="Send response"
                                  >
                                    <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />
                                    Send Response
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Statistics Dashboard for Admin */}
            {userRole === 'admin' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" aria-hidden="true" />
                  Complaint Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-blue-50 p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base text-blue-600 font-medium">Total Complaints</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900">{complaints.length}</p>
                      </div>
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base text-orange-600 font-medium">In Progress</p>
                        <p className="text-2xl sm:text-3xl font-bold text-orange-900">
                          {complaints.filter(c => c.status === 'in-progress').length}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base text-green-600 font-medium">Resolved</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900">
                          {complaints.filter(c => c.status === 'resolved').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base text-purple-600 font-medium">Avg Rating</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                          {complaints.filter(c => c.rating).length > 0 ? 
                            (complaints.filter(c => c.rating).reduce((sum, c) => sum + c.rating, 0) / 
                             complaints.filter(c => c.rating).length).toFixed(1) : 'N/A'}
                        </p>
                      </div>
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 fill-current" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {complaints
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 3)
                      .map((complaint) => (
                        <div key={complaint.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                              complaint.status === 'resolved' ? 'bg-green-500' :
                              complaint.status === 'in-progress' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="text-sm sm:text-base text-gray-700">
                              Complaint #{complaint.id} - {complaint.status}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(complaint.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceHandler;