import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/Auth';
import { UploadPage } from './pages/Upload';
import { DashboardPage } from './pages/Dashboard';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { ConsolePage } from './pages/Console';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/workspace/new" element={<UploadPage />} />
        <Route path="/workspace/dashboard" element={<DashboardPage />} />
        <Route path="/workspace/history" element={<HistoryPage />} />
        <Route path="/workspace/console" element={<ConsolePage />} />
        <Route path="/workspace/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
