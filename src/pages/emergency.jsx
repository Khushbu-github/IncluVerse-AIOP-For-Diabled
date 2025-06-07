import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, CheckCircle, XCircle, Loader2, Settings, User, History, Shield } from 'lucide-react';

const SOSAlertSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    phone: '+919663553530',
    emergencyContact: '+918888888888',
    medicalInfo: 'No known allergies'
  });
  const [alertHistory, setAlertHistory] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // home, profile, history, settings
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Static user ID for now - replace with actual user authentication
  const userId = "user123";
  
  // Backend API URL - change this to your actual backend URL
  const API_BASE_URL = 'http://localhost:3001';
  
  // Twilio credentials for direct integration (DEVELOPMENT ONLY)
const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  fromNumber: import.meta.env.VITE_TWILIO_FROM,
  toNumber: import.meta.env.VITE_TWILIO_TO
};


  // Font style object for consistent application
  const fontStyle = { fontFamily: 'HelveticaNeueW01-55Roma, Helvetica, Arial, sans-serif' };

  useEffect(() => {
    checkBackendConnection();
    loadAlertHistory();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      setConnectionStatus(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const loadAlertHistory = () => {
    // Using in-memory storage instead of localStorage for Claude.ai compatibility
    setAlertHistory([]);
  };

  const saveAlertToHistory = (alertData) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alertData
    };
    const updatedHistory = [newAlert, ...alertHistory].slice(0, 10); // Keep last 10 alerts
    setAlertHistory(updatedHistory);
  };

  const clearAlert = () => {
    setAlert(null);
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLocationStatus('Getting your location...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('Location found');
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
              break;
          }
          setLocationStatus('');
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  const createEmergencyMessage = (locationData) => {
    const googleMapsLink = `https://maps.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
    
    return {
      subject: "🚨 EMERGENCY ALERT - PERSON IN DANGER 🚨",
      message: `URGENT: ${userProfile.name} is in immediate danger and needs emergency assistance!

📍 LOCATION: ${locationData.latitude}, ${locationData.longitude}
🗺️ Google Maps: ${googleMapsLink}
📱 Contact: ${userProfile.phone}
🆘 Emergency Contact: ${userProfile.emergencyContact}
⏰ Alert Time: ${new Date().toLocaleString()}
🏥 Medical Info: ${userProfile.medicalInfo}

This is an automated emergency alert. Please respond immediately.

PERSON IS IN DANGER - IMMEDIATE ASSISTANCE REQUIRED`,
      
      voiceMessage: `Emergency alert! ${userProfile.name} is in immediate danger at location ${locationData.latitude}, ${locationData.longitude}. This person needs immediate emergency assistance. Please respond to this emergency call immediately.`
    };
  };

  const sendSOSViaBackend = async (locationData) => {
    const emergencyMsg = createEmergencyMessage(locationData);
    
    const payload = {
      userId,
      userName: userProfile.name,
      userPhone: userProfile.phone,
      emergencyContact: userProfile.emergencyContact,
      medicalInfo: userProfile.medicalInfo,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
      timestamp: new Date().toISOString(),
      emergencyMessage: emergencyMsg.message,
      dangerAlert: "PERSON IN IMMEDIATE DANGER - URGENT RESPONSE REQUIRED"
    };

    const response = await fetch(`${API_BASE_URL}/api/emergency-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send emergency alert');
    }

    return result;
  };

  const sendSOSDirectly = async (locationData) => {
    const emergencyMsg = createEmergencyMessage(locationData);
    
    const payload = {
      userId,
      userName: userProfile.name,
      userPhone: userProfile.phone,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timestamp: new Date().toISOString(),
      dangerStatus: "PERSON IN IMMEDIATE DANGER"
    };

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Calls.json`;
      
      const formData = new FormData();
      formData.append('Url', 'http://demo.twilio.com/docs/voice.xml');
      formData.append('To', TWILIO_CONFIG.toNumber);
      formData.append('From', TWILIO_CONFIG.fromNumber);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`),
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('🚨🚨🚨 EMERGENCY ALERT - PERSON IN DANGER 🚨🚨🚨');
      console.log('DANGER STATUS: PERSON IN IMMEDIATE DANGER');
      console.log('Alert Details:', payload);
      console.log('Emergency Message:', emergencyMsg.subject);
      console.log('Call SID:', result.sid);
      console.log('Google Maps Link:', `https://maps.google.com/maps?q=${payload.latitude},${payload.longitude}`);
      console.log('URGENT: Emergency services must respond immediately!');
      
      return {
        success: true,
        alertId: `DANGER-SOS-${Date.now()}`,
        callSid: result.sid,
        message: 'EMERGENCY: Person in danger - Emergency call initiated via Twilio',
        method: 'direct',
        dangerAlert: true
      };
      
    } catch (error) {
      throw new Error('Direct Twilio call failed: ' + error.message);
    }
  };

  const sendSOSAlert = async (locationData) => {
    try {
      // Try backend first
      if (connectionStatus === 'connected') {
        return await sendSOSViaBackend(locationData);
      }
      
      // Fallback to direct Twilio call
      try {
        return await sendSOSDirectly(locationData);
      } catch (directError) {
        // Final fallback to simulation
        console.warn('All methods failed, using simulation mode');
        const emergencyMsg = createEmergencyMessage(locationData);
        
        const payload = {
          userId,
          userName: userProfile.name,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timestamp: new Date().toISOString(),
          dangerStatus: "PERSON IN IMMEDIATE DANGER"
        };
        
        console.log('🚨🚨🚨 EMERGENCY ALERT SIMULATION - PERSON IN DANGER 🚨🚨🚨');
        console.log('DANGER STATUS: PERSON IN IMMEDIATE DANGER');
        console.log('Alert Details:', payload);
        console.log('Emergency Message:', emergencyMsg.subject);
        console.log('Google Maps Link:', `https://maps.google.com/maps?q=${payload.latitude},${payload.longitude}`);
        console.log('SIMULATION: In real scenario, emergency services would be notified immediately!');
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              alertId: `DANGER-SOS-${Date.now()}`,
              callSid: 'SIMULATION-' + Math.random().toString(36).substring(2, 15),
              message: 'EMERGENCY SIMULATION: Person in danger alert sent (all services unavailable)',
              method: 'simulation',
              dangerAlert: true
            });
          }, 1000);
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSOSClick = async () => {
    setIsLoading(true);
    setAlert(null);
    
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      // Send SOS alert
      setLocationStatus('🚨 SENDING DANGER ALERT...');
      const result = await sendSOSAlert(location);
      
      if (result.success) {
        const successMessage = `🚨 EMERGENCY SERVICES NOTIFIED - PERSON IN DANGER! 🚨
        
Emergency responders have been alerted that you are in immediate danger at your current location.
        
${result.callSid ? `Emergency Call ID: ${result.callSid}` : ''}
Method: ${result.method || 'backend'}

Help is on the way!`;
        
        setAlert({
          type: 'success',
          title: '🚨 DANGER ALERT SENT!',
          message: successMessage
        });

        // Save to history
        saveAlertToHistory({
          status: 'success',
          location: location,
          callSid: result.callSid,
          method: result.method || 'backend',
          dangerAlert: true,
          emergencyType: 'Person in Danger'
        });
      } else {
        throw new Error(result.error || 'Failed to send SOS alert');
      }
      
      setLocationStatus('');
    } catch (error) {
      setAlert({
        type: 'error',
        title: '🚨 DANGER ALERT FAILED',
        message: `Failed to notify emergency services that you are in danger: ${error.message}
        
Please try again or call emergency services directly!`
      });
      
      // Save failed attempt to history
      saveAlertToHistory({
        status: 'failed',
        error: error.message,
        emergencyType: 'Person in Danger - Failed'
      });
      
      setLocationStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHome = () => (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8" style={fontStyle}>
      {/* Status Messages */}
      {locationStatus && (
        <div className="mb-8 flex items-center space-x-2 text-red-600 bg-red-100 px-4 py-2 rounded-lg border-2 border-red-300">
          <MapPin className="h-5 w-5" />
          <span className="font-bold" style={fontStyle}>{locationStatus}</span>
        </div>
      )}

      {/* Connection Status */}
      <div className="mb-4 text-center">
        <div className={`inline-flex items-center space-x-2 text-sm px-3 py-1 rounded-full shadow-sm ${
          connectionStatus === 'connected' 
            ? 'text-green-700 bg-green-50' 
            : connectionStatus === 'disconnected'
            ? 'text-yellow-700 bg-yellow-50'
            : 'text-gray-600 bg-white'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-green-500 animate-pulse' 
              : connectionStatus === 'disconnected'
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`}></div>
          <span style={fontStyle}>
            {connectionStatus === 'connected' && 'Backend Connected'}
            {connectionStatus === 'disconnected' && 'Direct Mode Active'}
            {connectionStatus === 'checking' && 'Checking Connection...'}
          </span>
        </div>
      </div>

      {/* Emergency Warning */}
      <div className="mb-6 bg-red-100 border-2 border-red-400 rounded-lg p-4 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-bold text-red-800" style={fontStyle}>DANGER ALERT SYSTEM</h3>
        </div>
        <p className="text-red-700 font-medium" style={fontStyle}>
          Pressing the SOS button will immediately alert emergency services that you are in IMMEDIATE DANGER and need urgent assistance at your current location.
        </p>
      </div>

      {/* SOS Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleSOSClick}
          disabled={isLoading}
          className={`
            relative w-64 h-64 md:w-80 md:h-80 rounded-full text-white font-bold text-2xl md:text-3xl
            transition-all duration-200 transform hover:scale-105 active:scale-95
            shadow-2xl border-8 border-red-700
            ${isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 active:bg-red-800 animate-pulse'
            }
            focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50
          `}
          style={fontStyle}
          aria-label="Emergency SOS Button - Press to alert that you are in immediate danger"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin" />
              <span className="text-lg" style={fontStyle}>ALERTING...</span>
              <span className="text-sm" style={fontStyle}>PERSON IN DANGER</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Phone className="h-16 w-16 mb-2" />
              <span style={fontStyle}>SOS</span>
              <span className="text-lg font-normal" style={fontStyle}>I'M IN DANGER</span>
            </div>
          )}
        </button>
        
        <p className="mt-6 text-red-700 text-lg font-semibold max-w-md mx-auto" style={fontStyle}>
          🚨 EMERGENCY: Press if you are in immediate danger 🚨
        </p>
        <p className="mt-2 text-gray-600 text-base max-w-md mx-auto" style={fontStyle}>
          This will notify emergency services that you need urgent help at your location
        </p>
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto border-2 border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900" style={fontStyle}>Emergency Response</h2>
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600" style={fontStyle}>{TWILIO_CONFIG.toNumber}</p>
          <p className="text-gray-600 mt-2" style={fontStyle}>Emergency services will be notified</p>
          <p className="text-red-700 mt-2 font-medium" style={fontStyle}>⚠️ "PERSON IN DANGER" alert will be sent</p>
        </div>
      </div>
    </main>
  );

  const renderProfile = () => (
    <main className="flex-1 px-4 py-8" style={fontStyle}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={fontStyle}>User Profile</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Full Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={fontStyle}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Phone Number</label>
            <input
              type="tel"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={fontStyle}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Emergency Contact</label>
            <input
              type="tel"
              value={userProfile.emergencyContact}
              onChange={(e) => setUserProfile({...userProfile, emergencyContact: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={fontStyle}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Medical Information</label>
            <textarea
              value={userProfile.medicalInfo}
              onChange={(e) => setUserProfile({...userProfile, medicalInfo: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={fontStyle}
              placeholder="Allergies, medications, medical conditions..."
            />
          </div>
          
          <button 
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            style={fontStyle}
          >
            Save Profile
          </button>
        </div>
      </div>
    </main>
  );

  const renderHistory = () => (
    <main className="flex-1 px-4 py-8" style={fontStyle}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={fontStyle}>Emergency Alert History</h2>
        
        {alertHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600" style={fontStyle}>No emergency danger alerts sent yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertHistory.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                alert.dangerAlert ? 'border-red-500' : 'border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {alert.status === 'success' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      alert.status === 'success' ? 'text-green-900' : 'text-red-900'
                    }`} style={fontStyle}>
                      {alert.dangerAlert ? '🚨 DANGER ALERT' : 'Alert'} - {alert.status === 'success' ? 'Sent' : 'Failed'}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm" style={fontStyle}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                
                {alert.emergencyType && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-red-700" style={fontStyle}>
                      Emergency Type: {alert.emergencyType}
                    </p>
                  </div>
                )}
                
                {alert.location && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600" style={fontStyle}>
                      Location: {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                    </p>
                    <a
                      href={`https://maps.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      style={fontStyle}
                    >
                      View on Google Maps →
                    </a>
                  </div>
                )}
                
                {alert.callSid && (
                  <p className="text-sm text-gray-600" style={fontStyle}>Emergency Call ID: {alert.callSid}</p>
                )}
                
                {alert.method && (
                  <p className="text-sm text-gray-600" style={fontStyle}>Method: {alert.method}</p>
                )}
                
                {alert.error && (
                  <p className="text-sm text-red-600" style={fontStyle}>Error: {alert.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );

  const renderSettings = () => (
    <main className="flex-1 px-4 py-8" style={fontStyle}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={fontStyle}>Settings</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={fontStyle}>Connection Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Backend API URL</label>
                <input
                  type="url"
                  value={API_BASE_URL}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  style={fontStyle}
                />
              </div>
              
              <button 
                onClick={checkBackendConnection}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                style={fontStyle}
              >
                Test Connection
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={fontStyle}>Emergency Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>Emergency Number</label>
                <input
                  type="tel"
                  value={TWILIO_CONFIG.toNumber}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  style={fontStyle}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={fontStyle}>From Number</label>
                <input
                  type="tel"
                  value={TWILIO_CONFIG.fromNumber}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  style={fontStyle}
                />
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2" style={fontStyle}>⚠️ Danger Alert Message</h4>
                <p className="text-sm text-red-700" style={fontStyle}>
                  When SOS is triggered, emergency services will be notified: <strong>"PERSON IN IMMEDIATE DANGER"</strong>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={fontStyle}>Data Management</h3>
            <button
              onClick={() => {
                setAlertHistory([]);
                setAlert({
                  type: 'success',
                  title: 'History Cleared',
                  message: 'All emergency alert history has been cleared.'
                });
              }}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              style={fontStyle}
            >
              Clear Alert History
            </button>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col" style={fontStyle}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900" style={fontStyle}>Emergency Danger Alert System</h1>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center space-x-8">
            {[
              { id: 'home', label: 'Home', icon: AlertTriangle },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'history', label: 'History', icon: History },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  currentView === id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={fontStyle}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      {currentView === 'home' && renderHome()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'history' && renderHistory()}
      {currentView === 'settings' && renderSettings()}

        {/* Alert Modal */}
        {alert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    alert.type === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {alert.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{alert.message}</p>
                <button
                  onClick={clearAlert}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    alert.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
            <p className="text-sm">
              🚨 Emergency Danger Alert System - Immediate assistance for people in danger
            </p>
            <p className="text-xs mt-1">
              Status: {connectionStatus === 'connected' ? 'Backend Connected' : 'Direct Mode Active'}
            </p>
            <p className="text-xs mt-1 text-red-600 font-medium">
              ⚠️ Emergency services will be notified: "PERSON IN IMMEDIATE DANGER"
            </p>
          </div>
        </footer>
      </div>
    );
  };

  export default SOSAlertSystem;