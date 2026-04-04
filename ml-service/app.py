from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import io

app = Flask(__name__)
CORS(app)  # allows other services to talk to this

# ── Load model once when server starts ───────────────────
print("Loading model...")
model = tf.keras.models.load_model('models/waste_classifier_final.keras')

with open('models/class_indices.json', 'r') as f:
    raw = json.load(f)
index_to_class = {int(k): v for k, v in raw.items()}

print("Model ready! Classes:", list(index_to_class.values()))

# ── Helper: preprocess image ──────────────────────────────
def preprocess_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

# ── Helper: decide severity ───────────────────────────────
def get_severity(confidence):
    if confidence >= 0.80:
        return "LOW"
    else:
        return "HIGH"

# ── Route: health check ───────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({ "status": "ML service running" })

# ── Route: predict ────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    # Check if image was sent
    if 'file' not in request.files:
        return jsonify({ "error": "No image sent" }), 400

    file_bytes = request.files['file'].read()
    img_array  = preprocess_image(file_bytes)

    # Run model
    predictions   = model.predict(img_array, verbose=0)
    predicted_idx = int(np.argmax(predictions))
    waste_type    = index_to_class[predicted_idx]
    confidence    = float(np.max(predictions))
    severity      = get_severity(confidence)

    # Build all class scores
    all_scores = {
        index_to_class[i]: round(float(predictions[0][i]) * 100, 2)
        for i in range(len(predictions[0]))
    }

    return jsonify({
        "waste_type": waste_type,
        "confidence": round(confidence * 100, 2),
        "severity":   severity,
        "all_scores": all_scores
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)