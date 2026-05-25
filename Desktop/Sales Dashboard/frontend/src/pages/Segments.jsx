import React, { useState, useEffect } from 'react';
import { RefreshCw, LayoutGrid, Database, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api';
import SegmentCard from '../components/SegmentCard';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/api/segments');
      setSegments(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load segment profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyberpink animate-spin" />
          <span className="font-mono text-xs text-cybermuted uppercase tracking-widest">
            Mapping cohort metrics...
          </span>
        </div>
      </div>
    );
  }

  // If no transactions have been uploaded yet, direct them to upload a CSV
  const hasData = segments.some(s => s.count > 0);
  if (!loading && !hasData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 cyber-grid">
        <div className="max-w-md w-full glass-panel p-8 text-center border-cybercyan/20">
          <LayoutGrid className="w-12 h-12 text-cybercyan mx-auto mb-4 animate-pulse" />
          <h3 className="font-orbitron text-md font-bold tracking-wider text-white uppercase">
            No Cohort Profiles
          </h3>
          <p className="mt-2 font-mono text-[10px] text-cybermuted leading-relaxed">
            // No customer segments have been calculated. Uplink a transaction history dataset to compile our statistical profiles.
          </p>
          <Link
            to="/upload"
            className="mt-6 inline-flex items-center gap-2 font-orbitron font-bold text-xs tracking-widest text-white uppercase px-5 py-3 rounded-lg bg-cyberpink border border-cyberpink shadow-pinkglow hover:shadow-pinkglowlg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            Uplink CSV Data
          </Link>
        </div>
      </div>
    );
  }

  // Pre-sort segments to follow our intuitive CRM priority order
  const order = ["Champion", "Loyal", "Potential Loyal", "At Risk", "Lost", "Others"];
  const sortedSegments = [...segments].sort((a, b) => order.indexOf(a.segment) - order.indexOf(b.segment));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-8">
        <div>
          <h2 className="font-orbitron text-xl font-black tracking-wider text-white uppercase">
            CUSTOMER COHORTS
          </h2>
          <p className="font-mono text-[10px] text-cybermuted mt-1 uppercase">
            // COMPREHENSIVE CRM PROFILES & AGGREGATE SCORES
          </p>
        </div>
        <button 
          onClick={fetchSegments}
          className="flex items-center gap-1.5 font-mono text-[10px] text-cyberpink bg-cyberpink/5 border border-cyberpink/20 px-3 py-1.5 rounded hover:bg-cyberpink/10 hover:border-cyberpink transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          SYNC COHORTS
        </button>
      </div>

      {/* Grid of Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedSegments.map((seg) => (
          <SegmentCard
            key={seg.segment}
            segment={seg.segment}
            count={seg.count}
            avgRecency={seg.avg_recency}
            avgFrequency={seg.avg_frequency}
            avgMonetary={seg.avg_monetary}
          />
        ))}
      </div>

    </div>
  );
}
