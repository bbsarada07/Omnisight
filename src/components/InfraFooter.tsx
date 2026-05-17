import React, { useState, useEffect } from 'react';

export const InfraFooter: React.FC = () => {
    const [latency, setLatency] = useState(32);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLatency = Math.floor(Math.random() * (56 - 24 + 1)) + 24;
            setLatency(newLatency);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="infra-footer">
            <div className="footer-left">
                <span>OmniSight Core v2.4.1</span>
                <div className="status-indicator">
                    <div className="pulse-dot" />
                    <span>SYSTEM_NOMINAL</span>
                </div>
            </div>

            <div className="footer-center">
                <span>CPU: 12% | RAM: 4.2GB / 16GB | Net: 1.2Gbps</span>
            </div>

            <div className="footer-right">
                <span>LATENCY: {latency}ms</span>
                <span className="heartbeat">HEARTBEAT_ACTIVE</span>
            </div>

            <style>{`
                .infra-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 32px;
                    background: #05080f;
                    border-top: 1px solid rgba(30, 41, 59, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 16px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 10px;
                    color: #64748b;
                    z-index: 2000;
                    letter-spacing: 0.5px;
                }

                .footer-left, .footer-center, .footer-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #10b981;
                }

                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #10b981;
                    animation: status-pulse 2s infinite;
                }

                @keyframes status-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .heartbeat {
                    color: #3b82f6;
                    opacity: 0.8;
                }

                .footer-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }
            `}</style>
        </footer>
    );
};
