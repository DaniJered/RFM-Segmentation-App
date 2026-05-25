function Navbar({ isGenerating }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center" data-name="navbar" data-file="components/Navbar.js">
            <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl">
                <div className="relative flex items-center justify-center">
                    <div className="icon-wand-sparkles text-[var(--accent-cyan)] text-xl relative z-10"></div>
                    <div className="absolute inset-0 bg-[var(--accent-cyan)] blur-md opacity-50"></div>
                </div>
                <span className="font-bold text-white tracking-wide text-glow-cyan text-sm uppercase">README AI</span>
                
                {/* AI Status Orb */}
                <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-[var(--accent-purple)] animate-pulse' : 'bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]'}`}></div>
                    <span className="text-xs font-mono text-gray-400">{isGenerating ? 'AI Generating...' : 'System Ready'}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="glass-panel flex items-center px-4 py-2 rounded-2xl cursor-text hover:border-white/20 transition-colors">
                    <div className="icon-github text-gray-400 text-lg mr-2"></div>
                    <input 
                        type="text" 
                        placeholder="Import from GitHub URL..." 
                        className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-48 focus:w-64 transition-all duration-300 font-mono"
                    />
                    <div className="icon-arrow-right text-[var(--accent-cyan)] text-lg cursor-pointer hover:text-white ml-2"></div>
                </div>
                
                <button className="glass-panel w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-colors group">
                    <div className="icon-settings text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-500"></div>
                </button>
            </div>
        </nav>
    );
}