// src/pages/Footer.jsx
import React from 'react';
import {
  Info,
  Users,
  Home,
  ShieldCheck,
  Mail,
  Lightbulb
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t border-gray-200 mt-11">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Project Overview */}
          <div>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb size={20} /> IncluVerse
            </h4>
            <p className="text-gray-600 text-l leading-relaxed">
              IncluVerse is an all-in-one accessibility platform designed for people with disabilities. From assistive tech to real-time support, we're building inclusive solutions to empower independence and dignity.
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users size={20} /> About Us
            </h4>
            <p className="text-gray-600 text-l leading-relaxed">
              We are a passionate group of developers, designers, and accessibility advocates working together to make technology inclusive for everyone. Our mission is to bridge the digital divide through empathy and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info size={20} /> Quick Links
            </h4>
            <ul className="text-l space-y-2">
              <li className="flex items-center gap-2 hover:text-blue-600 transition">
                <Home size={16} />
                <a href="#">Home</a>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 transition">
                <Lightbulb size={16} />
                <a href="#">Solutions</a>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 transition">
                <Mail size={16} />
                <a href="#">Contact</a>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 transition">
                <ShieldCheck size={16} />
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} IncluVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
