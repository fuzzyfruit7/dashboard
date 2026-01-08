import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Activity, TrendingUp } from 'lucide-react';

const generateRMSKurtosisData = (days = 7) => {
  const data = [];
  for (let i = 0; i < days * 24; i++) {
    data.push({
      time: i,
      hour: `Day ${Math.floor(i/24)+1} ${i%24}:00`,
      rms: 2.5 + Math.sin(i / 12) * 0.5 + Math.random() * 0.3,
      kurtosis: 3 + Math.cos(i / 8) * 0.5 + Math.random() * 0.2,
      crestFactor: 3.5 + Math.sin(i / 10) * 0.4 + Math.random() * 0.2,
      peakValue: 8 + Math.sin(i / 15) * 1.5 + Math.random() * 0.5
    });
  }
  return data;
};

const generateFrequencyBands = () => [
  { band: '10-100 Hz', rms: 1.2, label: 'Low Freq' },
  { band: '100-500 Hz', rms: 2.8, label: 'Mid Freq' },
  { band: '500-1k Hz', rms: 1.5, label: 'High Freq' },
  { band: '1k-5k Hz', rms: 0.8, label: 'Very High' }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function RMSKurtosis() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(7);
  
  const statsData = generateRMSKurtosisData(timeRange);
  const frequencyBands = generateFrequencyBands();

  const currentRMS = statsData[statsData.length - 1].rms.toFixed(2);
  const currentKurtosis = statsData[statsData.length - 1].kurtosis.toFixed(2);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">RMS & Kurtosis Analysis</h1>
            <p className="text-slate-400">Statistical vibration analysis for fault detection</p>
          </div>
          <div className="flex gap-2">
            {[1, 7, 30].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  timeRange === days 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {days === 1 ? '24h' : `${days}d`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Current Values */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
            <Activity size={20} />
            Current Values
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
              <p className="text-slate-400 text-xs mb-1">RMS Velocity</p>
              <p className="text-white font-bold text-3xl">{currentRMS}</p>
              <p className="text-xs text-slate-400 mt-1">mm/s</p>
              <p className="text-green-400 text-xs mt-2">✓ Within normal range</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
              <p className="text-slate-400 text-xs mb-1">Kurtosis</p>
              <p className="text-white font-bold text-3xl">{currentKurtosis}</p>
              <p className="text-xs text-slate-400 mt-1">dimensionless</p>
              <p className="text-green-400 text-xs mt-2">✓ Normal distribution</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs mb-1">Status</p>
              <p className="text-green-400 font-bold text-xl">HEALTHY</p>
              <p className="text-xs text-slate-400 mt-2">No anomalies detected</p>
            </div>
          </div>
        </Card>

        {/* RMS & Kurtosis Trends */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">RMS & Kurtosis Trends</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  tick={{fill: '#94a3b8'}}
                  tickFormatter={(value) => Math.floor(value/24) === 0 ? `${value}h` : `D${Math.floor(value/24)+1}`}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'RMS (mm/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Kurtosis', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                  labelFormatter={(value) => `Hour ${value}`}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rms" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                  strokeWidth={2}
                  name="RMS"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="kurtosis" 
                  stroke="#8b5cf6" 
                  fill="transparent"
                  strokeWidth={2}
                  name="Kurtosis"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Frequency Band RMS */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">RMS by Frequency Band</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyBands}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{fill: '#94a3b8'}} />
                <YAxis tick={{fill: '#94a3b8'}} label={{ value: 'RMS (mm/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="rms" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Additional Parameters */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Additional Statistical Parameters</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData.slice(-48)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  tick={{fill: '#94a3b8'}}
                  tickFormatter={(value) => `${value%24}h`}
                />
                <YAxis tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Legend />
                <Line type="monotone" dataKey="crestFactor" stroke="#22c55e" strokeWidth={2} name="Crest Factor" />
                <Line type="monotone" dataKey="peakValue" stroke="#f59e0b" strokeWidth={2} name="Peak (mm/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Statistical Summary */}
        <Card className="lg:col-span-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Statistical Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Mean RMS</p>
              <p className="text-white font-bold text-2xl">2.68</p>
              <p className="text-xs text-slate-400 mt-1">mm/s</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Std Dev RMS</p>
              <p className="text-white font-bold text-2xl">0.42</p>
              <p className="text-xs text-slate-400 mt-1">mm/s</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Mean Kurtosis</p>
              <p className="text-white font-bold text-2xl">3.05</p>
              <p className="text-xs text-slate-400 mt-1">-</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Std Dev Kurtosis</p>
              <p className="text-white font-bold text-2xl">0.38</p>
              <p className="text-xs text-slate-400 mt-1">-</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Peak RMS</p>
              <p className="text-orange-400 font-bold text-2xl">3.42</p>
              <p className="text-xs text-slate-400 mt-1">mm/s</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Peak Kurtosis</p>
              <p className="text-orange-400 font-bold text-2xl">3.78</p>
              <p className="text-xs text-slate-400 mt-1">-</p>
            </div>
          </div>
        </Card>

        {/* Interpretation Guide */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Interpretation Guide</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-white font-semibold mb-1">RMS (Root Mean Square)</p>
              <p className="text-slate-300 text-xs">Overall vibration energy. Increases indicate growing faults.</p>
              <p className="text-green-400 text-xs mt-2">Normal: 0.5-3.0 mm/s</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-white font-semibold mb-1">Kurtosis</p>
              <p className="text-slate-300 text-xs">Distribution shape. Values &gt;4 indicate impulsive faults (bearings).</p>
              <p className="text-green-400 text-xs mt-2">Normal: 2.5-3.5</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-white font-semibold mb-1">Crest Factor</p>
              <p className="text-slate-300 text-xs">Peak to RMS ratio. High values suggest bearing defects.</p>
              <p className="text-green-400 text-xs mt-2">Normal: 2.5-4.0</p>
            </div>
          </div>
        </Card>

        {/* Alerts & Recommendations */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Status & Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
              <TrendingUp size={20} className="text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-200">All parameters normal</p>
                <p className="text-xs text-slate-300 mt-1">RMS and Kurtosis within expected ranges</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <Activity size={20} className="text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-200">Monitoring active</p>
                <p className="text-xs text-slate-300 mt-1">Continuous statistical tracking enabled</p>
              </div>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-white font-semibold text-sm mb-2">Recommendations:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• Continue normal operation</li>
                <li>• Monitor kurtosis for sudden spikes</li>
                <li>• Review trends weekly</li>
                <li>• Alert threshold: RMS &gt; 4.0 mm/s</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
