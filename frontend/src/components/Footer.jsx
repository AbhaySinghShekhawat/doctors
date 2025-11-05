import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Med<span className="text-blue-400">Research</span></h2>
          <p className="text-gray-400 leading-relaxed">
            Bridging patients and researchers through transparent, accessible clinical research and collaboration.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition"><Facebook /></a>
            <a href="#" className="hover:text-blue-400 transition"><Twitter /></a>
            <a href="#" className="hover:text-blue-400 transition"><Linkedin /></a>
            <a href="#" className="hover:text-blue-400 transition"><Github /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/publications" className="hover:text-blue-400 transition">Publications</Link></li>
            <li><Link to="/trials" className="hover:text-blue-400 transition">Clinical Trials</Link></li>
            <li><Link to="/forum" className="hover:text-blue-400 transition">Community Forum</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>support@medresearch.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>New Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-blue-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-blue-300 font-semibold">MedResearch</span>. All rights reserved.
      </div>
    </footer>
  );
}
