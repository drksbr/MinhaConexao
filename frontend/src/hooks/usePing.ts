// src/hooks/usePing.ts
import { useEffect, useRef, useState } from 'react';

interface PingData {
    ping: number;
    jitter: number;
}

const usePing = (url: string, interval: number = 1000, maxSamples: number = 30): PingData => {
    const ws = useRef<WebSocket | null>(null);
    const [ping, setPing] = useState<number | null>(null);
    const [jitter, setJitter] = useState<number | null>(null);
    const samples = useRef<number[]>([]);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            // console.log('WebSocket conectado');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const sentTime = data.sentTime;
            const now = Date.now();
            const rtt = now - sentTime;
            samples.current.push(rtt);

            if (samples.current.length > maxSamples) {
                samples.current.shift();
            }

            setPing(rtt);

            // Cálculo do jitter como desvio padrão das amostras
            const mean = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
            const variance = samples.current.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.current.length;
            setJitter(Math.sqrt(variance));
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket erro:', error);
        };

        ws.current.onclose = () => {
            // console.log('WebSocket desconectado');
        };

        return () => {
            ws.current?.close();
        };
    }, [url, maxSamples]);

    useEffect(() => {
        const sendPing = () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ sentTime: Date.now() }));
            }
        };

        const timer = setInterval(sendPing, interval);
        return () => clearInterval(timer);
    }, [interval]);

    return { ping: ping ?? 0, jitter: jitter ?? 0 };
};

export default usePing;
