# 🌾 Rice Plant Disease Detection

A professional Deep Learning application for real-time rice plant disease detection using Convolutional Neural Networks (CNN). This project achieves **89.93% accuracy** across 6 distinct categories, providing instant diagnosis and management recommendations.

## 🎯 Features
- **6 Disease Detection**: Bacterial Leaf Blight, Brown Spot, Leaf Blast, Leaf Scald, Sheath Blight, and Healthy Leaf Classification.
- **High Accuracy**: 89.93% validation accuracy using optimized CNN architecture.
- **Dual Interface**: Includes both a Streamlit web app and a modern React frontend.
- **Real-time Predictions**: Instant results with confidence scores and disease management strategies.
- **Educational Resource**: Detailed symptoms, causes, and treatment plans for each disease.

## 📁 Project Structure
```
Rice-Plant-Disease-Detection/
├── frontend/                  # Modern React-based user interface
├── models/                    # Pre-trained CNN model (.h5) and training history
├── extra/                     # Project presentation and documentation (PPT, DOCX)
├── leaf_app.py                # Streamlit-based web application
├── server.py                  # Backend server for the React frontend
├── rice_plant_disease.ipynb   # Model training and analysis notebook
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```

## 📋 System Requirements
- Python 3.8 or higher
- At least 2GB RAM recommended
- 500MB free disk space for model and dependencies

## 🚀 Installation & Setup

### Option 1: Local Setup (Recommended for Development)

#### Step 1: Navigate to project directory
```bash
cd "Rice-Plant-Disease-Detection"
```

#### Step 2: Create a virtual environment (optional but recommended)
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run the application
```bash
streamlit run leaf_app.py
```

The app will open automatically at `http://localhost:8501` in your browser.

---

### Option 2: Docker Setup (For Production/Deployment)

#### Step 1: Build the Docker image
```bash
docker build -t rice-disease-detector .
```

#### Step 2: Run the container
```bash
docker run -p 8501:8501 rice-disease-detector
```

Access the app at `http://localhost:8501`

---

## 💻 How to Use

1. **Upload an Image**
   - Click "Drag and drop file here" or "Browse files"
   - Supported formats: JPG, JPEG, PNG, BMP
   - Maximum file size: 200MB

2. **Get Prediction**
   - Click the "PREDICT DISEASE" button
   - Wait for the analysis (usually < 2 seconds)

3. **View Results**
   - Disease name and confidence percentage
   - Disease cause explanation
   - Symptoms to watch for
   - Management and treatment recommendations

4. **Try Another Image**
   - Click "DETECT ANOTHER IMAGE" to upload and analyze a new image

## 🤖 Model Information

| Property | Value |
|----------|-------|
| **Architecture** | CNN with Data Augmentation & Batch Normalization |
| **Input Size** | 128×128 RGB images |
| **Validation Accuracy** | 89.93% |
| **Total Parameters** | 2.78M |
| **Training Framework** | TensorFlow/Keras |
| **Model File** | `cnn_best_model.h5` |

## 📊 Dataset

The dataset used for training this model contains augmented rice leaf images across 6 disease categories.

## 🔬 Training & Analysis

For detailed model training, data preprocessing, and analysis, see `rice_plant_disease.ipynb`:
```bash
jupyter notebook rice_plant_disease.ipynb
```

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **TensorFlow/Keras** | Deep learning framework & CNN model |
| **Streamlit** | Web application framework |
| **React** | Modern frontend interface |
| **NumPy** | Numerical computations |
| **Pillow (PIL)** | Image processing |
| **OpenCV** | Computer vision utilities |

## 📝 License

MIT License - Feel free to use, modify, and distribute this project.

## 👨‍💼 Author

**Umed Ali** (FYP Project - Rice Plant Disease Detection)
