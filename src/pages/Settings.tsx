import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Key, Cpu, CreditCard, Copy, Check, Shield, Zap, FileJson } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'agent', label: 'Agent Configuration', icon: <Cpu size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content">
        <header className="page-header">
          <div className="header-left">
            <h2>System Settings</h2>
            <p>Configure your autonomous workspace and agent behaviors.</p>
          </div>
        </header>

        <div className="settings-container">
          {/* Horizontal Tabs */}
          <div className="tabs-nav glass-card">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-underline" className="tab-underline" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content-area">
            <AnimatePresence mode="wait">
              {activeTab === 'api' && (
                <motion.div 
                  key="api"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card settings-card"
                >
                  <h3>Enterprise API Access</h3>
                  <p className="card-desc">Use your secure keys to integrate OmniSight with external workflows.</p>
                  
                  <div className="api-key-box">
                    <div className="key-info">
                      <span className="key-label">Production Key</span>
                      <code className="key-value">sk-omni-********************************</code>
                    </div>
                    <button className="btn-icon" onClick={handleCopy}>
                      {copied ? <Check size={18} className="success-text" /> : <Copy size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'agent' && (
                <motion.div 
                  key="agent"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card settings-card"
                >
                  <h3>Agent Intelligence Hub</h3>
                  <p className="card-desc">Define how the autonomous loop handles critical data steps.</p>
                  
                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <div className="toggle-title">
                          <Shield size={16} className="primary-text" />
                          Enable Data QA Critic
                        </div>
                        <p>Automatically run a secondary agent to verify data integrity before visualization.</p>
                      </div>
                      <div className="switch active"><div className="knob" /></div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <div className="toggle-title">
                          <Zap size={16} className="primary-text" />
                          Aggressive Formatting
                        </div>
                        <p>Force complex datasets into simplified executive summaries.</p>
                      </div>
                      <div className="switch active"><div className="knob" /></div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <div className="toggle-title">
                          <FileJson size={16} className="primary-text" />
                          Auto-Export to PDF
                        </div>
                        <p>Generate a report download link immediately after the agent finishes its loop.</p>
                      </div>
                      <div className="switch"><div className="knob" /></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'api' && activeTab !== 'agent' && (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-tab"
                >
                  <p>Module configuration for <strong>{activeTab}</strong> will be available in the next release.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style>{`
        .workspace-layout {
          display: flex;
          height: 100vh;
          background: #0b0f1a;
          padding: 20px;
          gap: 20px;
        }

        .workspace-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 800px;
        }

        .tabs-nav {
          display: flex;
          padding: 6px;
          gap: 4px;
          background: rgba(15, 23, 42, 0.4) !important;
          border-radius: 14px;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          border-radius: 10px;
          position: relative;
          transition: color 0.2s;
        }

        .tab-btn:hover {
          color: white;
        }

        .tab-btn.active {
          color: var(--primary);
        }

        .tab-underline {
          position: absolute;
          bottom: 0;
          left: 10%;
          width: 80%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }

        .settings-card {
          padding: 32px;
          background: rgba(15, 23, 42, 0.4) !important;
        }

        .settings-card h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: white;
        }

        .card-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .api-key-box {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 16px 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .key-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .key-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .key-value {
          font-family: 'JetBrains Mono', monospace;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 80%;
        }

        .toggle-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: white;
          font-size: 0.95rem;
        }

        .toggle-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .switch {
          width: 44px;
          height: 22px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
        }

        .switch.active {
          background: var(--primary);
        }

        .knob {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .switch.active .knob {
          transform: translateX(22px);
        }

        .empty-tab {
          padding: 60px;
          text-align: center;
          color: var(--text-muted);
        }

        .success-text { color: #10b981; }
      `}</style>
    </div>
  );
};
