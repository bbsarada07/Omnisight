import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Database,
  Bell, 
  Settings,
  MoreHorizontal,
  DownloadCloud
} from 'lucide-react';
import { ExecutiveCanvas } from '../components/ExecutiveCanvas';
import { ChatInput } from '../components/ChatInput';
import { RightPillar } from '../components/RightPillar';
import { useDataStore } from '../store/useDataStore';
import Papa from 'papaparse';
import { Database as DbIcon, Plus } from 'lucide-react';
import { GlobalNodeMap } from '../components/GlobalNodeMap';
import { InfraFooter } from '../components/InfraFooter';

export const DashboardPage: React.FC = () => {
  const { activeAnalysisType, uploadedFile, setUploadedData, setIsProcessing } = useDataStore();
  const navigate = useNavigate();

  const loadDemoData = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/sample_data.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          // Sync with backend
          const file = new File([csvText], "demo_data.csv", { type: 'text/csv' });
          const formData = new FormData();
          formData.append('file', file);
          
          await fetch('http://localhost:8000/api/upload', {
            method: 'POST',
            body: formData,
          });

          setUploadedData(results.data, results.meta.fields || [], file);
          setIsProcessing(false);
        }
      });
    } catch (err) {
      console.error("Failed to load demo data", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <div className="workspace-content dashboard-container">
        <div className="main-pillar">
          <header className="os-header">
            <div className="header-greeting">
              <span className="greeting-sub">Welcome back, Administrator</span>
              <h1>Data Intelligence <span className="text-gradient">Hub</span></h1>
              <p className="status-summary">
                {uploadedFile ? `Currently analyzing: ${uploadedFile.name}` : "Upload a dataset to begin agentic analysis."}
              </p>
            </div>
            
            <div className="header-actions">
              <div className="icon-group">
                {activeAnalysisType && (
                  <button 
                    className="export-report-btn" 
                    onClick={() => {
                      // Trigger the export function from ExecutiveCanvas
                      const event = new CustomEvent('trigger-executive-export');
                      window.dispatchEvent(event);
                    }}
                    title="Export Executive Brief"
                  >
                    <DownloadCloud size={20} />
                    <span>Export Report</span>
                  </button>
                )}
                <button 
                  className="icon-btn" 
                  onClick={() => alert("Notification Center: System is healthy. Agentic loop is connected.")}
                  title="Notifications"
                >
                  <Bell size={20} />
                </button>
                <button 
                  className="icon-btn" 
                  onClick={() => navigate('/workspace/settings')}
                  title="System Settings"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="dashboard-main-area">
            {activeAnalysisType ? (
              <ExecutiveCanvas />
            ) : (
              <div className="empty-dashboard-state glass-panel">
                <div className="empty-info">
                  <div className="empty-icon-wrap">
                    <Activity size={48} className="text-dim" />
                  </div>
                  <h3>No active analysis session</h3>
                  <p>Upload a dataset or initialize our pre-configured demo environment to begin agentic analysis.</p>
                  
                  <div className="empty-actions">
                    <button className="btn-primary" onClick={() => navigate('/workspace/new')}>
                      <Plus size={18} />
                      Upload Dataset
                    </button>
                    <button className="btn-secondary" onClick={loadDemoData}>
                      <DbIcon size={18} />
                      Initialize Demo Data
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!activeAnalysisType && (
              <div className="dashboard-grid-layout">
                <div className="grid-left-col">
                  <div className="quick-metrics-grid mb-4">
                    <MetricCard 
                      label="DATA VOLUME" 
                      value="24.8 MB" 
                      trend="Raw CSV" 
                      color="var(--primary)" 
                      icon={Server} 
                    />
                    <MetricCard 
                      label="RECORDS" 
                      value="124,780" 
                      trend="Indexed" 
                      color="var(--accent-cyan)" 
                      icon={Database} 
                    />
                    <MetricCard 
                      label="AGENT STATUS" 
                      value="Standby" 
                      trend="Ready" 
                      color="var(--accent-emerald)" 
                      icon={ShieldCheck} 
                    />
                  </div>
                  <GlobalNodeMap />
                </div>
              </div>
            )}
          </div>

          <div className="ai-overlay-fixed">
            <ChatInput />
          </div>
        </div>

        <RightPillar />
      </div>
      <InfraFooter />

      <style>{`
        .os-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .dashboard-container {
          display: flex;
          padding: 0;
          overflow: hidden;
        }

        .main-pillar {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .header-greeting h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 4px 0 8px;
          letter-spacing: -1px;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .status-summary {
          color: var(--text-dim);
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          gap: 16px;
        }

        .icon-group {
          display: flex;
          gap: 12px;
        }

        .icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-report-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          height: 42px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .export-report-btn:hover {
          background: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }

        .dashboard-main-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 400px;
          padding-bottom: 150px;
        }

        .empty-dashboard-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px;
        }

        .empty-info h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .empty-info p {
          color: var(--text-dim);
          max-width: 400px;
          margin-bottom: 24px;
        }

        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .empty-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .dashboard-grid-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .grid-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quick-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .mb-4 { margin-bottom: 16px; }

        .ai-overlay-fixed {
          position: sticky;
          bottom: 20px;
          margin-top: auto;
          z-index: 1000;
          width: 100%;
        }

        .metric-card-premium {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-top svg {
          cursor: pointer;
          transition: color 0.2s;
        }
        .card-top svg:hover {
          color: white;
        }
        .icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .value-wrap h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 4px 0;
        }
        .trend {
          font-size: 0.75rem;
          font-weight: 700;
        }
        .label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

const MetricCard = ({ label, value, trend, color, icon: Icon }: any) => (
  <div className="glass-panel metric-card-premium glass-card-hover">
    <div className="card-top">
      <div className="icon-wrap" style={{ color, backgroundColor: `${color}15` }}>
        <Icon size={20} />
      </div>
      <MoreHorizontal size={16} className="text-dim" />
    </div>
    <div className="card-body">
      <span className="label">{label}</span>
      <div className="value-wrap">
        <h2>{value}</h2>
        <span className="trend" style={{ color }}>{trend}</span>
      </div>
    </div>
  </div>
);
