import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useDataStore } from '../store/useDataStore';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropzone: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isProcessing, setIsProcessing, setUploadedData } = useDataStore();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(10);

    // Simulate progress for better UX
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 100);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const formData = new FormData();
        formData.append("file", file); // MUST be "file"

        try {
          console.log("Initiating upload to http://localhost:8000/api/upload...");
          const response = await fetch("http://localhost:8000/api/upload", {
            method: "POST",
            body: formData,
          });
          
          console.log("Server responded with status:", response.status);
          
          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server Error ${response.status}: ${errText}`);
          }

          const data = await response.json();
          console.log("Parsed server response:", data);

          if (data.status !== "success") {
            throw new Error("Payload mismatch: Status was not success");
          }

          // IF SUCCESS: Clear any UI errors and trigger the dashboard view
          clearInterval(interval);
          setProgress(100);
          setError(null);
          
          setTimeout(() => {
            setUploadedData(results.data, results.meta.fields || [], file);
            navigate('/workspace/dashboard');
          }, 800);

        } catch (error: any) {
          console.error("UPLOAD PIPELINE FAILED:", error);
          clearInterval(interval);
          setError(`Sync failed: ${error.message}`);
          setIsProcessing(false);
        }
      },
      error: (err) => {
        clearInterval(interval);
        setError('Error parsing CSV: ' + err.message);
        setIsProcessing(false);
      }
    });
  }, [setIsProcessing, setUploadedData, navigate]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="dropzone-container">
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`glass-card dropzone-box ${dragActive ? 'active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="csv-upload" className="dropzone-label">
              <div className="icon-wrapper">
                <Upload size={48} className="upload-icon" />
              </div>
              <h3>Drop your CSV file here</h3>
              <p>or click to browse from your computer</p>
              <span className="file-info">Maximum file size: 50MB</span>
            </label>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card processing-box"
          >
            <div className="loading-content">
              <Loader2 size={48} className="animate-spin primary-text" />
              <h2>Ingesting Data Schema...</h2>
              <p>Structuring your data for optimal analysis</p>
              
              <div className="loading-bar-container">
                <motion.div 
                  className="loading-bar-fill" 
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}% Completed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .dropzone-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .dropzone-box {
          padding: 60px 40px;
          text-align: center;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .dropzone-box.active {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
          transform: scale(1.02);
        }

        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: var(--glass);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          border: 1px solid var(--glass-border);
        }

        .upload-icon {
          color: var(--primary);
        }

        .dropzone-box h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .dropzone-box p {
          color: var(--text-muted);
        }

        .file-info {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 12px;
        }

        .processing-box {
          padding: 60px 40px;
          text-align: center;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .primary-text {
          color: var(--primary);
        }

        .progress-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .error-message {
          margin-top: 24px;
          padding: 12px 20px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #fca5a5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};
