import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const body = isLogin ? { email, password } : { name, email, password };

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong.');
            }

            login(data.user);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-pattern" />

            <div className="auth-container">
                {/* Left: Branding Panel */}
                <div className="auth-branding">
                    <div className="auth-brand-content">
                        <div className="auth-logo">
                            <Leaf size={32} strokeWidth={2.5} />
                        </div>
                        <h1 className="auth-brand-title">RiceGuard AI</h1>
                        <p className="auth-brand-desc">
                            Advanced rice plant disease detection powered by deep learning.
                            Protect your crop with AI-driven diagnostics.
                        </p>
                        <div className="auth-brand-features">
                            <div className="auth-feature">
                                <div className="auth-feature-dot" />
                                <span>89.93% Detection Accuracy</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-dot" />
                                <span>6 Disease Classifications</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-dot" />
                                <span>Real-time Camera Detection</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-dot" />
                                <span>Instant Diagnosis Reports</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="auth-form-panel">
                    <div className="auth-form-inner">
                        <div className="auth-form-header">
                            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                            <p>{isLogin ? 'Sign in to access the detection platform' : 'Get started with RiceGuard AI'}</p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="btn-loading" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-switch">
                            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                            <button type="button" className="auth-switch-btn" onClick={switchMode}>
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
