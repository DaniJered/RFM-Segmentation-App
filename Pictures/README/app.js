// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-space)] text-white">
          <div className="text-center p-8 glass-panel">
            <h1 className="text-2xl font-bold mb-4 text-red-400">System Error Detected</h1>
            <p className="text-gray-400 mb-6 font-mono text-sm">An anomaly occurred in the UI matrix.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
            >
              Reboot Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mock AI stream data
const mockReadmeStream = [
    "# Project Nebula 🚀\n\n",
    "![License](https://img.shields.io/badge/License-MIT-blue.svg) ",
    "![Version](https://img.shields.io/badge/Version-1.0.0-purple.svg)\n\n",
    "> A cinematic, futuristic AI SaaS platform for generating perfect documentation.\n\n",
    "## ✨ Features\n\n",
    "- 🌌 **Deep-Space Aesthetics**: Stunning glassmorphism UI.\n",
    "- ⚡ **Real-time Generation**: Watch your README stream in live.\n",
    "- 🧠 **AI-Powered Analysis**: Automatically detects your tech stack.\n\n",
    "## 🛠️ Tech Stack\n\n",
    "Built with modern tools for a seamless experience:\n",
    "- **React 18** for UI\n",
    "- **Tailwind CSS** for styling\n",
    "- **Lucide** for elegant icons\n\n",
    "## 🚀 Quick Start\n\n",
    "Clone the repository and install dependencies:\n\n",
    "```bash\n",
    "git clone https://github.com/example/nebula.git\n",
    "cd nebula\n",
    "npm install\n",
    "npm run dev\n",
    "```\n\n",
    "## 📄 License\n\n",
    "This project is licensed under the MIT License - see the LICENSE file for details."
];

function App() {
  const [inputText, setInputText] = React.useState('');
  const [markdown, setMarkdown] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [detectedTech, setDetectedTech] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  // Handle generation stream simulation
  const handleGenerate = () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setMarkdown(''); // Clear previous
    
    let currentChunkIndex = 0;
    
    const streamInterval = setInterval(() => {
        if (currentChunkIndex < mockReadmeStream.length) {
            setMarkdown(prev => prev + mockReadmeStream[currentChunkIndex]);
            currentChunkIndex++;
        } else {
            clearInterval(streamInterval);
            setIsGenerating(false);
        }
    }, 150); // Adjust speed for cinematic feel
  };

  const handleSave = async () => {
      if (!markdown) return;
      setIsSaving(true);
      
      try {
          const projectNameMatch = markdown.match(/^#\s+(.+)$/m);
          const projectName = projectNameMatch ? projectNameMatch[1] : 'Untitled Project';

          if (typeof trickleCreateObject === 'function') {
              await trickleCreateObject('saved_readme', {
                  projectName: projectName,
                  markdown: markdown,
                  techStack: detectedTech
              });
              showToast('README saved to database successfully!');
          } else {
              // Fallback if trickle database API is not loaded in environment yet
              console.log('Mock saving to DB...', { projectName, markdown, detectedTech });
              setTimeout(() => {
                  showToast('README saved successfully! (Simulation)');
              }, 800);
          }
      } catch (error) {
          console.error("Error saving README:", error);
          showToast('Failed to save README', 'error');
      } finally {
          setIsSaving(false);
      }
  };

  try {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden" data-name="app" data-file="app.js">
        <Background />
        <Navbar isGenerating={isGenerating} />
        
        {/* Toast Notification */}
        {toast && (
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl backdrop-blur-md border shadow-2xl flex items-center gap-3 transition-all animate-[fadeIn_0.3s_ease-out] ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/20 text-cyan-100'}`}>
                <div className={`text-lg ${toast.type === 'error' ? 'icon-circle-alert text-red-400' : 'icon-circle-check text-[var(--accent-cyan)]'}`}></div>
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        )}

        {/* Main Split Layout */}
        <div className="flex-1 flex w-full relative z-10">
            {/* Left Panel */}
            <div className="w-1/2 min-w-[500px]">
                <Workspace 
                    inputText={inputText} 
                    setInputText={setInputText}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    detectedTech={detectedTech}
                    setDetectedTech={setDetectedTech}
                />
            </div>
            
            {/* Right Panel */}
            <div className="w-1/2 min-w-[500px]">
                <Preview 
                    markdown={markdown}
                    isGenerating={isGenerating}
                    onSave={handleSave}
                    isSaving={isSaving}
                />
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);