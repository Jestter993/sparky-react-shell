
import { Link } from "react-router-dom";

const LandingFooter = () => (
  <footer className="py-8 px-4 mt-16 bg-black text-white">
    <div className="max-w-4xl mx-auto text-center space-y-4">
      <div className="text-sm">
        © 2025 Adaptrix
      </div>
      
      <div className="flex justify-center items-center gap-2 text-sm">
        <a href="#" className="hover:text-gray-200 transition-colors">Privacy</a>
        <span>•</span>
        <a href="#" className="hover:text-gray-200 transition-colors">Terms</a>
        <span>•</span>
        <Link to="/contact" className="hover:text-gray-200 transition-colors">Contact</Link>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
