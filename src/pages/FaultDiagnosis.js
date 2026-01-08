import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const faultProbabilities = [
  { fault: 'Outer Race', probability: 85, color: '#ef4444' },
  { fault: 'Inner Race', probability: 12, color: '#f97316' },
  { fault: 'Ball/Roller', probability: 8, color: '#f59e0b' },
  { fault: 'Cage', probability: 5, color: '#84cc16' },
  { fault: 'Misalignment', probability: 15, color: '#3b82f6' },
  { fault: 'Unbalance', probability: 10, color: '#8b5cf6' }
];

const historicalFaults = [
  { month: 'Jan', faults: 2 },
  { month: 'Feb', faults: 1 },
  { month: 'Mar', faults: 3 },
  { month: 'Apr', faults: 2 },
  { month: 'May', faults: 4 },
  { month: 'Jun', faults: 3 }
];

const diagnosticFeatures = [
  { feature: 'Vibration', score: 85 },
  { feature: 'Temperature', score: 72 },
  { feature: 'Current', score: 65 },
  { feature: 'Acoustic', score: 78 },
  { feature: 'Oil Analysis', score: 90 }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function FaultDiagnosis() {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold text-white mb-2">Fault Diagnosis - Detailed Analysis</h1>
        <p className="text-slate-400">AI-powered fault detection and root cause analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Primary Diagnosis */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Fault Probability Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faultProbabilities} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                <YAxis dataKey="fault" type="category" tick={{fill: '#94a3b8'}} width={100} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="probability" radius={[0, 8, 8, 0]}>
                  {faultProbabilities.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Diagnosis Summary */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Primary Diagnosis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={24} className="text-red-400" />
                <span className="text-red-200 font-bold text-lg">Critical</span>
              </div>
              <p className="text-white font-semibold mb-1">Outer Race Bearing Defect</p>
              <p className="text-slate-400 text-sm">Confidence: 85%</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Fault Type</span>
                <span className="text-white font-semibold">Bearing</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Severity</span>
                <span className="text-red-400 font-semibold">High</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Est. Failure</span>
                <span className="text-white font-semibold">7-12 days</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Detection Method</span>
                <span className="text-white font-semibold">ML Model</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">First Detected</span>
                <span className="text-white font-semibold">3 days ago</span>
              </div>
            </div>

            <button className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium transition text-white mt-4">
              Schedule Maintenance
            </button>
          </div>
        </Card>

        {/* Diagnostic Features Radar */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Diagnostic Features</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={diagnosticFeatures}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="feature" tick={{fill: '#94a3b8', fontSize: 12}} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill: '#94a3b8'}} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Historical Faults */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">6-Month Fault History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalFaults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{fill: '#94a3b8'}} />
                <YAxis tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="faults" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Explanation & Recommendations */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Detailed Explanation & Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Root Cause Analysis</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                The outer race bearing defect has been identified through vibration analysis showing characteristic 
                frequency peaks at 120Hz (BPFO). The defect is causing periodic impulses as each rolling element 
                passes over the damaged area, resulting in increased vibration levels and heat generation.
              </p>
              <h4 className="text-md font-semibold text-white mb-3">Contributing Factors</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="text-red-400 mt-0.5" />
                  <span>Inadequate lubrication detected in recent oil analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="text-red-400 mt-0.5" />
                  <span>Operating temperature 15°C above baseline</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="text-red-400 mt-0.5" />
                  <span>Load variations exceeding design specifications</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Recommended Actions</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <AlertTriangle size={20} className="text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-200">Immediate (Within 48 hours)</p>
                    <p className="text-xs text-slate-300 mt-1">Reduce motor load to 70% and increase monitoring frequency to every 4 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                  <AlertTriangle size={20} className="text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-200">Short-term (Within 7 days)</p>
                    <p className="text-xs text-slate-300 mt-1">Schedule bearing replacement during planned maintenance window</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <CheckCircle size={20} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-200">Long-term Prevention</p>
                    <p className="text-xs text-slate-300 mt-1">Implement automated lubrication system and review load profiles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
