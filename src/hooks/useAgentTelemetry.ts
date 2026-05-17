import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAgentTelemetry Hook
 * 
 * Connects to the FastAPI WebSocket telemetry stream and maintains a list of live logs.
 * Includes a robust reconnection strategy (every 3 seconds) to handle backend drops.
 */
export const useAgentTelemetry = () => {
    const [liveLogs, setLiveLogs] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const connect = useCallback(() => {
        // Clean up any existing connection before creating a new one
        if (ws.current) {
            ws.current.close();
        }

        const socket = new WebSocket('ws://localhost:8000/ws/telemetry');

        socket.onopen = () => {
            console.log('📡 [TELEMETRY] Connection established');
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const message = event.data;
            setLiveLogs((prev) => {
                const newLogs = [...prev, message];
                // Limit to the last 50 messages to prevent memory leaks
                return newLogs.slice(-50);
            });
        };

        socket.onclose = () => {
            console.log('📡 [TELEMETRY] Connection closed. Retrying in 3s...');
            setIsConnected(false);
            
            // Reconnection strategy: Retry every 3 seconds
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = window.setTimeout(() => {
                connect();
            }, 3000);
        };

        socket.onerror = (error) => {
            console.error('📡 [TELEMETRY] WebSocket Error:', error);
            // Closing the socket will trigger the onclose handler for reconnection
            socket.close();
        };

        ws.current = socket;
    }, []);

    useEffect(() => {
        connect();

        // Cleanup on unmount
        return () => {
            if (ws.current) {
                ws.current.onclose = null; // Prevent reconnection on intentional unmount
                ws.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    return { liveLogs, isConnected };
};
