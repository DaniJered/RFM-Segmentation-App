import React from 'react';

export default function MetricCard({ title, value, subtext, trend, isPink = false, icon: Icon }) {
  return (
    <div className={`glass-panel p-6 relative overflow-hidden group hover:scale-[1.02] ${
      isPink ? 'hover:border-cyberpink/35 hover:shadow-pinkglow' : 'hover:border-cybercyan/35 hover:shadow-cyanglow'
    }`}>
      {/* Dynamic ambient background glow overlay */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[50px] opacity-10 pointer-events-none transition-all duration-300 group-hover:scale-125 ${
        isPink ? 'bg-cyberpink' : 'bg-cybercyan'
      }`} />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="font-orbitron text-[10px] font-bold tracking-widest text-cybermuted uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg border border-white/5 bg-white/5 p-1.5 ${isPink ? 'text-cyberpink' : 'text-cybercyan'}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-orbitron text-3xl font-black tracking-tight transition-all duration-300 ${
          isPink 
            ? 'text-cyberpink drop-shadow-[0_0_8px_rgba(255,45,85,0.4)]' 
            : 'text-cybercyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]'
        }`}>
          {value}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-cybermuted border-t border-white/[0.03] pt-2">
        <span>{subtext}</span>
        {trend !== undefined && (
          <span className={`rounded-md px-1.5 py-0.5 border font-semibold ${
            trend >= 0 
              ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
              : 'bg-cyberpink/5 text-cyberpink border-cyberpink/20'
          }`}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
    </div>
  );
}
