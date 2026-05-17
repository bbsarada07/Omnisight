import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const NODES = [
    { name: 'New York', top: '35%', left: '25%' },
    { name: 'London', top: '25%', left: '48%' },
    { name: 'Tokyo', top: '38%', left: '85%' },
    { name: 'Sao Paulo', top: '70%', left: '35%' },
    { name: 'Sydney', top: '80%', left: '90%' },
    { name: 'Singapore', top: '55%', left: '78%' },
];

export const GlobalNodeMap: React.FC = () => {
    return (
        <div className="global-map-card glass-panel">
            <div className="card-header">
                <Globe size={18} className="text-primary" />
                <h3>Active Agent Swarm Nodes</h3>
            </div>

            <div className="map-container">
                {/* Task 1: Inline Stylized World Map */}
                <svg
                    viewBox="0 0 1000 500"
                    className="world-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M150,100 Q200,80 250,100 T350,120 T450,100 T550,110 T650,90 T750,100 T850,120 M100,200 Q150,180 200,200 T300,220 T400,200 T500,210 T600,190 T700,200 T800,220 M50,300 Q100,280 150,300 T250,320 T350,300 T450,310 T550,290 T650,300 T750,320 M200,400 Q250,380 300,400 T400,420 T500,400 T600,410 T700,390 T800,400 T900,420"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="2"
                        strokeDasharray="4 8"
                    />
                    {/* Simplified continents as dotted paths */}
                    <path
                        className="continent-path"
                        d="M210,130 L250,130 L270,180 L240,250 L200,230 Z M480,120 L530,110 L550,160 L500,180 Z M820,150 L880,160 L870,220 L810,210 Z M330,320 L380,330 L360,400 L310,380 Z M880,380 L930,390 L910,450 L860,430 Z"
                        fill="#1e293b"
                        fillOpacity="0.5"
                    />
                </svg>

                {/* Task 2: Ping Nodes */}
                {NODES.map((node, index) => (
                    <div
                        key={index}
                        className="node-point"
                        style={{ top: node.top, left: node.left }}
                    >
                        <div className="dot" />
                        <motion.div
                            className="ping"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: index * 0.3
                            }}
                        />
                    </div>
                ))}
            </div>

            <style>{`
                .global-map-card {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    overflow: hidden;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .card-header h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                }

                .map-container {
                    position: relative;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }

                .world-svg {
                    width: 100%;
                    height: auto;
                    opacity: 0.6;
                }

                .node-point {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    transform: translate(-50%, -50%);
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    background: #22d3ee;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #22d3ee;
                    position: relative;
                    z-index: 2;
                }

                .ping {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6px;
                    height: 6px;
                    border: 1.5px solid #22d3ee;
                    border-radius: 50%;
                    z-index: 1;
                }

                .continent-path {
                    filter: blur(1px);
                }
            `}</style>
        </div>
    );
};
