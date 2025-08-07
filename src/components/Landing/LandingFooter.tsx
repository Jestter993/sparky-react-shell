const LandingFooter = () => (
  <footer className="py-8 px-4 mt-16 bg-slate-900 text-slate-300">
    <div className="max-w-4xl mx-auto text-center space-y-4">
      <div className="text-sm">
        © 2025 Adaptrix
      </div>
      
      <div className="flex justify-center items-center gap-2 text-sm">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <span>•</span>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <span>•</span>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
      
      <div className="text-xs italic text-slate-400 pt-2">
        Built with nuance by a solo founder.
      </div>
    </div>
  </footer>
);

export default LandingFooter;