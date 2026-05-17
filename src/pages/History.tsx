import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, date: '2026-05-16', transcript: 'Q1 vs Q2 Marketing Spend analysis by region', source: 'marketing_q2.csv', status: 'Success' },
  { id: 2, date: '2026-05-15', transcript: 'Customer Churn by Cohort (Jan-Apr)', source: 'user_churn_final.csv', status: 'Success' },
  { id: 3, date: '2026-05-14', transcript: 'Inventory velocity and stockout predictions', source: 'warehouse_data.csv', status: 'Success' },
  { id: 4, date: '2026-05-14', transcript: 'Executive summary of annual revenue', source: 'revenue_2025.csv', status: 'Success' },
  { id: 5, date: '2026-05-13', transcript: 'Employee sentiment vs productivity correlation', source: 'hr_survey.csv', status: 'Success' },
];

export const HistoryPage: React.FC = () => {
  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content">
        <header className="page-header">
          <div className="header-left">
            <h2>Query History</h2>
            <p>Review and re-run your autonomous agent sessions.</p>
          </div>
          <div className="search-bar glass-card">
            <Search size={18} />
            <input type="text" placeholder="Search history..." />
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="history-table-container glass-card"
        >
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Query Transcript</th>
                <th>Data Source</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((item) => (
                <tr key={item.id}>
                  <td className="date-cell">{item.date}</td>
                  <td className="transcript-cell">
                    <div className="transcript-content">
                      <FileText size={14} className="primary-text" />
                      {item.transcript}
                    </div>
                  </td>
                  <td>
                    <span className="source-badge">{item.source}</span>
                  </td>
                  <td>
                    <div className="status-badge-success">
                      <CheckCircle2 size={12} />
                      {item.status}
                    </div>
                  </td>
                  <td className="text-right">
                    <button className="btn-ghost">
                      <RotateCcw size={14} />
                      Re-run Query
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
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
          padding-top: 10px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
        }

        .header-left p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          width: 300px;
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          font-size: 0.9rem;
          width: 100%;
        }

        .history-table-container {
          flex: 1;
          overflow: hidden;
          padding: 0;
          background: rgba(15, 23, 42, 0.4) !important;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .history-table th {
          text-align: left;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-muted);
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .history-table td {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.8);
        }

        .history-table tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }

        .date-cell {
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .transcript-content {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }

        .source-badge {
          font-size: 0.75rem;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .status-badge-success {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .btn-ghost {
          background: transparent;
          border: none;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .text-right { text-align: right; }
      `}</style>
    </div>
  );
};
