import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { RightPillar } from '../components/RightPillar';

export const ConsolePage: React.FC = () => {
  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content" style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <header className="page-header">
            <div className="header-left">
              <h2>Agent Console</h2>
              <p>Real-time telemetry and system logs from the autonomous agentic loop.</p>
            </div>
          </header>
          
          <div className="console-info glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>System Status</h3>
            <p>The OmniSight Agentic Engine is currently monitoring the data stream. All active agents are reporting telemetry via the secure WebSocket channel.</p>
          </div>
        </div>

        <RightPillar />
      </main>

      <style>{`
        .page-header {
          margin-bottom: 24px;
        }

        .header-left h2 {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .header-left p {
          color: var(--text-muted);
        }

        .console-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.4) !important;
        }
      `}</style>
    </div>
  );
};
