import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Thermometer, Calendar } from 'lucide-react';

const generateDetailedTemp = (days = 7) => {
  const data = [];
  let bearing = 65;
  let winding = 70;
  let ambient = 25;
  
  for (let i = 0; i < days * 24; i++) {
    bearing += (Math.random() - 0.5) * 2 + Math.sin(i / 12) * 3;
    winding += (Math.random() - 0.5) * 2 + Math.sin(i / 12) * 2.5;
    ambient = 25 + Math.sin(i / 24) * 3 + Math.random();
    
    data.push({
      time: i,
      hour: `Day ${Math.floor(i/24)+1} ${i%24}:00`,
      bearing: Number(Math.max(50, Math.min(85, bearing)).toFixed(1)),
      winding: Number(Math.max(55, Math.min(90, winding)).toFixed(1)),
      ambient: Number(ambient.toFixed(1))
    });
  }
  return data;
};

const generateTempDistribution = () => [
  { range: '50-55°C', bearing: 5, winding: 2 },
  { range: '55-60°C', bearing: 15, winding: 8 },
  { range: '60-65°C', bearing: 45, winding: 25 },
  { range: '65-70°C', bearing: 25, winding: 35 },
  { range: '70-75°C', bearing: 8, winding: 20 },
  { range: '75-80°C', bearing: 2, winding: 8 },
  { range: '80-85°C', bearing: 0, winding: 2 }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function TemperatureTrends() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(7);
  
  const tempData = generateDetailedTemp(timeRange);
  const tempDistribution = generateTempDistribution();

  const currentBearing = tempData[tempData.length - 1].bearing;
  const currentWinding = tempData[tempData.length - 1].winding;

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
            <h1 className="text-3xl font-bold text-white mb-2">Temperature Trends Analysis</h1>
            <p className="text-slate-400">Thermal monitoring and anomaly detection</p>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar size={20} className="text-slate-400" />
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
        
        {/* Current Readings */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
            <Thermometer size={20} />
            Current Readings
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
              <p className="text-slate-400 text-xs mb-1">Bearing Temperature</p>
              <p className="text-white font-bold text-3xl">{currentBearing}°C</p>
              <p className="text-green-400 text-xs mt-2">↓ 2.3°C from yesterday</p>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded">
              <p className="text-slate-400 text-xs mb-1">Winding Temperature</p>
              <p className="text-white font-bold text-3xl">{currentWinding}°C</p>
              <p className="text-orange-400 text-xs mt-2">↑ 1.8°C from yesterday</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs mb-1">Ambient Temperature</p>
              <p className="text-white font-bold text-3xl">25°C</p>
              <p className="text-slate-400 text-xs mt-2">Stable</p>
            </div>
          </div>
        </Card>

        {/* Main Temperature Chart */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Temperature History ({timeRange} day{timeRange > 1 ? 's' : ''})</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                  tickFormatter={(value) => Math.floor(value/24) === 0 ? `${value}h` : `D${Math.floor(value/24)+1}`}
                />
                <YAxis 
                  tick={{fill: '#94a3b8'}}
                  domain={[20, 95]}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                  labelFormatter={(value) => `Hour ${value}`}
                />
                <Legend />
                <Area type="monotone" dataKey="bearing" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} name="Bearing" />
                <Area type="monotone" dataKey="winding" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} name="Winding" />
                <Area type="monotone" dataKey="ambient" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Ambient" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Temperature Statistics */}
        <Card className="lg:col-span-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Temperature Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Bearing Avg</p>
              <p className="text-white font-bold text-2xl">67.2°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Bearing Peak</p>
              <p className="text-white font-bold text-2xl">78.5°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Winding Avg</p>
              <p className="text-white font-bold text-2xl">71.8°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Winding Peak</p>
              <p className="text-white font-bold text-2xl">82.3°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Thermal Rise</p>
              <p className="text-white font-bold text-2xl">42°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Threshold Margin</p>
              <p className="text-green-400 font-bold text-2xl">13°C</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Anomalies Detected</p>
              <p className="text-orange-400 font-bold text-2xl">3</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">Status</p>
              <p className="text-green-400 font-bold text-2xl">Normal</p>
            </div>
          </div>
        </Card>

        {/* Alerts & Thresholds */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Thresholds & Alerts</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Bearing Warning</span>
                <span className="text-orange-400 font-semibold">80°C</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(currentBearing/80)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Bearing Critical</span>
                <span className="text-red-400 font-semibold">90°C</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(currentBearing/90)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Winding Warning</span>
                <span className="text-orange-400 font-semibold">85°C</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentWinding/85)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Winding Critical</span>
                <span className="text-red-400 font-semibold">95°C</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentWinding/95)*100}%`}}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Thermal Events */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Recent Thermal Events</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <Thermometer size={20} className="text-orange-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-200">Winding temp spike</p>
                <p className="text-xs text-slate-400 mt-1">Reached 82.3°C during high load period</p>
                <p className="text-xs text-slate-500 mt-1">18 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <Thermometer size={20} className="text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-200">Bearing temp normalized</p>
                <p className="text-xs text-slate-400 mt-1">Returned to baseline after maintenance</p>
                <p className="text-xs text-slate-500 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-700/50 border border-slate-600 rounded">
              <Thermometer size={20} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">Ambient temp variation</p>
                <p className="text-xs text-slate-400 mt-1">Daily ambient fluctuation within normal range</p>
                <p className="text-xs text-slate-500 mt-1">Ongoing</p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
