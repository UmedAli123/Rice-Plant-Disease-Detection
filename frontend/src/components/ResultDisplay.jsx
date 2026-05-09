import {
    ShieldCheck, ShieldAlert, AlertTriangle,
    Bug, Search, Pill, BarChart3, RotateCcw
} from 'lucide-react';

export default function ResultDisplay({ result, onReset }) {
    if (!result) return null;

    const { predicted_class, confidence, all_predictions, disease_info } = result;
    const isHealthy = predicted_class === 'Healthy Rice Leaf';

    const getConfidenceLevel = (conf) => {
        if (conf >= 80) return 'high';
        if (conf >= 50) return 'medium';
        return 'low';
    };

    const getSeverityLabel = (severity) => {
        switch (severity) {
            case 'none': return { icon: <ShieldCheck size={14} />, text: 'Healthy' };
            case 'medium': return { icon: <AlertTriangle size={14} />, text: 'Moderate Severity' };
            case 'high': return { icon: <ShieldAlert size={14} />, text: 'High Severity' };
            default: return { icon: null, text: '' };
        }
    };

    const sortedPredictions = Object.entries(all_predictions || {})
        .sort(([, a], [, b]) => b - a);

    const severity = getSeverityLabel(disease_info?.severity);

    return (
        <div className="result-section">
            {/* Header */}
            <div className="result-header">
                <h2 className={`result-disease-name ${isHealthy ? 'healthy' : 'diseased'}`}>
                    {predicted_class}
                </h2>

                {disease_info?.severity && (
                    <span className={`severity-badge ${disease_info.severity}`}>
                        {severity.icon}
                        <span>{severity.text}</span>
                    </span>
                )}
            </div>

            {/* Confidence Bar */}
            <div className="confidence-container">
                <div className="confidence-label">
                    <span>Confidence</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {confidence.toFixed(1)}%
                    </span>
                </div>
                <div className="confidence-bar">
                    <div
                        className={`confidence-fill ${getConfidenceLevel(confidence)}`}
                        style={{ width: `${confidence}%` }}
                    />
                </div>
            </div>

            {/* Disease Info Cards */}
            {disease_info && (
                <div className="info-cards">
                    <div className="info-card animate-in animate-in-delay-1">
                        <span className="info-card-icon"><Bug size={28} /></span>
                        <h3 className="info-card-title">Cause</h3>
                        <p className="info-card-text">{disease_info.cause}</p>
                    </div>
                    <div className="info-card animate-in animate-in-delay-2">
                        <span className="info-card-icon"><Search size={28} /></span>
                        <h3 className="info-card-title">Symptoms</h3>
                        <p className="info-card-text">{disease_info.symptoms}</p>
                    </div>
                    <div className="info-card animate-in animate-in-delay-3">
                        <span className="info-card-icon"><Pill size={28} /></span>
                        <h3 className="info-card-title">Management</h3>
                        <p className="info-card-text">{disease_info.management}</p>
                    </div>
                </div>
            )}

            {/* All Predictions Breakdown */}
            {sortedPredictions.length > 0 && (
                <div className="all-predictions glass-card" style={{ padding: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BarChart3 size={20} /> Class Probabilities
                    </h3>
                    {sortedPredictions.map(([name, value]) => (
                        <div key={name} className="prediction-row">
                            <span className="prediction-name">{name}</span>
                            <div className="prediction-bar-bg">
                                <div
                                    className={`prediction-bar-fill ${name === predicted_class ? 'top' : ''}`}
                                    style={{ width: `${value}%` }}
                                />
                            </div>
                            <span className="prediction-value">{value.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Reset */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                <button className="btn btn-secondary btn-lg" onClick={onReset}>
                    <RotateCcw size={18} /> Detect Another Image
                </button>
            </div>
        </div>
    );
}
