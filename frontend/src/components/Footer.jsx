import { Leaf } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p className="footer-text">
                    <Leaf size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    <span className="accent">RiceGuard AI</span>
                    <span className="footer-sep">|</span>
                    Rice Plant Disease Detection
                    <span className="footer-sep">|</span>
                    Built with TensorFlow & React
                    <span className="footer-sep">|</span>
                    By <span className="accent">Umed Ali</span>
                </p>
            </div>
        </footer>
    );
}
