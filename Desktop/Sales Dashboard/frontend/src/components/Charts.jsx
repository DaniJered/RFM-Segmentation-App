import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  XAxis as ScatterXAxis,
  YAxis as ScatterYAxis,
  AreaChart,
  Area
} from 'recharts';

// Global segment color config for visual alignment across all charts
const segmentColors = {
  'Champion': '#00ff66',
  'Loyal': '#00f0ff',
  'Potential Loyal': '#bf00ff',
  'At Risk': '#f97316',
  'Lost': '#ff2d55',
  'Others': '#8e8e93'
};

// 1. Futuristic Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-white/10 bg-cybercard/95 p-3 font-mono text-[10px] text-white shadow-glass backdrop-blur-md">
        {data.customer_id && (
          <p className="border-b border-white/5 pb-1.5 font-orbitron font-bold text-cybercyan mb-1.5">
            ID: {data.customer_id}
          </p>
        )}
        {data.segment && (
          <p className="flex items-center gap-1.5 mb-1 text-cybermuted">
            Segment: 
            <span style={{ color: segmentColors[data.segment] || '#fff' }} className="font-bold">
              {data.segment}
            </span>
          </p>
        )}
        {payload.map((item, idx) => (
          <p key={idx} className="flex justify-between gap-4 mt-0.5">
            <span className="text-cybermuted">{item.name}:</span>
            <span className="font-bold" style={{ color: item.color || '#fff' }}>
              {item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 2. Animated Cyber Line decoration for Hero page
export function AnimatedHeroLine() {
  const waveData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    value: 30 + Math.sin(i * 0.8) * 15 + i * 2,
  }));

  return (
    <div className="w-full h-full relative opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={waveData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="heroGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" vertical={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff2d55"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#heroGlow)"
            dot={{ r: 2, stroke: '#00f0ff', strokeWidth: 1, fill: '#0a0a0a' }}
            activeDot={{ r: 6, stroke: '#ff2d55', strokeWidth: 2, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Segment Volume Distribution Bar Chart
export function SegmentBarChart({ data }) {
  // Sort data so defined main segments order is consistent in visual layouts
  const order = ["Champion", "Loyal", "Potential Loyal", "At Risk", "Lost", "Others"];
  const sortedData = [...data].sort((a, b) => order.indexOf(a.segment) - order.indexOf(b.segment));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis
            dataKey="segment"
            stroke="rgba(255,255,255,0.3)"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            fontFamily="Space Mono"
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            fontFamily="Space Mono"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="count" name="Customers" radius={[4, 4, 0, 0]}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={segmentColors[entry.segment] || '#8e8e93'}
                fillOpacity={0.7}
                stroke={segmentColors[entry.segment] || '#8e8e93'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. Frequency vs Monetary Clustering Scatter Plot
export function RFMScatterPlot({ data }) {
  // Format dataset properly for scattering
  const scatterData = data.map((item) => ({
    x: Number(item.frequency),
    y: Number(item.monetary),
    customer_id: item.customer_id,
    segment: item.segment,
    recency: item.recency_days
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <ScatterXAxis
            type="number"
            dataKey="x"
            name="Frequency"
            stroke="rgba(255,255,255,0.3)"
            fontSize={9}
            fontFamily="Space Mono"
            tickLine={false}
            axisLine={false}
            label={{ value: 'Order Frequency (count)', position: 'bottom', fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'Space Mono', offset: -2 }}
          />
          <ScatterYAxis
            type="number"
            dataKey="y"
            name="Monetary"
            stroke="rgba(255,255,255,0.3)"
            fontSize={9}
            fontFamily="Space Mono"
            tickLine={false}
            axisLine={false}
            label={{ value: 'Monetary Spend ($)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'Space Mono', offset: 5 }}
          />
          <ZAxis type="number" dataKey="recency" range={[35, 180]} name="Recency (days)" />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
          <Scatter data={scatterData} name="Customers">
            {scatterData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={segmentColors[entry.segment] || '#8e8e93'}
                fillOpacity={0.6}
                stroke={segmentColors[entry.segment] || '#8e8e93'}
                strokeWidth={1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
