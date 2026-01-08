import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const motorData = {
  1: { name: "203-COM-125A", health: 88, remaining: "45 days", status: "Normal", color: "#22c55e" },
  2: { name: "203-COM-125B", health: 52, remaining: "13 days", status: "Warning", color: "#f97316" },
  3: { name: "203-P-23A", health: 94, remaining: "10 days", status: "Normal", color: "#22c55e" },
  4: { name: "203-P-23B", health: 74, remaining: "11 days", status: "Normal", color: "#22c55e" }
};

// Mock data generators
const generateVibrationHistory = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      day: `Day ${i + 1}`,
      x: 2.5 + Math.sin(i / 5) * 0.5 + Math.random() * 0.3,
      y: 2.3 + Math.cos(i / 5) * 0.4 + Math.random() * 0.3,
      z: 2.7 + Math.sin(i / 3) * 0.6 + Math.random() * 0.3
    });
  }
  return data;
};

const generateCurrentHistory = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      current: 45 + Math.sin(i / 3) * 10 + Math.random() * 5,
      voltage: 380 + Math.random() * 10
    });
  }
  return data;
};

const generateHealthBreakdown = () => [
  { name: 'Vibration', value: 85, color: '#22c55e' },
  { name: 'Electrical', value: 72, color: '#3b82f6' },
  { name: 'Thermal', value: 90, color: '#f59e0b' },
  { name: 'Mechanical', value: 88, color: '#8b5cf6' }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function MotorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const motor = motorData[id];

  const vibrationHistory = generateVibrationHistory();
  const currentHistory = generateCurrentHistory();
  const healthBreakdown = generateHealthBreakdown();

  if (!motor) {
    return <div className="min-h-screen bg-slate-900 text-white p-6">Motor not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{motor.name} - Detailed Analysis</h1>
        <p className="text-slate-400">Real-time monitoring and predictive analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Overview */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Health Overview</h3>
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke={motor.color} 
                  strokeWidth="12" 
                  fill="transparent"
                  strokeDasharray={`${motor.health * 3.51}, 351`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{motor.health}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Status</span>
              <span className="text-white font-semibold">{motor.status}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Remaining Life</span>
              <span className="text-white font-semibold">{motor.remaining}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Operating Hours</span>
              <span className="text-white font-semibold">18,542 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Maintenance</span>
              <span className="text-white font-semibold">45 days ago</span>
            </div>
          </div>
        </Card>

        {/* Health Component Breakdown */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Health Component Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vibration History */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">30-Day Vibration History (mm/s)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vibrationHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{fill: '#94a3b8'}} />
                <YAxis tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Legend />
                <Line type="monotone" dataKey="x" stroke="#3b82f6" strokeWidth={2} name="X-Axis" />
                <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} name="Y-Axis" />
                <Line type="monotone" dataKey="z" stroke="#f59e0b" strokeWidth={2} name="Z-Axis" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Current & Voltage */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">24-Hour Electrical Profile</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" tick={{fill: '#94a3b8'}} />
                <YAxis yAxisId="left" tick={{fill: '#94a3b8'}} />
                <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="current" fill="#3b82f6" name="Current (A)" />
                <Bar yAxisId="right" dataKey="voltage" fill="#22c55e" name="Voltage (V)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerts & Recommendations */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <AlertTriangle size={20} className="text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-200">High Vibration</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <TrendingUp size={20} className="text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-200">Temperature Rising</p>
                <p className="text-xs text-slate-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <Activity size={20} className="text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-200">Load Variation</p>
                <p className="text-xs text-slate-400">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
