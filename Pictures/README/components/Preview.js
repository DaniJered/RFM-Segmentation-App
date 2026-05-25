function Preview({ markdown, isGenerating, onSave, isSaving }) {
    const previewRef = React.useRef(null);
    const [htmlContent, setHtmlContent] = React.useState('');

    // Auto-scroll to bottom during generation
    React.useEffect(() => {
        if (isGenerating && previewRef.current) {
            previewRef.current.scrollTop = previewRef.current.scrollHeight;
        }
    }, [markdown, isGenerating]);

    // Parse markdown (using marked library from CDN)
    React.useEffect(() => {
        try {
            if (window.marked) {
                // Configure marked for safer rendering
                window.marked.setOptions({
                    breaks: true,
                    gfm: true
                });
                setHtmlContent(window.marked.parse(markdown || ''));
            } else {
                setHtmlContent('<p class="text-gray-500">Loading parser...</p>');
            }
        } catch (error) {
            console.error('Markdown parsing error:', error);
        }
    }, [markdown]);

    return (
        <div className="h-full flex flex-col p-6 z-10 relative mt-20" data-name="preview" data-file="components/Preview.js">
            <div className="glass-panel h-full flex flex-col overflow-hidden relative">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between border-b border-white/10 p-4 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-sm font-mono text-gray-400">README.md</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onSave}
                            disabled={!markdown || isSaving || isGenerating}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${!markdown || isGenerating ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/30 border border-[var(--accent-cyan)]/30'}`}
                            title="Save to database"
                        >
                            {isSaving ? (
                                <><div className="icon-loader animate-spin text-sm"></div> Saving...</>
                            ) : (
                                <><div className="icon-save text-sm"></div> Save to Library</>
                            )}
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-1"></div>

                        <button 
                            disabled={!markdown}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="icon-copy text-sm"></div>
                        </button>
                        <button 
                            disabled={!markdown}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="icon-file-download text-sm"></div>
                        </button>
                    </div>
                </div>

                {/* Rendered Content Area */}
                <div 
                    ref={previewRef}
                    className="flex-1 overflow-y-auto p-8 relative scroll-smooth"
                >
                    {!markdown && !isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                            <div className="icon-book-open text-6xl mb-4"></div>
                            <p className="font-mono text-sm">Preview will appear here</p>
                        </div>
                    ) : (
                        <div 
                            className="markdown-body text-left w-full max-w-3xl mx-auto"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    )}
                    
                    {/* Blinking Cursor during generation */}
                    {isGenerating && (
                        <div className="inline-block w-2 h-5 bg-[var(--accent-cyan)] animate-pulse ml-1 align-middle shadow-[0_0_8px_var(--accent-cyan)]"></div>
                    )}
                </div>
                
                {/* Status bar */}
                <div className="py-2 px-4 border-t border-white/10 bg-black/30 flex justify-between items-center text-xs font-mono text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="icon-check text-green-400"></div>
                        <span>Rendered Preview</span>
                    </div>
                    <div>
                        {markdown.length} bytes
                    </div>
                </div>
            </div>
        </div>
    );
}