import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const ComputeUsage: React.FC = () => {
    const { computeCredits } = useDataStore();
    const [shouldShake, setShouldShake] = useState(false);
    const maxCredits = 150000;
    const percentage = (computeCredits / maxCredits) * 100;

    // Task 3: Trigger shake/flash when credits change
    useEffect(() => {
        if (computeCredits < maxCredits) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [computeCredits]);

    return (
        <div className="compute-usage-container">
            <div className="usage-header">
                <div className="usage-title">
                    <Cpu size={14} />
                    <span>Compute Engine Resources</span>
                </div>
                <Zap size={14} className={computeCredits < 10000 ? 'text-danger' : 'text-primary'} />
            </div>

            <div className="progress-container">
                <motion.div 
                    className="progress-bar-bg"
                    animate={shouldShake ? { 
                        x: [0, -2, 2, -2, 2, 0],
                        backgroundColor: ['rgba(30, 41, 59, 1)', 'rgba(99, 102, 241, 0.3)', 'rgba(30, 41, 59, 1)']
                    } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    />
                </motion.div>
            </div>

            <div className="usage-stats">
                <span className="credits-text">
                    {computeCredits.toLocaleString()} / {maxCredits.toLocaleString()} Credits
                </span>
                <span className="percentage-text">{Math.round(percentage)}%</span>
            </div>

            <style>{`
                .compute-usage-container {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    margin: 0 8px 16px;
                }

                .usage-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .usage-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .progress-container {
                    height: 8px;
                    width: 100%;
                    margin-bottom: 10px;
                }

                .progress-bar-bg {
                    height: 100%;
                    width: 100%;
                    background: #1e293b;
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #2563eb 0%, #22d3ee 100%);
                    border-radius: 4px;
                }

                .usage-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .credits-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }

                .percentage-text {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .text-danger { color: #ef4444; }
                .text-primary { color: var(--primary); }
            `}</style>
        </div>
    );
};
