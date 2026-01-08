import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Settings } from 'lucide-react';

const generateFFTData = (harmonics = [12, 24, 36]) => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    let val = Math.random() * 0.15;
    if (harmonics.includes(i)) val = 0.6 + Math.random() * 0.4;
    if (i === 5) val = 0.9;
    data.push({ 
      frequency: i * 10, 
      amplitude: val,
      phase: Math.random() * 360
    });
  }
  return data;
};

const generateTimeWaveform = () => {
  const data = [];
  for (let i = 0; i < 200; i++) {
    data.push({
      time: i * 0.01,
      amplitude: Math.sin(i * 0.2) * 2 + Math.sin(i * 0.5) * 0.5 + (Math.random() - 0.5) * 0.3
    });
  }
  return data;
};

const generateWaterfallData = () => {
  const data = [];
  for (let t = 0; t < 10; t++) {
    for (let f = 0; f <= 50; f++) {
      let val = Math.random() * 0.1;
      if (f === 12 || f === 24) val = 0.5 + Math.random() * 0.3;
      data.push({
        time: t,
        frequency: f * 10,
        amplitude: val
      });
    }
  }
  return data;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg ${className}`}>
    {children}
  </div>
);

export default function VibrationFFT() {
  const navigate = useNavigate();
  const [selectedAxis, setSelectedAxis] = useState('X');
  
  const fftData = generateFFTData();
  const timeWaveform = generateTimeWaveform();

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
            <h1 className="text-3xl font-bold text-white mb-2">Vibration FFT Analysis</h1>
            <p className="text-slate-400">Frequency domain analysis for bearing fault detection</p>
          </div>
          <div className="flex gap-2">
            {['X', 'Y', 'Z'].map(axis => (
              <button
                key={axis}
                onClick={() => setSelectedAxis(axis)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  selectedAxis === axis 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {axis}-Axis
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FFT Spectrum */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">FFT Spectrum - {selectedAxis} Axis</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fftData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="frequency" 
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                />
                <YAxis 
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Amplitude (mm/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="amplitude" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Fault Frequency Reference */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
            <Settings size={20} />
            Fault Frequencies
          </h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">BPFO (Outer Race)</p>
              <p className="text-white font-bold text-lg">120 Hz</p>
              <p className="text-green-400 text-xs mt-1">✓ Peak Detected</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">BPFI (Inner Race)</p>
              <p className="text-white font-bold text-lg">180 Hz</p>
              <p className="text-slate-500 text-xs mt-1">No peak</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">BSF (Ball Spin)</p>
              <p className="text-white font-bold text-lg">85 Hz</p>
              <p className="text-slate-500 text-xs mt-1">No peak</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-400 text-xs">FTF (Cage)</p>
              <p className="text-white font-bold text-lg">12 Hz</p>
              <p className="text-slate-500 text-xs mt-1">No peak</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-red-200 text-xs font-semibold">Diagnosis:</p>
            <p className="text-red-100 text-xs mt-1">Outer race bearing defect with 85% confidence</p>
          </div>
        </Card>

        {/* Time Waveform */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Time Waveform - {selectedAxis} Axis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeWaveform}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                />
                <YAxis 
                  tick={{fill: '#94a3b8'}}
                  label={{ value: 'Amplitude (mm/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}
                  itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="amplitude" stroke="#22c55e" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Statistical Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'RMS', value: '2.84 mm/s', status: 'normal' },
              { label: 'Peak', value: '8.12 mm/s', status: 'warning' },
              { label: 'Crest Factor', value: '2.86', status: 'normal' },
              { label: 'Kurtosis', value: '3.42', status: 'normal' },
              { label: 'Skewness', value: '0.12', status: 'normal' },
              { label: 'Peak-to-Peak', value: '15.8 mm/s', status: 'warning' },
              { label: 'Variance', value: '8.06', status: 'normal' },
              { label: 'Shape Factor', value: '1.12', status: 'normal' }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-slate-700/50 rounded">
                <p className="text-slate-400 text-xs">{stat.label}</p>
                <p className="text-white font-bold text-xl mt-1">{stat.value}</p>
                <div className={`mt-2 text-xs ${
                  stat.status === 'normal' ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {stat.status === 'normal' ? '✓ Normal' : '⚠ Warning'}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
