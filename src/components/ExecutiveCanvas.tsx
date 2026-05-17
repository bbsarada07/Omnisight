import React, { useEffect } from 'react';
import { useDataStore } from '../store/useDataStore';
import { RevenueChart, RegionChart, MetricsChart } from './AnalysisCharts';
import { motion } from 'framer-motion';
import { Download, Sparkles, FileText, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExecutiveCanvas: React.FC = () => {
  const { activeAnalysisType } = useDataStore();

  if (!activeAnalysisType) return null;

  const getInsight = () => {
    switch (activeAnalysisType) {
      case 'revenue': return "The Southern region outperformed the North by 14% in Q3, largely driven by enterprise sales and subscription renewals.";
      case 'churn': return "Predictive models identify a 22% risk increase in the 'Monthly Contract' segment. Immediate retention outreach is advised.";
      case 'generic': return "Global data ingestion complete. Detected high variance in standard deviations across customer lifetime value metrics.";
      default: return "";
    }
  };

  const generateExecutiveReport = async () => {
    const canvasElement = document.getElementById('exportable-report-canvas');
    if (!canvasElement) return;
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#0A0E17',
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    // Task 2: landscape, mm, a4
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('OmniSight_Executive_Brief.pdf');
  };

  useEffect(() => {
    const handleExportEvent = () => generateExecutiveReport();
    window.addEventListener('trigger-executive-export', handleExportEvent);
    return () => window.removeEventListener('trigger-executive-export', handleExportEvent);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="executive-canvas-wrapper"
    >
      <div className="canvas-header">
        <div className="canvas-title">
          <FileText size={20} className="primary-text" />
          <h2>Executive Canvas</h2>
        </div>
        <div className="canvas-actions">
          <button className="btn-outline" onClick={generateExecutiveReport}>
            <Download size={16} />
            Export Brief
          </button>
          <button 
            className="btn-icon-only" 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Share link copied to clipboard!");
            }}
            title="Share Report"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div id="exportable-report-canvas" style={{ background: '#0A0E17', padding: '20px', borderRadius: '16px' }}>
        <div className="canvas-content glass-card" style={{ background: 'transparent' }}>
          <div className="insight-card">
            <div className="insight-header">
              <Sparkles size={18} />
              <span>AI Insight Summary</span>
            </div>
            <p>{getInsight()}</p>
          </div>

          <div className="chart-container">
            {activeAnalysisType === 'revenue' && <RevenueChart />}
            {activeAnalysisType === 'churn' && <RegionChart />}
            {activeAnalysisType === 'generic' && <MetricsChart />}
          </div>
        </div>
      </div>

      <style>{`
        .executive-canvas-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .canvas-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .canvas-title h2 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .canvas-actions {
          display: flex;
          gap: 10px;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
        }

        .btn-icon-only {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .canvas-content {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: rgba(15, 23, 42, 0.4) !important;
        }

        .insight-card {
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 20px;
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .insight-card p {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          font-size: 1rem;
        }

        .chart-container {
          flex: 1;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-tooltip {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .custom-tooltip .label {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>
    </motion.div>
  );
};
