import { create } from 'zustand';

interface LogEntry {
  id: string;
  role: 'SYSTEM' | 'DATA_ENGINEER' | 'QA_CRITIC' | 'VISUALIZER';
  message: string;
  timestamp: string;
}

interface DataState {
  uploadedFile: File | null;
  parsedData: any[];
  columns: string[];
  isProcessing: boolean;
  isOrchestrating: boolean;
  isLiveMode: boolean;
  terminalLogs: LogEntry[];
  activeAnalysisType: 'revenue' | 'churn' | 'generic' | null;
  computeCredits: number;
  lifetimeTokensProcessed: number;
  setUploadedData: (data: any[], columns: string[], file: File) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setOrchestrating: (isOrchestrating: boolean) => void;
  setLiveMode: (isLiveMode: boolean) => void;
  setAnalysisType: (type: 'revenue' | 'churn' | 'generic' | null) => void;
  addLog: (role: LogEntry['role'], message: string) => void;
  deductCredits: (amount: number) => void;
  clearLogs: () => void;
  reset: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  uploadedFile: null,
  parsedData: [],
  columns: [],
  isProcessing: false,
  isOrchestrating: false,
  isLiveMode: false,
  terminalLogs: [],
  activeAnalysisType: null,
  computeCredits: 150000,
  lifetimeTokensProcessed: 2450120,
  setUploadedData: (data, columns, file) => set({ 
    parsedData: data, 
    columns: columns, 
    uploadedFile: file,
    isProcessing: false 
  }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setOrchestrating: (isOrchestrating) => set({ isOrchestrating }),
  setLiveMode: (isLiveMode) => set({ isLiveMode }),
  setAnalysisType: (type) => set({ activeAnalysisType: type }),
  addLog: (role, message) => set((state) => ({
    terminalLogs: [...state.terminalLogs, {
      id: Math.random().toString(36).substr(2, 9),
      role,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]
  })),
  deductCredits: (amount) => set((state) => ({
    computeCredits: Math.max(0, state.computeCredits - amount),
    lifetimeTokensProcessed: state.lifetimeTokensProcessed + amount
  })),
  clearLogs: () => set({ terminalLogs: [] }),
  reset: () => set({ uploadedFile: null, parsedData: [], columns: [], isProcessing: false, isOrchestrating: false, terminalLogs: [], activeAnalysisType: null }),
}));
