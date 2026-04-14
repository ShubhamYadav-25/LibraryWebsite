import { BookOpen } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold">LibraryMS</span>
        </div>
        <p className="text-gray-400 mb-8">
          Empowering educational institutions with smart library management solutions
        </p>
        <div className="flex justify-center space-x-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;