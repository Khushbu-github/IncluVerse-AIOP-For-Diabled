import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Chatbot from '../pages/chatbot';
import BusBuddyBol from '../pages/busbuddybol';
import Grievance from '../pages/greviance';
import VoiceFeed from '../pages/voicefeed';
import SignLanguage from '../pages/signlang';
import ImgAnalyzer from '../pages/img_analyzer';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/busbuddybol" element={<BusBuddyBol />} />
      <Route path="/greviance" element={<Grievance />} />
      <Route path="/voicefeedback" element={<VoiceFeed />} />
      <Route path="/signlanguage" element={<SignLanguage />} />
      <Route path="/img_analyzer" element={<ImgAnalyzer />} />
    </Routes>
  );
}
