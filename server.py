"""
Flask Backend API for Rice Plant Disease Detection
Serves the TensorFlow CNN model + authentication endpoints.
"""

import os
import io
import json
import base64
import hashlib
import secrets
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from PIL import Image

# ============================================================================
#                         APP CONFIGURATION
# ============================================================================
app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# Simple JSON-based user store
USERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.json")

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ============================================================================
#                         LOAD MODEL
# ============================================================================
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "cnn_best_model.h5")

CLASS_NAMES = [
    'Bacterial Leaf Blight',
    'Brown Spot',
    'Healthy Rice Leaf',
    'Leaf Blast',
    'Leaf scald',
    'Sheath Blight'
]

DISEASE_INFO = {
    'Bacterial Leaf Blight': {
        'cause': 'Caused by the bacterium Xanthomonas oryzae pv. oryzae.',
        'symptoms': 'Water-soaked lesions on leaf tips and margins that turn yellow to white.',
        'management': 'Use resistant varieties, proper sanitation, avoid excess nitrogen.',
        'severity': 'high'
    },
    'Brown Spot': {
        'cause': 'Caused by Bipolaris oryzae fungus.',
        'symptoms': 'Circular or oval brown spots with gray or white centers.',
        'management': 'Use clean seeds, balanced fertilizer, and water management.',
        'severity': 'medium'
    },
    'Healthy Rice Leaf': {
        'cause': 'No disease detected — plant is healthy.',
        'symptoms': 'Green, vibrant leaves with no visible lesions.',
        'management': 'Maintain irrigation, balanced fertilization, and preventive care.',
        'severity': 'none'
    },
    'Leaf Blast': {
        'cause': 'Caused by the fungus Magnaporthe oryzae.',
        'symptoms': 'Diamond-shaped lesions with gray-white centers and dark borders.',
        'management': 'Use resistant varieties, proper spacing, and fungicides.',
        'severity': 'high'
    },
    'Leaf scald': {
        'cause': 'Caused by Microdochium oryzae.',
        'symptoms': 'Large oblong lesions with a scalded appearance on leaves.',
        'management': 'Use clean seeds, crop rotation, and balanced fertilization.',
        'severity': 'medium'
    },
    'Sheath Blight': {
        'cause': 'Caused by the fungus Rhizoctonia solani.',
        'symptoms': 'Oval lesions on leaf sheaths with white centers and brown margins.',
        'management': 'Avoid excess nitrogen, maintain spacing, and proper water levels.',
        'severity': 'high'
    }
}

model = None

def load_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print(f"Model loaded from {MODEL_PATH}")
    return model


def preprocess_image(img):
    img = img.resize((128, 128))
    img_array = np.array(img).astype('float32') / 255.0
    if len(img_array.shape) == 2:
        img_array = np.stack([img_array] * 3, axis=-1)
    if img_array.shape[-1] == 4:
        img_array = img_array[:, :, :3]
    return np.expand_dims(img_array, axis=0)


def predict(img):
    mdl = load_model()
    img_array = preprocess_image(img)
    predictions = mdl.predict(img_array, verbose=0)
    predicted_idx = int(np.argmax(predictions[0]))
    predicted_class = CLASS_NAMES[predicted_idx]
    confidence = float(predictions[0][predicted_idx]) * 100

    all_predictions = {
        CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
        for i in range(len(CLASS_NAMES))
    }

    info = DISEASE_INFO.get(predicted_class, {})

    return {
        'predicted_class': predicted_class,
        'confidence': round(confidence, 2),
        'all_predictions': all_predictions,
        'disease_info': info
    }


# ============================================================================
#                         AUTH ENDPOINTS
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided.'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400

    users = load_users()
    if email in users:
        return jsonify({'error': 'An account with this email already exists.'}), 409

    users[email] = {
        'name': name,
        'email': email,
        'password': hash_password(password)
    }
    save_users(users)

    return jsonify({
        'message': 'Account created successfully.',
        'user': {'name': name, 'email': email}
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided.'}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    users = load_users()
    user = users.get(email)

    if not user or user['password'] != hash_password(password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    return jsonify({
        'message': 'Login successful.',
        'user': {'name': user['name'], 'email': user['email']}
    })


@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    return jsonify({'status': 'ok'})


# ============================================================================
#                         PREDICTION ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    model_loaded = model is not None
    model_exists = os.path.exists(MODEL_PATH)
    return jsonify({
        'status': 'ok',
        'model_loaded': model_loaded,
        'model_exists': model_exists,
        'classes': CLASS_NAMES
    })


@app.route('/api/predict', methods=['POST'])
def predict_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename.'}), 400

    try:
        img = Image.open(file.stream).convert('RGB')
        result = predict(img)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/api/predict-frame', methods=['POST'])
def predict_frame():
    data = request.get_json()
    if not data or 'frame' not in data:
        return jsonify({'error': 'No frame data.'}), 400

    try:
        frame_data = data['frame']
        if ',' in frame_data:
            frame_data = frame_data.split(',')[1]

        img_bytes = base64.b64decode(frame_data)
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        result = predict(img)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'Frame prediction failed: {str(e)}'}), 500


# ============================================================================
#                         RUN SERVER
# ============================================================================
if __name__ == '__main__':
    try:
        load_model()
    except FileNotFoundError as e:
        print(f"Warning: {e}")

    app.run(host='0.0.0.0', port=5000, debug=True)
