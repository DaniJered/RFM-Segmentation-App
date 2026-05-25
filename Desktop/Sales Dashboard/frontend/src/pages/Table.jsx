import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Search, ArrowLeft, ArrowRight, Table as TableIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api';

const segmentBadgeStyles = {
  'Champion': 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
  'Loyal': 'bg-cybercyan/5 text-cybercyan border-cybercyan/20 shadow-[0_0_8px_rgba(0,240,255,0.15)]',
  'Potential Loyal': 'bg-purple-500/5 text-purple-400 border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.15)]',
  'At Risk': 'bg-orange-500/5 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.15)]',
  'Lost': 'bg-cyberpink/5 text-cyberpink border-cyberpink/20 shadow-[0_0_8px_rgba(255,45,85,0.15)]',
  'Others': 'bg-cybermuted/5 text-cybermuted border-cybermuted/20'
};

export default function Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/api/results');
      setData(response.data);
      setCurrentPage(1); // Reset page to 1 on fresh reload
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load database logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Filter dataset by search query
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.trim().toLowerCase();
    return data.filter(item => item.customer_id.toLowerCase().includes(query));
  }, [data, search]);

  // Compute pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cybercyan animate-spin" />
          <span className="font-mono text-xs text-cybermuted uppercase tracking-widest">
            Reading SQLite registers...
          </span>
        </div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 cyber-grid">
        <div className="max-w-md w-full glass-panel p-8 text-center border-cyberpink/20">
          <TableIcon className="w-12 h-12 text-cyberpink mx-auto mb-4 animate-bounce" />
          <h3 className="font-orbitron text-md font-bold tracking-wider text-white uppercase">
            Empty Registers
          </h3>
          <p className="mt-2 font-mono text-[10px] text-cybermuted leading-relaxed">
            // No customer rows found in the SQLite database. Uplink a transaction log history file to populate the spreadsheet registers.
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <h2 className="font-orbitron text-xl font-black tracking-wider text-white uppercase">
            CUSTOMER DATABASE
          </h2>
          <p className="font-mono text-[10px] text-cybermuted mt-1 uppercase">
            // INTERACTIVE DATAFRAME VIEWING SYSTEM
          </p>
        </div>
        <button 
          onClick={fetchResults}
          className="flex items-center gap-1.5 font-mono text-[10px] text-cybercyan bg-cybercyan/5 border border-cybercyan/20 px-3 py-1.5 rounded hover:bg-cybercyan/10 hover:border-cybercyan transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          SYNC REGISTERS
        </button>
      </div>

      {/* Grid Controls (Search + Info) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        
        {/* Futuristic Search Field */}
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cybermuted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by customer ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 font-mono text-xs text-white placeholder-cybermuted focus:outline-none focus:border-cybercyan focus:shadow-cyanglow transition-all duration-300"
          />
        </div>

        {/* Row telemetry indicators */}
        <div className="font-mono text-[10px] text-cybermuted">
          Showing <span className="font-bold text-white">{Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}-{Math.min(filteredData.length, currentPage * rowsPerPage)}</span> of <span className="font-bold text-cybercyan">{filteredData.length}</span> registers
        </div>

      </div>

      {/* Table Panel */}
      <div className="glass-panel overflow-hidden border border-white/5 shadow-glass rounded-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] font-orbitron text-[9px] font-bold tracking-widest text-cybermuted uppercase">
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-4 py-4 text-center">Recency (days)</th>
                <th className="px-4 py-4 text-center">Frequency (orders)</th>
                <th className="px-4 py-4 text-right">Monetary Spend</th>
                <th className="px-3 py-4 text-center">R Score</th>
                <th className="px-3 py-4 text-center">F Score</th>
                <th className="px-3 py-4 text-center">M Score</th>
                <th className="px-6 py-4 text-center">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] font-mono text-xs text-cybermuted">
              {paginatedData.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-white/[0.02] hover:text-white transition-all duration-150 group"
                >
                  <td className="px-6 py-3 font-semibold text-white group-hover:text-cybercyan transition-colors">
                    {row.customer_id}
                  </td>
                  <td className="px-4 py-3 text-center">{row.recency_days}d</td>
                  <td className="px-4 py-3 text-center">{row.frequency}x</td>
                  <td className="px-4 py-3 text-right font-semibold text-white">
                    ${row.monetary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block rounded bg-white/5 border border-white/10 w-6 py-0.5 text-center font-bold font-orbitron text-[10px] text-white">
                      {row.r_score}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block rounded bg-white/5 border border-white/10 w-6 py-0.5 text-center font-bold font-orbitron text-[10px] text-white">
                      {row.f_score}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block rounded bg-white/5 border border-white/10 w-6 py-0.5 text-center font-bold font-orbitron text-[10px] text-white">
                      {row.m_score}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block border rounded-full px-2.5 py-0.5 text-[10px] font-orbitron font-bold uppercase tracking-wider ${
                      segmentBadgeStyles[row.segment] || segmentBadgeStyles['Others']
                    }`}>
                      {row.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border border-white/5 bg-black/20 rounded-xl px-6 py-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 font-orbitron font-semibold text-[10px] tracking-widest uppercase border border-white/10 bg-white/5 text-white px-3 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <span className="font-mono text-[10px] text-cybermuted">
            Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-cybercyan">{totalPages}</span>
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 font-orbitron font-semibold text-[10px] tracking-widest uppercase border border-white/10 bg-white/5 text-white px-3 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 active:scale-95 transition-all"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
