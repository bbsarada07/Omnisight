import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { 
  LayoutDashboard, 
  Search, 
  Terminal, 
  BarChart3, 
  Settings,
  ChevronLeft
} from 'lucide-react';
import { ComputeUsage } from './ComputeUsage';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/workspace/dashboard', sub: 'Performance & Insights' },
  { id: 'analysis', icon: BarChart3, label: 'Deep Analysis', path: '/workspace/dashboard', sub: 'Agentic Workflows' },
  { id: 'history', icon: Search, label: 'Query History', path: '/workspace/history', sub: 'Previous Sessions' },
  { id: 'terminal', icon: Terminal, label: 'Agent Terminal', path: '/workspace/console', sub: 'Telemetry & Logs', type: 'ai' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/workspace/settings', sub: 'System Preferences' },
];

// Mock Image component to satisfy architectural requirements in a Vite environment
const Image = ({ src, alt, width, height, priority, className }: any) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    loading={priority ? 'eager' : 'lazy'} 
    className={className}
    style={{ objectFit: 'contain' }}
    // @ts-ignore
    fetchpriority={priority ? 'high' : 'auto'}
  />
);

export const Sidebar: React.FC<{ onToggleCopilot?: () => void }> = ({ onToggleCopilot }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { setAnalysisType, activeAnalysisType } = useDataStore();

  const handleNav = (path: string, id: string) => {
    if (id === 'analysis') {
      setAnalysisType('generic');
    } else if (id === 'dashboard') {
      setAnalysisType(null);
    }
    navigate(path);
  };

  return (
    <aside className={`omnisight-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        {!isCollapsed && (
          <Image 
            src="/omnisight-logo.jpg" 
            alt="OmniSight OS Logo" 
            width={220} 
            height={220} 
            priority={true}
          />
        )}
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft size={16} style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          // Distinguish active state between Dashboard and Deep Analysis
          const isActive = location.pathname === item.path && 
            (item.path === '/workspace/dashboard' ? (item.id === 'analysis' ? activeAnalysisType === 'generic' : activeAnalysisType !== 'generic') : true);

          return (
            <button
              key={item.id}
              className={`flex flex-row items-center gap-4 px-4 py-3 w-full rounded-xl cursor-pointer group transition-all duration-200 border border-transparent ${
                isActive 
                  ? 'bg-[#0A0E17]/80 border-slate-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                  : 'bg-transparent hover:bg-slate-800/30'
              }`}
              onClick={() => handleNav(item.path, item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <div className="item-icon flex flex-shrink-0 items-center justify-center">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
              </div>
              <div className="item-content flex flex-col items-start overflow-hidden">
                <span className={`text-sm font-semibold tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
                  {item.label}
                </span>
                <span className={`item-sub text-[10px] uppercase tracking-wider truncate ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.sub}
                </span>
              </div>
              {item.type === 'ai' && (
                <span className="ai-tag bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto flex items-center gap-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_5px_#8b5cf6]"></span>
                  AI
                </span>
              )}
            </button>
          );
        })}
        <div className="mt-4 px-2">
          <button 
            className="w-full py-2.5 bg-transparent rounded-lg text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
            onClick={onToggleCopilot}
          >
            <Terminal size={16} />
            {!isCollapsed && <span>OmniMind Copilot</span>}
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <ComputeUsage />
        <div className="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="user-avatar" />
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">Alex Morgan</span>
              <span className="user-role">Administrator</span>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="system-status-mini">
            <div className="status-header">
              <span>System Status</span>
              <div className="status-dot glow-emerald" />
            </div>
            <div className="status-wave">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 25 5, 50 10 T 100 10" fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .omnisight-sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          z-index: 100;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .omnisight-sidebar.collapsed {
          width: 80px;
          padding: 24px 12px;
        }

        .collapse-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-dim);
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: -10px;
          top: 10px;
          z-index: 10;
          background: var(--bg-sidebar);
          transition: all 0.2s;
        }

        .omnisight-sidebar.collapsed .collapse-btn {
          right: auto;
          position: relative;
          top: 0;
        }

        .collapse-btn:hover {
          color: white;
          border-color: var(--primary);
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 1.5rem;
          min-height: 120px;
          transition: all 0.3s ease;
        }

        .omnisight-sidebar.collapsed .logo-container {
          min-height: 60px;
          border-bottom: none;
        }

        .ml-auto { margin-left: auto; }

        .omnisight-sidebar.collapsed .item-content,
        .omnisight-sidebar.collapsed .item-sub,
        .omnisight-sidebar.collapsed .ai-tag {
          display: none;
        }

        .omnisight-sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px 0;
        }


        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          position: relative;
          flex-shrink: 0;
          min-height: 56px;
        }

        .nav-item:active {
          transform: scale(0.98);
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .nav-item.active {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
          color: white;
          box-shadow: inset 2px 0 0 var(--primary);
        }

        .nav-item.active .item-icon {
          color: var(--primary);
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          transition: all 0.2s;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .item-label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .item-sub {
          font-size: 0.65rem;
          color: var(--text-dim);
          font-weight: 500;
        }

        .item-badge {
          background: var(--accent-rose);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .ai-tag {
          background: var(--primary);
          color: white;
          font-size: 0.55rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
        }

        .user-role {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        .system-status-mini {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .status-wave {
          height: 20px;
          opacity: 0.5;
        }

        .glow-emerald {
          background: var(--accent-emerald);
          box-shadow: 0 0 10px var(--accent-emerald);
        }
      `}</style>
    </aside>
  );
};
