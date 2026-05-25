function Workspace({ inputText, setInputText, onGenerate, isGenerating, detectedTech, setDetectedTech }) {
    const [activeTab, setActiveTab] = React.useState('describe');

    // Simple auto-detection simulation based on keywords
    React.useEffect(() => {
        const text = inputText.toLowerCase();
        const tech = [];
        if (text.includes('react')) tech.push('React');
        if (text.includes('node')) tech.push('Node.js');
        if (text.includes('tailwind')) tech.push('Tailwind CSS');
        if (text.includes('python')) tech.push('Python');
        if (text.includes('next')) tech.push('Next.js');
        if (text.includes('typescript')) tech.push('TypeScript');
        setDetectedTech(tech);
    }, [inputText, setDetectedTech]);

    return (
        <div className="h-full flex flex-col p-6 z-10 relative mt-20" data-name="workspace" data-file="components/Workspace.js">
            <div className="glass-panel h-full flex flex-col overflow-hidden relative group">
                
                {/* Animated Gradient Border (visible when focused/typing) */}
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${inputText.length > 0 && !isGenerating ? 'opacity-100 border-glow-active' : 'opacity-0'}`}></div>

                {/* Tabs */}
                <div className="flex items-center border-b border-white/10 p-4 relative z-10 bg-black/20">
                    <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setActiveTab('describe')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'describe' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <div className="icon-message-square text-base"></div>
                                Describe
                            </span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('code')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <div className="icon-file-code text-base"></div>
                                Raw Code
                            </span>
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative p-6 z-10 flex flex-col">
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeTab === 'describe' ? "Describe your project here...\n\ne.g., 'A cinematic AI SaaS platform built with React, Tailwind, and Node.js that generates perfect README files.'" : "Paste your project code or package.json here..."}
                        className="w-full h-full bg-transparent border-none outline-none text-gray-200 resize-none font-mono text-sm leading-loose placeholder-gray-600 focus:text-white transition-colors"
                        disabled={isGenerating}
                    />
                    
                    {/* Tech Chips */}
                    {detectedTech.length > 0 && (
                        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 animate-[fadeIn_0.5s_ease-out]">
                            {detectedTech.map(tech => (
                                <span key={tech} className="px-3 py-1 text-xs font-mono rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 backdrop-blur-md shadow-[0_0_10px_rgba(157,0,255,0.2)]">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="p-4 border-t border-white/10 bg-black/20 relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                        <div className="icon-info text-sm"></div>
                        <span>Shift + Enter to generate</span>
                    </div>
                    
                    <button 
                        onClick={onGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`relative overflow-hidden group px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isGenerating || !inputText.trim() ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10' : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="icon-loader animate-spin text-base"></div>
                                Generating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 relative z-10">
                                <div className="icon-wand-sparkles text-base"></div>
                                Generate README
                            </span>
                        )}
                        {/* Hover Gradient Effect */}
                        {!isGenerating && inputText.trim() && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}