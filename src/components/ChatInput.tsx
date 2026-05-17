import React, { useState, useEffect, useCallback } from 'react';
import { useDataStore } from '../store/useDataStore';
// import { processUserQuery } from '../utils/nlpRouter'; (removed as logic moved to backend)
import { Send, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { generateSmartSuggestions } from '../utils/suggestionEngine';
import { Plus } from 'lucide-react';

export const ChatInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { 
    isOrchestrating, 
    setOrchestrating, 
    addLog, 
    clearLogs, 
    setAnalysisType,
    isLiveMode,
    columns 
  } = useDataStore();
  
  const suggestions = generateSmartSuggestions(columns);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const handleExecute = useCallback(async (textToExecute?: string) => {
    const finalQuery = textToExecute || query;
    if (!finalQuery.trim() || isOrchestrating) return;

    setOrchestrating(true);
    clearLogs();

    // Initial Telemetry for UX
    if (isLiveMode) {
      addLog('SYSTEM', 'Connecting to agentic loop...');
      // Task 3: Deduct credits for Live queries
      const creditCost = Math.floor(Math.random() * (2500 - 800 + 1)) + 800;
      useDataStore.getState().deductCredits(creditCost);
    } else {
      addLog('SYSTEM', 'Initiating Local Agentic Loop...');
    }

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: finalQuery,
          mode: isLiveMode ? 'live' : 'demo'
        })
      });

      await response.json();
      
      // We no longer manually loop through logs here as they come in via WebSocket
      // But we can still handle the final response data if needed.

      setAnalysisType('generic'); // Default for now, backend could provide this
      setOrchestrating(false);
      setQuery('');
    } catch (error) {
      addLog('SYSTEM', `Error: ${error}`);
      setOrchestrating(false);
    }
  }, [query, isOrchestrating, setOrchestrating, clearLogs, addLog, setAnalysisType, isLiveMode]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        recognitionInstance.stop(); // Stop listening instantly after capturing results
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [handleExecute]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setQuery('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="chat-input-container">
      {/* Smart Suggestions */}
      {!isOrchestrating && suggestions.length > 0 && (
        <div className="suggestions-bar">
          {suggestions.map((suggestion, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="suggestion-chip"
              onClick={() => {
                setQuery(suggestion);
                handleExecute(suggestion);
              }}
            >
              <Plus size={12} />
              {suggestion}
            </motion.button>
          ))}
        </div>
      )}

      <div className={`input-wrapper glass-card ${isListening ? 'listening-active' : ''}`}>
        <motion.div
          animate={isListening ? { scale: [1, 1.2, 1], color: ['#6366f1', '#ef4444', '#6366f1'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="sparkle-icon"
        >
          {isListening ? <Mic size={18} /> : <Sparkles size={18} />}
        </motion.div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isListening ? "Listening... Speak your query." : "Ask OmniSight to analyze revenue, churn, or data anomalies..."}
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          disabled={isOrchestrating}
        />

        <div className="input-actions">
          <button 
            className={`mic-toggle ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            disabled={isOrchestrating}
            title={isListening ? "Stop Listening" : "Start Voice Query"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button 
            className={`execute-btn ${isOrchestrating ? 'processing' : ''}`}
            onClick={() => handleExecute()}
            disabled={isOrchestrating || !query.trim() || isListening}
          >
            {isOrchestrating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Execute</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .chat-input-container {
          width: 100%;
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .suggestions-bar {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
        }

        .suggestions-bar::-webkit-scrollbar {
          display: none;
        }

        .suggestion-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .suggestion-chip:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--primary);
          color: white;
          transform: translateY(-1px);
        }

        .suggestion-chip svg {
          opacity: 0.6;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          padding: 8px 8px 8px 20px;
          gap: 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper.listening-active {
          border-color: #ef4444;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.15);
          background: rgba(239, 68, 68, 0.02) !important;
        }

        .input-wrapper:focus-within:not(.listening-active) {
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
        }

        .sparkle-icon {
          color: var(--primary);
          opacity: 0.7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 0.95rem;
          outline: none;
          padding: 10px 0;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.3s ease;
        }

        .listening-active input::placeholder {
          color: rgba(239, 68, 68, 0.5);
        }

        .input-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mic-toggle {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mic-toggle:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .mic-toggle.active {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
          animation: mic-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes mic-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        .execute-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          justify-content: center;
        }

        .execute-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .execute-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .execute-btn.processing {
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
      `}</style>
    </div>
  );
};
