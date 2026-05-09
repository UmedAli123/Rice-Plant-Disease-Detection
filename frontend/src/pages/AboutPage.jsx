import { Info, Cpu } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <span className="section-label"><Info size={14} /> About</span>
                    <h2 className="section-title">About RiceGuard AI</h2>
                    <p className="section-subtitle">
                        A deep learning application for rice plant disease detection
                    </p>
                </div>

                {/* Model Info */}
                <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 700,
                        color: 'var(--color-accent-light)',
                        marginBottom: 'var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <Cpu size={22} /> Model Information
                    </h3>
                    <table className="model-info-table">
                        <tbody>
                            <tr>
                                <th>Architecture</th>
                                <td>CNN with Data Augmentation & Batch Normalization</td>
                            </tr>
                            <tr>
                                <th>Input Size</th>
                                <td>128 × 128 RGB images</td>
                            </tr>
                            <tr>
                                <th>Validation Accuracy</th>
                                <td style={{ color: 'var(--color-accent-light)', fontWeight: 700 }}>89.93%</td>
                            </tr>
                            <tr>
                                <th>Total Parameters</th>
                                <td>2.78 Million</td>
                            </tr>
                            <tr>
                                <th>Training Framework</th>
                                <td>TensorFlow / Keras</td>
                            </tr>
                            <tr>
                                <th>Backend</th>
                                <td>Flask REST API</td>
                            </tr>
                            <tr>
                                <th>Frontend</th>
                                <td>React + Vite</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
