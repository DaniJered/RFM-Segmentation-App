import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Upload, BarChart3, PieChart, Users, Database } from 'lucide-react';
import API from '../api';

export default function Navbar() {
  const [dbStatus, setDbStatus] = useState('CHECKING'); // CHECKING, ONLINE, OFFLINE

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Send a quick request to the metrics endpoint to check backend health
        await API.get('/api/metrics');
        setDbStatus('ONLINE');
      } catch (error) {
        setDbStatus('OFFLINE');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000); // Check status every 15s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Portal', icon: Activity, exact: true },
    { path: '/upload', label: 'Uplink', icon: Upload },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/segments', label: 'Segments', icon: PieChart },
    { path: '/customers', label: 'Database', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-cyberbg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding & Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyberpink/30 bg-cyberpink/5 shadow-pinkglow transition-all duration-300 group-hover:scale-105 group-hover:shadow-pinkglowlg">
            <Database className="h-5 w-5 text-cyberpink" />
          </div>
          <div>
            <span className="font-orbitron text-sm font-black tracking-wider text-white group-hover:text-cyberpink transition-colors">
              RFM SEGMENTATION
            </span>
            <span className="block font-mono text-[9px] tracking-widest text-cybermuted">
              // TELEMETRY PORTAL
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 font-orbitron text-xs font-semibold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-cybercyan/10 text-cybercyan border border-cybercyan/20 shadow-cyanglow'
                      : 'text-cybermuted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Real-time Connection Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/40 px-3 py-1.5 font-mono text-[10px]">
            <span className="text-cybermuted">API:</span>
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  dbStatus === 'ONLINE'
                    ? 'bg-emerald-400 beacon-glow'
                    : dbStatus === 'OFFLINE'
                    ? 'bg-cyberpink beacon-glow'
                    : 'bg-amber-400 beacon-glow'
                }`}
              />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  dbStatus === 'ONLINE'
                    ? 'bg-emerald-400'
                    : dbStatus === 'OFFLINE'
                    ? 'bg-cyberpink'
                    : 'bg-amber-400'
                }`}
              />
            </div>
            <span
              className={`font-bold uppercase tracking-wider ${
                dbStatus === 'ONLINE'
                  ? 'text-emerald-400'
                  : dbStatus === 'OFFLINE'
                  ? 'text-cyberpink'
                  : 'text-amber-400'
              }`}
            >
              {dbStatus}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
