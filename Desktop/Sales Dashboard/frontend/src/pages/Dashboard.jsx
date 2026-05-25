import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, ShieldAlert, DollarSign, Database, Plus, RefreshCw } from 'lucide-react';
import API from '../api';
import MetricCard from '../components/MetricCard';
import { SegmentBarChart, RFMScatterPlot } from '../components/Charts';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/api/results');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load database logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute all metrics entirely from the GET /api/results array in real-time
  const computedMetrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalCustomers: 0,
        championPct: 0,
        atRiskPct: 0,
        top20RevenuePct: 0,
        segmentCounts: []
      };
    }

    const total = data.length;

    // Segment counts evaluation
    const counts = {
      'Champion': 0,
      'Loyal': 0,
      'Potential Loyal': 0,
      'At Risk': 0,
      'Lost': 0,
      'Others': 0
    };
    
    let totalRevenue = 0;
    data.forEach(item => {
      totalRevenue += item.monetary;
      if (counts[item.segment] !== undefined) {
        counts[item.segment]++;
      } else {
        counts['Others']++;
      }
    });

    const championPct = ((counts['Champion'] / total) * 100).toFixed(1);
    const atRiskPct = ((counts['At Risk'] / total) * 100).toFixed(1);

    // Top 20% revenue calculations
    const sortedMonetary = [...data].map(c => c.monetary).sort((a, b) => b - a);
    const top20Count = Math.max(1, Math.floor(total * 0.2));
    const top20Revenue = sortedMonetary.slice(0, top20Count).reduce((sum, val) => sum + val, 0);
    const top20RevenuePct = totalRevenue > 0 ? ((top20Revenue / totalRevenue) * 100).toFixed(1) : 0;

    // Format segments array for Recharts Bar Chart
    const barChartData = Object.keys(counts).map(seg => ({
      segment: seg,
      count: counts[seg]
    }));

    return {
      totalCustomers: total,
      championPct,
      atRiskPct,
      top20RevenuePct,
      segmentCounts: barChartData
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cybercyan animate-spin" />
          <span className="font-mono text-xs text-cybermuted uppercase tracking-widest">
            Compiling dashboard telemetry...
          </span>
        </div>
      </div>
    );
  }

  // Handle empty database state gracefully with a high-tech call to action
  if (!loading && data.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 cyber-grid">
        <div className="max-w-md w-full glass-panel p-8 text-center border-cyberpink/20">
          <Database className="w-12 h-12 text-cyberpink mx-auto mb-4 animate-bounce" />
          <h3 className="font-orbitron text-md font-bold tracking-wider text-white uppercase">
            No Database Telemetry
          </h3>
          <p className="mt-2 font-mono text-[10px] text-cybermuted leading-relaxed">
            // The local SQLite system reports zero customer clusters. Feed transaction records into the uplink portal to calculate initial segment models.
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
      
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-8">
        <div>
          <h2 className="font-orbitron text-xl font-black tracking-wider text-white uppercase">
            REAL-TIME RFM MODEL
          </h2>
          <p className="font-mono text-[10px] text-cybermuted mt-1 uppercase">
            // TELEMETRY SUMMARY COMPILED FROM SQLite DATABASE
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 font-mono text-[10px] text-cybercyan bg-cybercyan/5 border border-cybercyan/20 px-3 py-1.5 rounded hover:bg-cybercyan/10 hover:border-cybercyan transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Customers */}
        <MetricCard
          title="Total Customers"
          value={computedMetrics.totalCustomers.toLocaleString()}
          subtext="Indexed customer profiles"
          icon={Users}
        />

        {/* Champion % */}
        <MetricCard
          title="Champions Tier"
          value={`${computedMetrics.championPct}%`}
          subtext="Highest scoring cluster"
          isPink={true}
          icon={Award}
        />

        {/* At-Risk % */}
        <MetricCard
          title="At-Risk Customers"
          value={`${computedMetrics.atRiskPct}%`}
          subtext="Imminent churn warnings"
          isPink={true}
          icon={ShieldAlert}
        />

        {/* Revenue Top 20% */}
        <MetricCard
          title="Top 20% Spend Impact"
          value={`${computedMetrics.top20RevenuePct}%`}
          subtext="Cumulative monetary share"
          icon={DollarSign}
        />

      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bar Chart Panel */}
        <div className="lg:col-span-5 glass-panel p-6 min-h-[380px] flex flex-col justify-between">
          <div className="border-b border-white/5 pb-2 mb-4">
            <h4 className="font-orbitron text-xs font-bold tracking-widest text-cybercyan uppercase">
              Segment Distributions
            </h4>
            <span className="font-mono text-[9px] text-cybermuted uppercase">// volume headcount per cohort</span>
          </div>
          <div className="flex-grow w-full h-[280px]">
            <SegmentBarChart data={computedMetrics.segmentCounts} />
          </div>
        </div>

        {/* Scatter Plot Panel */}
        <div className="lg:col-span-7 glass-panel p-6 min-h-[380px] flex flex-col justify-between">
          <div className="border-b border-white/5 pb-2 mb-4">
            <h4 className="font-orbitron text-xs font-bold tracking-widest text-cyberpink uppercase">
              Frequency vs Monetary Matrix
            </h4>
            <span className="font-mono text-[9px] text-cybermuted uppercase">// purchase iteration vs cumulative spending clusters</span>
          </div>
          <div className="flex-grow w-full h-[280px]">
            <RFMScatterPlot data={data} />
          </div>
        </div>

      </div>

    </div>
  );
}
