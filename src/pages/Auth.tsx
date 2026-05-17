import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate enterprise auth delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/workspace/new');
    }, 1200);
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Brand & Vision */}
      <div className="auth-left">
        <div className="radial-glow"></div>
        <div className="auth-brand-content">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="brand-logo"
          >
            OmniSight
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The autonomous data <br /> intelligence platform.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="marquee-container"
          >
            <p className="trusted-text">TRUSTED BY GLOBAL ENTERPRISES</p>
            <div className="logo-grid">
              <div className="mock-logo">VENTURE_CAP</div>
              <div className="mock-logo">QUANTUM_SYS</div>
              <div className="mock-logo">NEXUS_BIO</div>
              <div className="mock-logo">AETHER_IND</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="auth-right">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card login-card"
        >
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Access your enterprise intelligence suite</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label><Mail size={16} /> Work Email</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div className="input-group">
              <label><Key size={16} /> Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div className="auth-actions">
              <button type="button" className="btn-sso">
                <ShieldCheck size={18} />
                Login via SSO
              </button>
              
              <button type="submit" className={`btn-primary btn-full ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <Lock size={12} />
            Protected by 256-bit AES Encryption
          </div>
        </motion.div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #000;
        }

        .auth-left {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          overflow: hidden;
        }

        .radial-glow {
          position: absolute;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 1) 60%);
          z-index: 0;
        }

        .auth-brand-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 600px;
        }

        .brand-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 40px;
          letter-spacing: -1px;
        }

        .auth-left h1 {
          font-size: 4.5rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -3px;
          color: white;
          margin-bottom: 60px;
        }

        .trusted-text {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 24px;
        }

        .logo-grid {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .mock-logo {
          font-weight: 900;
          color: rgba(255, 255, 255, 0.1);
          font-size: 1.2rem;
          letter-spacing: 2px;
        }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          padding: 40px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 48px;
          background: rgba(15, 23, 42, 0.6) !important;
        }

        .login-header {
          margin-bottom: 40px;
        }

        .login-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .login-header p {
          color: var(--text-muted);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-group input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 18px;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }

        .input-group input:focus {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .auth-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 12px;
        }

        .btn-sso {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .btn-sso:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
        }

        .btn-primary.loading {
          opacity: 0.8;
          cursor: wait;
        }

        .auth-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};
