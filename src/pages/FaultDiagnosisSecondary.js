import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowLeft, Zap, TrendingUp, Activity } from 'lucide-react';

const generateWindingTemp = () => {
  const data = [];
  let temp = 70;
  for (let i = 0; i < 48; i++) {
    temp += (Math.random() - 0.45) * 3;
    data.push({
      hour: i,
      temperature: Number(temp.toFixed(1)),
      threshold: 85,
      critical: 95
    });
  }
  return data;
};

const generateCurrentImbalance = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      phaseA: 45 + Math.random() * 5,
      phaseB: 48 + Math.random() * 5,
      phaseC: 46 + Math.random() * 5
    });
  }
  return data;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function FaultDiagnosisSecondary() {
  const navigate = useNavigate();
  const windingTemp = generateWindingTemp();
  const currentImbalance = generateCurrentImbalance();

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
        <h1 className="text-3xl font-bold text-white mb-2">Secondary Fault Diagnosis - Stator Winding</h1>
        <p className="text-slate-400">Electrical fault analysis and thermal monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fault Overview */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
            <Zap size={20} className="text-red-400" />
            Fault Overview
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-red-200 font-bold text-xl mb-2">Stator Winding Fault</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Severity:</span>
                <span className="text-red-400 font-bold">CRITICAL</span>
              </div>
            </div>

            <div className="text-center p-6 bg-slate-700/50 rounded">
              <div className="text-5xl font-bold text-white mb-2">85%</div>
              <div className="text-slate-400 text-sm">Confidence Level</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Fault Location</span>
                <span className="text-white font-semibold">Phase B</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Type</span>
                <span className="text-white font-semibold">Turn-to-Turn Short</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Detection</span>
                <span className="text-white font-semibold">Current Signature</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Progression</span>
                <span className="text-white font-semibold">Rapid</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Winding Temperature Trend */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">48-Hour Winding Temperature Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={windingTemp}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" tick={{fill: '#94a3b8'}} label={{ value: 'Hours', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis tick={{fill: '#94a3b8'}} domain={[60, 100]} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="critical" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="threshold" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Current Imbalance */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Phase Current Imbalance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentImbalance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" tick={{fill: '#94a3b8'}} />
                <YAxis tick={{fill: '#94a3b8'}} domain={[40, 55]} label={{ value: 'Current (A)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="phaseA" stroke="#22c55e" strokeWidth={2} name="Phase A" />
                <Line type="monotone" dataKey="phaseB" stroke="#ef4444" strokeWidth={2} name="Phase B" />
                <Line type="monotone" dataKey="phaseC" stroke="#3b82f6" strokeWidth={2} name="Phase C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Symptoms & Indicators */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Fault Indicators</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-red-400" />
                <span className="text-red-200 font-semibold text-sm">High Temperature</span>
              </div>
              <p className="text-xs text-slate-300">Winding temp exceeds normal by 18°C</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-red-400" />
                <span className="text-red-200 font-semibold text-sm">Current Imbalance</span>
              </div>
              <p className="text-xs text-slate-300">Phase B shows 6.5% higher current draw</p>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-orange-400" />
                <span className="text-orange-200 font-semibold text-sm">Power Factor Drop</span>
              </div>
              <p className="text-xs text-slate-300">Decreased from 0.92 to 0.84 in 48 hours</p>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-orange-400" />
                <span className="text-orange-200 font-semibold text-sm">Harmonics Detected</span>
              </div>
              <p className="text-xs text-slate-300">5th and 7th harmonic amplitudes elevated</p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Critical Action Required</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-500/10 border-2 border-red-500/50 rounded">
              <h4 className="text-red-200 font-bold mb-2">Immediate (0-24h)</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Shut down motor for inspection</li>
                <li>• Perform insulation resistance test</li>
                <li>• Check for visible damage/discoloration</li>
                <li>• Document fault progression</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-500/10 border-2 border-orange-500/50 rounded">
              <h4 className="text-orange-200 font-bold mb-2">Short-term (1-3 days)</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Perform motor circuit analysis</li>
                <li>• Conduct surge testing</li>
                <li>• Assess rewind vs replacement cost</li>
                <li>• Order replacement parts</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-500/10 border-2 border-blue-500/50 rounded">
              <h4 className="text-blue-200 font-bold mb-2">Prevention (Future)</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Install real-time current monitoring</li>
                <li>• Implement thermal imaging schedule</li>
                <li>• Review load profiles</li>
                <li>• Update maintenance procedures</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
