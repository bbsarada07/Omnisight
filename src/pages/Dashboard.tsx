import React, { useState, useEffect } from 'react';
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
  DownloadCloud,
  X,
  Mic,
  Send
} from 'lucide-react';
import { ExecutiveCanvas } from '../components/ExecutiveCanvas';

import { RightPillar } from '../components/RightPillar';
import { useDataStore } from '../store/useDataStore';
import Papa from 'papaparse';
import { Database as DbIcon, Plus } from 'lucide-react';
import { GlobalNodeMap } from '../components/GlobalNodeMap';
import { InfraFooter } from '../components/InfraFooter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { activeAnalysisType, uploadedFile, setUploadedData, setIsProcessing } = useDataStore();
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(!!uploadedFile);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    if (uploadedFile) {
      setIsDataLoaded(true);
      
      Papa.parse(uploadedFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
          const rawData = results.data as any[];
          if (!rawData || rawData.length === 0) return;

          // Autonomously detect columns (assume 1st column is X-axis label, 2nd is Y-axis value)
          const keys = Object.keys(rawData[0]);
          const labelKey = keys[0]; 
          const valueKey = keys.find(k => typeof rawData[0][k] === 'number') || keys[1];

          // Format data for Recharts
          let formattedData = rawData.map(row => ({
            name: row[labelKey] || 'Unknown',
            actualValue: row[valueKey] || 0,
            prediction: row[valueKey] || 0 // Base prediction overlaps actual for past data
          }));

          // Generate the AI Forecast (Add 2 future points based on average growth)
          const lastVal = formattedData[formattedData.length - 1].actualValue;
          const prevVal = formattedData[formattedData.length - 2]?.actualValue || lastVal;
          const growthTrend = lastVal - prevVal;
          
          formattedData.push({
            name: 'Forecast +1',
            actualValue: null, // Null so the solid line stops
            prediction: lastVal + growthTrend
          });
          formattedData.push({
            name: 'Forecast +2',
            actualValue: null,
            prediction: lastVal + (growthTrend * 2)
          });

          setChartData(formattedData);
        }
      });
    }
  }, [uploadedFile]);

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
          
          try {
            const apiResponse = await fetch('http://localhost:8000/api/upload', {
              method: 'POST',
              body: formData,
            });
            if (!apiResponse.ok) throw new Error("Server rejected payload");
            const data = await apiResponse.json();
            if (data.status !== "success") throw new Error("Sync failed");

            setUploadedData(results.data, results.meta.fields || [], file);
            setIsDataLoaded(true);
            setIsProcessing(false);
          } catch (err) {
            console.error("Backend sync failed", err);
            setIsProcessing(false);
          }
        }
      });
    } catch (err) {
      console.error("Failed to load demo data", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="workspace-layout">
      <Sidebar onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)} />
      
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
            {activeAnalysisType && (
              <ExecutiveCanvas />
            )}

            {!isDataLoaded && (
              <div className="empty-dashboard-state glass-panel empty-state-wrapper">
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
            
            {isDataLoaded && (
              <div className="dashboard-grid-layout active-data-wrapper animate-in fade-in duration-500">
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="col-span-2 bg-[#0A0E17]/80 border border-slate-800/80 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold text-lg">Revenue vs Predictive Growth</h3>
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase">AI FORECAST ACTIVE</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis dataKey="name" stroke="#475569" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                          <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#1e293b' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="actualValue" stroke="#22d3ee" fill="url(#colorRevenue)" strokeWidth={3} connectNulls={false} />
                          <Line type="monotone" dataKey="prediction" stroke="#818cf8" strokeDasharray="5 5" strokeWidth={3} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg mt-4 text-indigo-200 text-sm">
                        OmniMind AI detects a 24% upward revenue trajectory in Q4 based on current CRM ingestion metrics.
                      </div>
                    </div>
                    <div className="col-span-1">
                      <GlobalNodeMap />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <RightPillar />
      </div>

      {isCopilotOpen && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-[#05080F] border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <h2 className="text-sm uppercase tracking-widest text-indigo-400 font-bold">OmniMind Intelligence Agent</h2>
            <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-end">
              <div className="bg-indigo-600/20 border border-indigo-500/30 text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[85%]">
                Can you analyze the recent churn data and identify primary risk factors?
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-[#0A0E17] border border-slate-700 text-slate-300 p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed max-w-[85%]">
                I've analyzed the dataset. We're seeing a notable spike in at-risk accounts primarily correlated with a drop in user engagement over the last 30 days. 
                
                <div className="mt-3 bg-[#05080F] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Churn Risk: 14.2%</span>
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">Critical</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-800 bg-[#0A0E17]">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-[10px] px-3 py-1.5 border border-slate-700 rounded-full hover:bg-slate-800 text-slate-400 cursor-pointer">
                + Identify key risk factors
              </div>
              <div className="text-[10px] px-3 py-1.5 border border-slate-700 rounded-full hover:bg-slate-800 text-slate-400 cursor-pointer">
                + Generate executive brief
              </div>
            </div>
            <div className="relative">
              <textarea 
                placeholder="Ask OmniSight to analyze..." 
                className="w-full bg-[#05080F] border border-slate-700 rounded-xl p-4 pr-[70px] text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none h-[80px]"
              />
              <div className="absolute right-3 top-4 flex gap-2 text-slate-400">
                <button className="hover:text-indigo-400 transition-colors"><Mic size={18} /></button>
                <button className="hover:text-indigo-400 transition-colors"><Send size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

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
