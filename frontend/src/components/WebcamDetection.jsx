import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CameraOff, ScanSearch, Pause, Bug, Search, Pill, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function WebcamDetection() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);

    const [isStreaming, setIsStreaming] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [fps, setFps] = useState(0);

    const startCamera = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 640, height: 480 },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch {
            setError('Camera access denied. Please allow camera permissions in your browser.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsStreaming(false);
        setIsDetecting(false);
        setResult(null);
    };

    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.7);
    }, []);

    const startDetection = () => {
        setIsDetecting(true);
        let lastTime = performance.now();

        intervalRef.current = setInterval(async () => {
            const frame = captureFrame();
            if (!frame) return;

            try {
                const res = await fetch(`${API_URL}/predict-frame`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ frame }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setResult(data);
                    setError(null);
                    const now = performance.now();
                    setFps(Math.round(1000 / (now - lastTime)));
                    lastTime = now;
                }
            } catch {
                setError('Connection to server lost.');
            }
        }, 1500);
    };

    const stopDetection = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsDetecting(false);
        setResult(null);
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const isHealthy = result?.predicted_class === 'Healthy Rice Leaf';

    return (
        <div className="webcam-container">
            {error && (
                <div className="form-error-banner" style={{ marginBottom: 'var(--space-4)' }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="webcam-feed">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        display: isStreaming ? 'block' : 'none',
                        transform: 'scaleX(-1)',
                    }}
                />

                {!isStreaming && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--space-20)',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                    }}>
                        <Camera size={56} strokeWidth={1.2} style={{ marginBottom: 'var(--space-4)', opacity: 0.4 }} />
                        <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                            Camera Not Active
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)' }}>
                            Click "Start Camera" to begin live detection
                        </p>
                    </div>
                )}

                {isDetecting && result && (
                    <div className="webcam-overlay">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div className="overlay-label" style={{ color: isHealthy ? '#4ade80' : '#fbbf24' }}>
                                    {result.predicted_class}
                                </div>
                                <div className="overlay-confidence">
                                    {result.confidence.toFixed(1)}% confidence
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                                    <span className="webcam-pulse" />
                                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#f87171', fontWeight: 600 }}>LIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="webcam-controls">
                {!isStreaming ? (
                    <button className="btn btn-primary btn-lg" onClick={startCamera}>
                        <Camera size={18} /> Start Camera
                    </button>
                ) : (
                    <>
                        {!isDetecting ? (
                            <button className="btn btn-primary btn-lg" onClick={startDetection}>
                                <ScanSearch size={18} /> Start Detection
                            </button>
                        ) : (
                            <button className="btn btn-secondary btn-lg" onClick={stopDetection}>
                                <Pause size={18} /> Stop Detection
                            </button>
                        )}
                        <button className="btn btn-secondary" onClick={stopCamera}>
                            <CameraOff size={16} /> Stop Camera
                        </button>
                    </>
                )}
            </div>

            {isDetecting && result?.disease_info && (
                <div className="info-cards" style={{ marginTop: 'var(--space-8)' }}>
                    <div className="info-card">
                        <span className="info-card-icon"><Bug size={26} /></span>
                        <h3 className="info-card-title">Cause</h3>
                        <p className="info-card-text">{result.disease_info.cause}</p>
                    </div>
                    <div className="info-card">
                        <span className="info-card-icon"><Search size={26} /></span>
                        <h3 className="info-card-title">Symptoms</h3>
                        <p className="info-card-text">{result.disease_info.symptoms}</p>
                    </div>
                    <div className="info-card">
                        <span className="info-card-icon"><Pill size={26} /></span>
                        <h3 className="info-card-title">Management</h3>
                        <p className="info-card-text">{result.disease_info.management}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
