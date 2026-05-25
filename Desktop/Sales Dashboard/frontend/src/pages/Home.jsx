import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ShieldAlert, Cpu, BarChart } from 'lucide-react';
import { AnimatedHeroLine } from '../components/Charts';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 overflow-hidden cyber-grid">
      
      {/* Background radial gradient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyberpink/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        
        {/* Futuristic top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyberpink/35 bg-cyberpink/5 font-mono text-[10px] text-cyberpink uppercase tracking-widest mb-6 animate-pulse">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Telemetry Uplink Active</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white uppercase select-none">
          RFM CUSTOMER<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyberpink via-purple-500 to-cybercyan drop-shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            SEGMENTATION
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 max-w-2xl font-mono text-xs sm:text-sm text-cybermuted leading-relaxed tracking-wide">
          // Run advanced customer aggregation metrics. Parse purchase Recency, Frequency, and Monetary clusters. 
          Deploy custom retention algorithms to maximize lifetime value and filter high-conversion audiences.
        </p>

        {/* Futuristic CTA Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 font-orbitron font-bold text-xs tracking-widest text-white uppercase px-6 py-3.5 rounded-lg bg-cyberpink border border-cyberpink shadow-pinkglow hover:shadow-pinkglowlg hover:bg-cyberpink/90 hover:scale-105 transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-white" />
            Initialize Telemetry
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-orbitron font-bold text-xs tracking-widest text-cybercyan uppercase px-6 py-3.5 rounded-lg bg-cybercyan/5 border border-cybercyan/20 hover:border-cybercyan hover:bg-cybercyan/10 hover:shadow-cyanglow hover:scale-105 transition-all duration-300"
          >
            <BarChart className="w-4 h-4" />
            View Live Metrics
          </Link>
        </div>

        {/* Animated Vector Chart Decoration */}
        <div className="mt-16 w-full max-w-4xl h-56 rounded-xl border border-white/5 bg-black/40 shadow-glass relative group p-4 overflow-hidden glow-scan">
          <div className="absolute top-3 left-4 font-mono text-[9px] text-cybermuted tracking-widest uppercase">
            // TELEMETRY_FLOW_VISUALIZER.EXE
          </div>
          <div className="absolute top-3 right-4 font-mono text-[9px] text-cybercyan tracking-widest uppercase flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cybercyan animate-ping" />
            LIVE SIMULATION
          </div>
          <div className="w-full h-full pt-6">
            <AnimatedHeroLine />
          </div>
        </div>

      </div>
    </div>
  );
}
