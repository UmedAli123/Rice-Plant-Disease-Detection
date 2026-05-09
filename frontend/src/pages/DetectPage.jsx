import { ScanSearch } from 'lucide-react';
import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ResultDisplay from '../components/ResultDisplay';

export default function DetectPage() {
    const [result, setResult] = useState(null);

    const handleResult = (data) => {
        setResult(data);
        setTimeout(() => {
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }, 100);
    };

    const handleReset = () => {
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <span className="section-label"><ScanSearch size={14} /> Disease Detection</span>
                    <h2 className="section-title">Upload & Detect</h2>
                    <p className="section-subtitle">
                        Upload a rice leaf image to get instant AI-powered disease diagnosis
                    </p>
                </div>

                {!result ? (
                    <ImageUpload onResult={handleResult} />
                ) : (
                    <ResultDisplay result={result} onReset={handleReset} />
                )}
            </div>
        </div>
    );
}
