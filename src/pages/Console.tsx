import React, { useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAgentTelemetry } from '../hooks/useAgentTelemetry';
import { Terminal as TerminalIcon, Cpu, Activity, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ConsolePage: React.FC = () => {
  const { liveLogs, isConnected } = useAgentTelemetry();
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveLogs]);

  return (
    <div className="workspace-layout bg-[#02040A]">
      <Sidebar />
      
      <main className="workspace-content bg-[#05080F] flex flex-col p-6 w-full h-full">
        <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
              <TerminalIcon className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Agent Terminal Core</h2>
              <p className="text-sm text-slate-400">Live Telemetry & Orchestration Engine Logs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-[#0A0E17] px-4 py-2 rounded-lg border border-slate-800">
              <Cpu className="text-slate-400 w-4 h-4" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Active Nodes</span>
                <span className="text-sm text-white font-mono">3 / 3 Online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#0A0E17] px-4 py-2 rounded-lg border border-slate-800">
              <Radio className={isConnected ? "text-emerald-400 w-4 h-4 animate-pulse" : "text-red-400 w-4 h-4"} />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Connection Status</span>
                <span className={isConnected ? "text-sm text-emerald-400 font-mono" : "text-sm text-red-400 font-mono"}>
                  {isConnected ? "SECURE_WSS" : "DISCONNECTED"}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 bg-[#02040A] rounded-xl border border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0E17] border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-4 text-xs font-mono text-slate-500">user@omnisight:~/orchestration/logs</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
            <AnimatePresence initial={false}>
              {liveLogs.length === 0 ? (
                <div className="text-slate-500 flex flex-col items-center justify-center h-full gap-4">
                  <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
                  <span>Awaiting agent activity...</span>
                </div>
              ) : (
                liveLogs.map((log, index) => (
                  <motion.div
                    key={`${index}-${log}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-2 flex items-start gap-3"
                  >
                    <span className="text-slate-600 select-none">
                      {new Date().toISOString().split('T')[1].substring(0, 12)}
                    </span>
                    <span className="text-emerald-400 break-words flex-1">
                      {log}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={terminalEndRef} />
          </div>
        </div>
      </main>
    </div>
  );
};
