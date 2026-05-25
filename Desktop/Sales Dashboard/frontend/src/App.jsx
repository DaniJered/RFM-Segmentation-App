import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Segments from './pages/Segments';
import Table from './pages/Table';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col justify-between">
        
        {/* Top Sticky Sci-Fi Header */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/customers" element={<Table />} />
          </Routes>
        </main>

        {/* High-Tech Telemetry Footer */}
        <footer className="w-full border-t border-white/5 bg-black/60 backdrop-blur-md py-6 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-cybermuted">
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <span>SYSTEM: ONLINE</span>
              <span>|</span>
              <span>SECTOR: CRM-09</span>
              <span>|</span>
              <span>DB: SQLITE3</span>
              <span>|</span>
              <span>COORDS: RA 18h 36m</span>
            </div>
            <div className="text-center sm:text-right uppercase">
              // DEEP-SPACE CRM STATISTICAL OBSERVATORY // © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
