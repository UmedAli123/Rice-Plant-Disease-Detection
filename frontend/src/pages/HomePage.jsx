import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DiseaseAccordion from '../components/DiseaseAccordion';
import {
    ScanSearch, Camera, Cpu, Zap, Microscope,
    FileText
} from 'lucide-react';

export default function HomePage() {
    const { user } = useAuth();

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-greeting">
                        Welcome back, <span className="hero-greeting-name">{user?.name || 'User'}</span>
                    </div>

                    <h1 className="hero-title">
                        Detect Rice Plant<br />
                        <span className="gradient-text">Diseases Instantly</span>
                    </h1>

                    <p className="hero-subtitle">
                        Upload a rice leaf photo or use your camera for real-time AI-powered
                        disease detection with detailed diagnosis and management recommendations.
                    </p>

                    <div className="hero-actions">
                        <Link to="/detect" className="btn btn-primary btn-lg">
                            <ScanSearch size={20} /> Upload & Detect
                        </Link>
                        <Link to="/webcam" className="btn btn-secondary btn-lg">
                            <Camera size={20} /> Live Camera
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="stat-value">89.93%</span>
                            <span className="stat-label">Model Accuracy</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-value">6</span>
                            <span className="stat-label">Disease Classes</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-value">2.78M</span>
                            <span className="stat-label">Parameters</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-value">&lt;2s</span>
                            <span className="stat-label">Prediction Time</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: 'var(--space-16) 0' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label"><Zap size={14} /> How It Works</span>
                        <h2 className="section-title">Three Simple Steps</h2>
                        <p className="section-subtitle">
                            From image capture to actionable diagnosis in seconds
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card animate-in animate-in-delay-1">
                            <div className="feature-icon">
                                <Camera size={26} />
                            </div>
                            <h3 className="feature-title">Capture or Upload</h3>
                            <p className="feature-desc">
                                Take a photo of a rice leaf using your camera or upload an existing image
                                in JPG, PNG, or BMP format.
                            </p>
                        </div>
                        <div className="feature-card animate-in animate-in-delay-2">
                            <div className="feature-icon">
                                <Cpu size={26} />
                            </div>
                            <h3 className="feature-title">AI Analysis</h3>
                            <p className="feature-desc">
                                Our CNN model analyzes the leaf image in under 2 seconds, classifying it
                                across 6 disease categories with confidence scores.
                            </p>
                        </div>
                        <div className="feature-card animate-in animate-in-delay-3">
                            <div className="feature-icon">
                                <FileText size={26} />
                            </div>
                            <h3 className="feature-title">Get Results</h3>
                            <p className="feature-desc">
                                Receive detailed disease information including cause, symptoms, and
                                actionable management recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diseases Accordion */}
            <section style={{ padding: 'var(--space-16) 0' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label"><Microscope size={14} /> Detection Scope</span>
                        <h2 className="section-title">Diseases We Detect</h2>
                        <p className="section-subtitle">
                            Click on any disease to learn more about its cause, symptoms, and management
                        </p>
                    </div>

                    <DiseaseAccordion />
                </div>
            </section>
        </>
    );
}
