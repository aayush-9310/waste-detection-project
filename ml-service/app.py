from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import io

app = Flask(__name__)
CORS(app)

# ── Load BOTH models on startup ───────────────────────────
print("Loading models...")

waste_model    = tf.keras.models.load_model('models/waste_classifier_final.keras')
severity_model = tf.keras.models.load_model('models/severity_model_best.h5')

with open('models/class_indices.json', 'r') as f:
    waste_classes = {int(k): v for k, v in json.load(f).items()}

with open('models/severity_class_indices.json', 'r') as f:
    severity_classes = json.load(f)

print("Waste classes    :", list(waste_classes.values()))
print("Severity classes :", severity_classes)
print("Both models ready!")

# ── Reuse tips ────────────────────────────────────────────
TIPS = {
    "plastic": {
        "tips": [
            "Rinse and crush bottles before binning",
            "Reuse plastic bottles as planters",
            "Carry a cloth bag to avoid plastic bags",
            "Drop at nearest plastic collection point"
        ],
        "bin_color": "Blue bin"
    },
    "paper": {
        "tips": [
            "Shred and add to compost pile",
            "Use newspaper as gift wrap",
            "Use both sides before discarding",
            "Drop in dry waste bin"
        ],
        "bin_color": "Blue bin"
    },
    "cardboard": {
        "tips": [
            "Flatten before putting in bin",
            "Reuse boxes for storage",
            "Use as mulch in garden",
            "Drop at nearest recycling center"
        ],
        "bin_color": "Blue bin"
    },
    "metal": {
        "tips": [
            "Sell to local scrap dealer (kabadiwala)",
            "Rinse cans before recycling",
            "Never burn metal — releases toxic fumes",
            "Reuse tins as storage containers"
        ],
        "bin_color": "Blue bin"
    },
    "glass": {
        "tips": [
            "Reuse glass jars for storage",
            "Never mix with other recyclables",
            "Wrap broken glass before binning",
            "Drop at glass collection point"
        ],
        "bin_color": "Blue bin"
    },
    "biological": {
        "tips": [
            "Start a home compost bin",
            "Use as garden fertilizer",
            "Never mix with dry waste",
            "Drop in green / wet waste bin"
        ],
        "bin_color": "Green bin"
    },
    "battery": {
        "tips": [
            "NEVER throw in regular bin — toxic",
            "Drop at e-waste collection center",
            "Switch to rechargeable batteries",
            "Many malls have battery drop boxes"
        ],
        "bin_color": "E-waste bin (Red)"
    },
    "clothes": {
        "tips": [
            "Donate wearable clothes to NGOs",
            "Cut old clothes into cleaning rags",
            "Drop at cloth recycling bins",
            "Upcycle into bags or cushion covers"
        ],
        "bin_color": "Donation / textile bin"
    },
    "shoes": {
        "tips": [
            "Donate usable shoes to charity",
            "Repair before discarding",
            "Drop at NGO collection drives",
            "Check brands with shoe recycling programs"
        ],
        "bin_color": "Donation bin"
    },
    "trash": {
        "tips": [
            "Separate recyclables before binning",
            "Reduce single-use items",
            "Use dustbin instead of littering",
            "Report illegal dumping to your MNC"
        ],
        "bin_color": "Black / general waste bin"
    }
}

# ── Helper: preprocess image ──────────────────────────────
def preprocess(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

# ── Route: health check ───────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({ "status": "ML service running", "models": 2 })

# ── Route: predict ────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({ "error": "No image sent" }), 400

    file_bytes = request.files['file'].read()
    img_array  = preprocess(file_bytes)

    # ── Step 1: Check severity first ─────────────────────
    sev_preds   = severity_model.predict(img_array, verbose=0)
    sev_idx     = int(np.argmax(sev_preds))
    sev_label   = severity_classes[str(sev_idx)]   # "high" or "low"
    sev_conf    = float(np.max(sev_preds)) * 100
    severity    = sev_label.upper()

    # ── Step 2: Always classify waste type too ────────────
    waste_preds   = waste_model.predict(img_array, verbose=0)
    waste_idx     = int(np.argmax(waste_preds))
    waste_type    = waste_classes[waste_idx]
    waste_conf    = float(np.max(waste_preds)) * 100

    all_scores = {
        waste_classes[i]: round(float(waste_preds[0][i]) * 100, 2)
        for i in range(len(waste_preds[0]))
    }

    # ── Step 3: Build response based on severity ──────────
    tips = TIPS.get(waste_type, TIPS["trash"]) if severity == "LOW" else None

    return jsonify({
        "severity"      : severity,
        "severity_conf" : round(sev_conf, 2),
        "waste_type"    : waste_type,
        "waste_conf"    : round(waste_conf, 2),
        # "all_scores"    : all_scores,
        "tips"          : tips
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)