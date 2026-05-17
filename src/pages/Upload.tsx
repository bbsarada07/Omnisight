import React from 'react';
import { motion } from 'framer-motion';
import { Dropzone } from '../components/Dropzone';
import { Sidebar } from '../components/Sidebar';

export const UploadPage: React.FC = () => {
  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content centered">
        <div className="background-glow"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcome-header"
        >
        <div className="login-badge">
          <span className="pulse-dot"></span>
          Last Login: Today, 08:30 AM
        </div>
        <h1>Welcome back, Admin.</h1>
        <p>Initialize your data environment for today's session.</p>
      </motion.div>

      <Dropzone />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="footer-hint"
      >
        Only CSV files are supported for initial schema mapping.
      </motion.div>

      <style>{`
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .background-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
          z-index: -1;
          pointer-events: none;
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .welcome-header h1 {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .login-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .footer-hint {
          margin-top: 48px;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
        }
      `}</style>
      </main>
    </div>
  );
};
