import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PredictiveDashboard from './Dashboard';
import MotorDetail from './pages/MotorDetail';
import VibrationFFT from './pages/VibrationFFT';
import FaultDiagnosis from './pages/FaultDiagnosis';
import FaultDiagnosisSecondary from './pages/FaultDiagnosisSecondary';
import TemperatureTrends from './pages/TemperatureTrends';
import RMSKurtosis from './pages/RMSKurtosis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PredictiveDashboard />} />
        <Route path="/motor/:id" element={<MotorDetail />} />
        <Route path="/vibration-fft" element={<VibrationFFT />} />
        <Route path="/fault-diagnosis" element={<FaultDiagnosis />} />
        <Route path="/fault-diagnosis-secondary" element={<FaultDiagnosisSecondary />} />
        <Route path="/temperature-trends" element={<TemperatureTrends />} />
        <Route path="/rms-kurtosis" element={<RMSKurtosis />} />
      </Routes>
    </Router>
  );
}

export default App;
