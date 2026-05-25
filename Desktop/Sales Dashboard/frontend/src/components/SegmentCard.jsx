import React from 'react';
import { Award, ShieldAlert, Sparkles, Heart, AlertCircle, HelpCircle } from 'lucide-react';

const segmentConfigs = {
  'Champion': {
    color: '#00ff66',
    glowClass: 'shadow-[0_0_15px_rgba(0,255,102,0.35)] border-emerald-500/25',
    dotClass: 'bg-emerald-400',
    icon: Award,
    description: 'Best customers who order frequently, spent the most, and ordered very recently.',
  },
  'Loyal': {
    color: '#00f0ff',
    glowClass: 'shadow-[0_0_15px_rgba(0,240,255,0.35)] border-cyan-500/25',
    dotClass: 'bg-cybercyan',
    icon: Heart,
    description: 'High value customers who shop regularly and are responsive to campaigns.',
  },
  'Potential Loyal': {
    color: '#bf00ff',
    glowClass: 'shadow-[0_0_15px_rgba(191,0,255,0.35)] border-purple-500/25',
    dotClass: 'bg-purple-400',
    icon: Sparkles,
    description: 'Recent spenders with average frequency; ideal candidates for upselling programs.',
  },
  'At Risk': {
    color: '#f97316',
    glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.35)] border-orange-500/25',
    dotClass: 'bg-orange-500',
    icon: ShieldAlert,
    description: 'Used to buy frequently and spend high, but haven\'t ordered in a long time.',
  },
  'Lost': {
    color: '#ff2d55',
    glowClass: 'shadow-[0_0_15px_rgba(255,45,85,0.35)] border-pink-500/25',
    dotClass: 'bg-cyberpink',
    icon: AlertCircle,
    description: 'Lowest recency, frequency, and monetary scores. Likely churned entirely.',
  },
  'Others': {
    color: '#a0a0a0',
    glowClass: 'shadow-glass border-white/5',
    dotClass: 'bg-cybermuted',
    icon: HelpCircle,
    description: 'Unclassified mid-tier customers with hybrid score patterns.',
  }
};

export default function SegmentCard({ segment, count, avgRecency, avgFrequency, avgMonetary }) {
  const config = segmentConfigs[segment] || segmentConfigs['Others'];
  const Icon = config.icon;

  return (
    <div className={`glass-panel p-5 relative overflow-hidden group hover:scale-[1.01] border ${config.glowClass}`}>
      {/* Visual cyber accent lines */}
      <div 
        className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:w-2" 
        style={{ backgroundColor: config.color }} 
      />
      
      {/* Segment Header */}
      <div className="flex items-center justify-between pl-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 beacon-glow ${config.dotClass}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`} />
          </div>
          <h3 className="font-orbitron text-sm font-bold tracking-wider text-white">
            {segment}
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded font-mono text-[10px] text-cybermuted">
          <span>QTY:</span>
          <span className="font-bold text-white">{count}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 pl-2 font-sans text-[11px] text-cybermuted leading-relaxed min-h-[32px]">
        {config.description}
      </p>

      {/* Structured metrics grid */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.03] pt-4 pl-2 font-mono text-[10px]">
        
        {/* Average Recency */}
        <div className="rounded border border-white/5 bg-black/20 p-2 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-cybermuted mb-1">Avg Recency</span>
          <span className="font-orbitron font-bold text-white text-xs">
            {avgRecency !== undefined ? `${avgRecency}d` : 'N/A'}
          </span>
        </div>

        {/* Average Frequency */}
        <div className="rounded border border-white/5 bg-black/20 p-2 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-cybermuted mb-1">Avg Freq</span>
          <span className="font-orbitron font-bold text-white text-xs">
            {avgFrequency !== undefined ? `${avgFrequency}x` : 'N/A'}
          </span>
        </div>

        {/* Average Monetary */}
        <div className="rounded border border-white/5 bg-black/20 p-2 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-cybermuted mb-1">Avg Monetary</span>
          <span className="font-orbitron font-bold text-cybercyan text-xs">
            {avgMonetary !== undefined ? `$${avgMonetary.toLocaleString(undefined, {maximumFractionDigits: 1})}` : 'N/A'}
          </span>
        </div>

      </div>

      {/* Floating dynamic icon background decoration */}
      <div className="absolute -bottom-4 -right-4 text-white/[0.015] group-hover:text-white/[0.03] pointer-events-none transition-colors duration-300">
        <Icon className="w-20 h-20" />
      </div>
    </div>
  );
}
