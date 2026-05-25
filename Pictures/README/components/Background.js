function Background() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-space)]" data-name="background" data-file="components/Background.js">
            {/* Dark cosmic base */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-animated-nebula mix-blend-screen" style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            
            {/* Glowing Orbs */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[var(--accent-cyan)] blur-[120px] opacity-20 orb-1 mix-blend-screen"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[var(--accent-purple)] blur-[150px] opacity-20 orb-2 mix-blend-screen"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
    );
}