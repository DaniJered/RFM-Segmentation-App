import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, Loader2, AlertCircle, CheckCircle, Terminal } from 'lucide-react';
import API from '../api';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const processFile = async (selectedFile) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError("Unsupported file format. Please upload a structured .csv database file.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setLoading(true);
    setLogs([]);

    // Telemetry log simulation
    addLog("Uplink stream opened. Receiving CSV data payload...");
    addLog(`Filename: ${selectedFile.name} | Size: ${(selectedFile.size / 1024).toFixed(2)} KB`);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setTimeout(() => addLog("Parsing transaction fields (customer_id, order_date, order_amount)..."), 600);
      setTimeout(() => addLog("Dropping existing SQLite records. Initializing fresh table structure..."), 1200);
      setTimeout(() => addLog("Evaluating quintiles via pandas statistical bin-mapping..."), 1800);
      setTimeout(() => addLog("Executing final case segment binds and committing transactions..."), 2400);

      const response = await API.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTimeout(() => {
        addLog("Database sync successful.");
        addLog(`Processed ${response.data.total_customers} customer aggregates.`);
        addLog(`Calculated Top 20% Revenue: ${response.data.top20_revenue_pct}%`);
        
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 800);
      }, 3000);

    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.error || err.message || "Uplink server error.";
      setError(errMsg);
      addLog(`FATAL ERROR: ${errMsg}`);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 cyber-grid">
      <div className="w-full max-w-2xl">
        
        {/* Main Panel */}
        <div className="glass-panel p-8 relative overflow-hidden glow-scan">
          
          <div className="border-b border-white/5 pb-4 mb-6">
            <h2 className="font-orbitron text-xl font-black tracking-wider text-white">
              DATA TELEMETRY UPLINK
            </h2>
            <p className="font-mono text-[10px] text-cybermuted mt-1 uppercase">
              // DROP A TRANSACTION HISTOGRAM TO CALCULATE RFM CLUSTERS
            </p>
          </div>

          {/* Form Zone */}
          {!loading ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-cybercyan bg-cybercyan/5 shadow-cyanglow'
                  : 'border-white/10 bg-black/20 hover:border-cyberpink/40 hover:bg-cyberpink/5'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleChange}
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className={`p-4 rounded-xl border border-white/5 bg-white/5 mb-4 text-cybermuted transition-colors ${
                isDragActive ? 'text-cybercyan border-cybercyan/20' : 'group-hover:text-cyberpink'
              }`}>
                <UploadCloud className="w-10 h-10" />
              </div>

              <span className="font-orbitron text-sm font-bold text-white tracking-wide">
                Drag & Drop CSV File here
              </span>
              <span className="font-mono text-[10px] text-cybermuted mt-2 block">
                or click to browse local storage
              </span>
              <span className="mt-4 rounded-full border border-white/5 bg-black/35 px-3 py-1 font-mono text-[9px] text-cybermuted">
                Requires: customer_id, order_date, order_amount
              </span>
            </div>
          ) : (
            /* Uploading & Calculating telemetric display */
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative mb-6">
                <Loader2 className="w-12 h-12 text-cyberpink animate-spin drop-shadow-[0_0_8px_rgba(255,45,85,0.4)]" />
                <div className="absolute inset-0 bg-cyberpink/10 rounded-full blur-xl pointer-events-none" />
              </div>
              <span className="font-orbitron text-sm font-bold text-white tracking-widest animate-pulse">
                SEGMENTING DATA CLUSTERS...
              </span>
              
              {/* Virtual terminal shell logs */}
              <div className="w-full mt-8 bg-black/80 rounded-lg border border-white/5 p-4 font-mono text-[10px] text-emerald-400 text-left h-44 overflow-y-auto scrollbar">
                <div className="flex items-center gap-2 border-b border-white/5 pb-1.5 mb-2 text-cybermuted font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>PROCESS SYSTEM DIAGNOSTIC</span>
                </div>
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-1 leading-normal">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Blocks */}
          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-cyberpink/20 bg-cyberpink/5 p-4 text-cyberpink">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="font-mono text-xs">
                <span className="font-bold">UPLINK CRASHED: </span>
                {error}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
