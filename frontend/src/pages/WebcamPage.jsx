import { Camera } from 'lucide-react';
import WebcamDetection from '../components/WebcamDetection';

export default function WebcamPage() {
    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <span className="section-label"><Camera size={14} /> Real-Time Detection</span>
                    <h2 className="section-title">Live Camera</h2>
                    <p className="section-subtitle">
                        Point your camera at a rice leaf for real-time disease detection
                    </p>
                </div>

                <WebcamDetection />
            </div>
        </div>
    );
}
