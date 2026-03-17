import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Chatbot from '../pages/chatbot';
import BusBuddyBol from '../pages/busbuddybol';
import Grievance from '../pages/grievance';
import SignLanguage from '../pages/signlang';
import ImgAnalyzer from '../pages/img_analyzer';
import EmergencySOS from '../pages/emergency';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/busbuddybol" element={<BusBuddyBol />} />
      <Route path="/grievance" element={<Grievance />} />
      <Route path="/signlanguage" element={<SignLanguage />} />
      <Route path="/img_analyzer" element={<ImgAnalyzer />} />
      <Route path="/emergency" element={<EmergencySOS />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
