import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { AlertTriangle, Activity, MoreVertical, AlertOctagon } from 'lucide-react';

// --- CONFIGURATION: CHANGE MOTOR NAMES HERE ---
const motorData = [
  { 
    id: 1, 
    name: "203-COM-125A",
    health: 88, 
    remaining: "45 days", 
    status: "Normal",
    vibration: "Normal",
    electrical: "Normal",
    color: "#22c55e"
  },
  { 
    id: 2, 
    name: "203-COM-125B",
    health: 52, 
    remaining: "13 days", 
    status: "Warning",
    vibration: "Normal",
    electrical: "Critical",
    color: "#f97316"
  },
  { 
    id: 3, 
    name: "203-P-23A",
    health: 94, 
    remaining: "10 days", 
    status: "Normal",
    vibration: "Normal",
    electrical: "Normal",
    color: "#22c55e" 
  },
  { 
    id: 4, 
    name: "203-P-23B",
    health: 74, 
    remaining: "11 days", 
    status: "Normal",
    vibration: "Bearing",
    electrical: "80%",
    color: "#22c55e" 
  }
];

// --- Mock Data Generators ---
const generateFFTData = () => {
  const data = [];
  for (let i = 0; i <= 50; i++) {
    let val = Math.random() * 0.2;
    if (i === 12 || i === 24 || i === 36) val = 0.6 + Math.random() * 0.3; 
    if (i === 5) val = 0.8; 
    data.push({ frequency: i * 10, amplitude: val });
  }
  return data;
};

const generateTempData = () => {
  const data = [];
  let bearing = 65;
  let winding = 70;
  for (let i = 0; i < 20; i++) {
    bearing += (Math.random() - 0.4) * 2;
    winding += (Math.random() - 0.3) * 2;
    data.push({
      time: `${10 + i}:00`,
      bearing: Number(bearing.toFixed(1)),
      winding: Number(winding.toFixed(1)),
      ambient: 25
    });
  }
  return data;
};

const generateRMSData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `${10 + i}:00`,
      rms: 2.5 + Math.sin(i) * 0.5 + Math.random() * 0.2,
      kurtosis: 3 + Math.cos(i) * 0.5
    });
  }
  return data;
};

const fftData = generateFFTData();
const tempData = generateTempData();
const rmsData = generateRMSData();

// --- Reusable Components ---
const Card = ({ children, className = "", onClick }) => (
  <div 
    className={`bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg ${className} ${onClick ? 'cursor-pointer hover:border-blue-500 transition-all' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const SectionTitle = ({ title }) => (
  <h3 className="text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wider">{title}</h3>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Normal: "text-green-400",
    Warning: "text-orange-400",
    Critical: "text-red-500",
  };
  const colorClass = colors[status] || (status.includes("%") ? "text-green-400" : "text-slate-300");
  
  return <span className={`font-bold ${colorClass}`}>{status}</span>;
};

const CircularHealth = ({ score, color = "#22c55e" }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#334155"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-xl font-bold text-white">{score}</span>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function PredictiveDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Maintenance Operations</h1>
          <div className="flex gap-6 mt-2 text-sm text-slate-400">
            <span className="flex items-center gap-1"><span className="text-white font-bold">92%</span> Plant Health Index</span>
            <span className="flex items-center gap-1"><span className="text-red-400 font-bold">1</span> Motors In Alarm</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
             <AlertTriangle size={16} className="text-orange-400" />
             <span className="text-orange-400 font-bold">3</span> 
             <span className="text-xs uppercase">Active Alerts</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
             <AlertOctagon size={16} className="text-red-500" />
             <span className="text-red-500 font-bold">12</span> 
             <span className="text-xs uppercase">Critical</span>
          </div>
          <div className="text-xs text-slate-500 text-right">
            Model Updated <br/> <span className="text-slate-300">1 day ago</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* --- MAIN COLUMN (Left 3/4) --- */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Motor Cards Row - Now clickable */}
          {motorData.map((motor) => (
            <Card 
              key={motor.id} 
              className="relative overflow-hidden"
              onClick={() => navigate(`/motor/${motor.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight mb-1">{motor.name}</h4>
                  <p className="text-xs text-slate-400">Remaining {motor.remaining}</p>
                </div>
                <CircularHealth 
                  score={motor.health} 
                  color={motor.color} 
                />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Load</span>
                  <StatusBadge status="Normal" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vibration</span>
                  <StatusBadge status={motor.vibration} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Electrical</span>
                  <StatusBadge status={motor.electrical} />
                </div>
              </div>
            </Card>
          ))}

          {/* Row 2: Vibration FFT + Diagnostics */}
          
          {/* Vibration FFT Chart - Clickable */}
          <Card 
            className="md:col-span-1 lg:col-span-1 min-h-[250px]"
            onClick={() => navigate('/vibration-fft')}
          >
            <SectionTitle title="Vibration FFT" />
            <div className="h-[200px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="frequency" 
                    tick={{fill: '#94a3b8'}} 
                    label={{ value: 'Freq (Hz)', position: 'insideBottomRight', fill: '#94a3b8', offset: -5 }} 
                  />
                  <YAxis 
                    hide={false} 
                    tick={{fill: '#94a3b8'}} 
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                    itemStyle={{color: '#fff'}}
                    cursor={{fill: '#334155', opacity: 0.4}}
                  />
                  <Bar dataKey="amplitude" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Fault Diagnosis 1 - Clickable */}
          <Card 
            className="md:col-span-1 lg:col-span-1.5 flex flex-col justify-center"
            onClick={() => navigate('/fault-diagnosis')}
          >
            <SectionTitle title="Fault Diagnosis" />
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Fault Type</span>
                <span className="text-white font-medium">Outer Race Bearing</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Probability</span>
                <span className="text-white font-medium">85%</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Est. Failure Window</span>
                <span className="text-white font-medium">7-12 days</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/50 p-2 rounded text-red-200 text-xs mt-2">
                <strong>Explanation:</strong> Inner race defect causing periodic wear pattern on {motorData[1].name}.
              </div>
            </div>
          </Card>

          {/* Fault Diagnosis 2 - Clickable */}
          <Card 
            className="md:col-span-2 lg:col-span-1.5"
            onClick={() => navigate('/fault-diagnosis-secondary')}
          >
             <SectionTitle title="Fault Diagnosis (Secondary)" />
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 text-sm">
                   <div>
                      <p className="text-slate-400 text-xs">Fault Type</p>
                      <p className="text-white font-semibold">Stator Winding</p>
                   </div>
                   <div>
                      <p className="text-slate-400 text-xs">Severity</p>
                      <p className="text-red-500 font-bold uppercase">Critical</p>
                   </div>
                </div>
                <div className="flex items-center justify-center">
                   <div className="text-center">
                      <div className="text-3xl font-bold text-white">85%</div>
                      <div className="text-xs text-slate-400">Confidence</div>
                   </div>
                </div>
             </div>
          </Card>

          {/* Temperature Trends - Clickable */}
          <Card 
            className="md:col-span-2 min-h-[250px]"
            onClick={() => navigate('/temperature-trends')}
          >
            <SectionTitle title="Temperature Trends" />
            <div className="h-[200px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" tick={{fill: '#94a3b8'}} />
                  <YAxis domain={['auto', 'auto']} tick={{fill: '#94a3b8'}} unit="°C" />
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
                  <Legend />
                  <Line type="monotone" dataKey="bearing" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="winding" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ambient" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* RMS & Kurtosis - Clickable */}
          <Card 
            className="md:col-span-2 min-h-[250px]"
            onClick={() => navigate('/rms-kurtosis')}
          >
            <SectionTitle title="RMS & Kurtosis" />
            <div className="h-[200px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rmsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" tick={{fill: '#94a3b8'}} />
                  <YAxis yAxisId="left" tick={{fill: '#94a3b8'}} />
                  <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="rms" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="kurtosis" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Alerts Section */}
          <Card className="h-2/3">
            <SectionTitle title="Alert & Workflow" />
            <div className="space-y-4 mb-6">
              {[
                { type: 'Critical', time: '06.0 12:33', color: 'bg-red-500' },
                { type: 'Warning', time: '02.0 12:29', color: 'bg-orange-400' },
                { type: 'Warning', time: '01.0 07:01', color: 'bg-orange-400' },
              ].map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 cursor-pointer transition">
                   <div className={`w-2 h-2 rounded-full ${alert.color}`}></div>
                   <div className="flex-1">
                      <div className="text-sm font-bold text-slate-200">{alert.type}</div>
                      <div className="text-xs text-slate-500">{alert.time}</div>
                   </div>
                   <MoreVertical size={16} className="text-slate-500" />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button className="w-full py-2 px-4 rounded bg-slate-700 hover:bg-slate-600 text-sm font-medium transition text-slate-200">
                Acknowledge
              </button>
              <button className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium transition text-white shadow-lg shadow-blue-500/20">
                Create Work Order
              </button>
              <button className="w-full py-2 px-4 rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-medium transition">
                Escalate
              </button>
            </div>
          </Card>

          {/* Model Status Section */}
          <Card className="h-1/3 flex flex-col justify-between">
            <SectionTitle title="Model Status" />
            
            <div className="flex items-center justify-between mb-4">
               <div className="space-y-2 text-xs">
                  <div className="flex justify-between w-32">
                    <span className="text-slate-400">Data Drift</span>
                    <span className="text-white">6.2</span>
                  </div>
                  <div className="flex justify-between w-32">
                    <span className="text-slate-400">Accuracy</span>
                    <span className="text-white">89%</span>
                  </div>
                  <div className="flex justify-between w-32">
                    <span className="text-slate-400">Training</span>
                    <span className="text-white">05 Mar</span>
                  </div>
               </div>

               <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                    <path
                      className="text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
                      strokeDasharray="74, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap='round'
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">74%</span>
               </div>
            </div>
            <div className="text-xs text-center text-slate-500">
               Next training scheduled: 24h
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
