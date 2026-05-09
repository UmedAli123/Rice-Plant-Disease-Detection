import { useState, useRef } from 'react';
import { Upload, X, ScanSearch, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ImageUpload({ onResult }) {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
        if (!validTypes.includes(f.type)) {
            setError('Please upload a JPG, PNG, or BMP image.');
            return;
        }
        setError(null);
        setFile(f);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => handleFile(e.target.files[0]);

    const handlePredict = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Prediction failed');
            }

            const result = await res.json();
            onResult(result);
        } catch (err) {
            setError(err.message || 'Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPreview(null);
        setFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div>
            {!preview && (
                <div
                    className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.bmp"
                        onChange={handleChange}
                    />
                    <span className="upload-icon">
                        <Upload size={48} strokeWidth={1.5} />
                    </span>
                    <h3 className="upload-title">
                        {dragOver ? 'Drop your image here' : 'Drag & drop a rice leaf image'}
                    </h3>
                    <p className="upload-subtitle">or click to browse files</p>
                    <div className="upload-formats">
                        <span className="format-badge">JPG</span>
                        <span className="format-badge">PNG</span>
                        <span className="format-badge">BMP</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="form-error-banner">
                    {error}
                </div>
            )}

            {preview && (
                <div className="preview-container">
                    <div className="preview-card">
                        <img src={preview} alt="Uploaded rice leaf" className="preview-image" />
                        <div className="preview-actions">
                            <button className="btn btn-secondary" onClick={handleClear} disabled={loading}>
                                <X size={16} /> Remove
                            </button>
                            <button className="btn btn-primary btn-lg" onClick={handlePredict} disabled={loading}>
                                {loading ? (
                                    <><Loader2 size={18} className="spin" /> Analyzing...</>
                                ) : (
                                    <><ScanSearch size={18} /> Predict Disease</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner" />
                    <p className="spinner-text">Analyzing your image with AI...</p>
                </div>
            )}
        </div>
    );
}
