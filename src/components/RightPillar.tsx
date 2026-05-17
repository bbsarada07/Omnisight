import React, { useEffect, useRef } from 'react';
import { useAgentTelemetry } from '../hooks/useAgentTelemetry';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';

export const RightPillar: React.FC = () => {
    const { liveLogs, isConnected } = useAgentTelemetry();
    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Task 1: Auto-scroll to bottom every time a new log arrives
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [liveLogs]);

    return (
        <div className="right-pillar-container glass-card">
            {/* Task 2: Connection Status Indicator */}
            <div className="terminal-header">
                <div className="terminal-title">
                    <TerminalIcon size={16} />
                    <span>Agent Telemetry</span>
                </div>
                <div className="connection-status">
                    <div className={`status-dot ${isConnected ? 'connected' : 'reconnecting'}`} />
                    <span className="status-text">
                        {isConnected ? 'Live Telemetry: Connected' : 'Live Telemetry: Reconnecting...'}
                    </span>
                </div>
            </div>
            
            <div className="terminal-body">
                <div className="log-list">
                    <AnimatePresence initial={false}>
                        {liveLogs.map((log, index) => (
                            <motion.div
                                key={`${index}-${log}`}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="log-line font-mono text-sm text-green-400"
                            >
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={terminalEndRef} />
                </div>
            </div>

            <style>{`
                .right-pillar-container {
                    width: 320px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: rgba(5, 5, 10, 0.95) !important;
                    border-left: 1px solid rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                }

                .terminal-header {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .terminal-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                }

                .connection-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .status-dot.connected {
                    background: #27c93f;
                    box-shadow: 0 0 12px #27c93f;
                    animation: pulse-green 2s infinite;
                }

                .status-dot.reconnecting {
                    background: #ff5f56;
                    box-shadow: 0 0 12px #ff5f56;
                    animation: pulse-red 2s infinite;
                }

                @keyframes pulse-green {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }

                @keyframes pulse-red {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .status-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }

                .terminal-body {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .log-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .log-line {
                    line-height: 1.4;
                    word-break: break-all;
                }

                /* Scrollbar */
                .terminal-body::-webkit-scrollbar {
                    width: 4px;
                }
                .terminal-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};
