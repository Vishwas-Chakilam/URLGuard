"""
URL Guard - Flask Backend API
Real ML model predictions with ensemble voting
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from urllib.parse import urlparse
import os

from feature_extractor import extract_features, features_to_dataframe, get_feature_descriptions
from ml_ensemble import get_ensemble
from data import TRUSTED_DOMAINS

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv("CLIENT_URL", "*"))

# Initialize ensemble on startup
print("\n🚀 Initializing ML Ensemble...")
ensemble = get_ensemble()
print("✓ ML Ensemble ready!\n")


def get_domain(url: str) -> str:
    """Extract domain from URL"""
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or ''
        # Remove www. prefix
        if hostname.startswith('www.'):
            hostname = hostname[4:]
        return hostname.lower()
    except:
        return ''


def is_trusted_domain(domain: str) -> bool:
    """Check if domain is in trusted list"""
    return domain in TRUSTED_DOMAINS


@app.get("/api/health")
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "models_loaded": len(ensemble.models),
        "model_names": list(ensemble.models.keys()),
    })


@app.post("/api/predict")
def predict():
    """
    Main prediction endpoint
    
    Request body: { "url": "https://example.com" }
    
    Response:
    {
        "url": "...",
        "domain": "...",
        "protocol": "https",
        "is_trusted": true/false,
        "features": { ... },
        "feature_chart_data": [ ... ],
        "prediction": {
            "final_label": "Benign",
            "confidence": 80.0,
            "vote_counts": { ... },
            "model_predictions": { ... },
        },
        "safety_score": 85,
        "explanation": [ ... ],
    }
    """
    payload = request.get_json() or {}
    url = payload.get("url", "").strip()
    
    if not url:
        return jsonify({"error": "url is required"}), 400
    
    # Ensure URL has protocol
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    try:
        # Extract domain and protocol
        parsed = urlparse(url)
        domain = get_domain(url)
        protocol = parsed.scheme or 'https'
        is_trusted = is_trusted_domain(domain)
        
        # Extract features
        features = extract_features(url)
        features_df = features_to_dataframe(features)
        
        # Prepare chart data for frontend
        feature_descriptions = get_feature_descriptions()
        chart_features = ['count.', 'count-www', 'count@', 'count_dir', 'count-https', 
                         'count-http', 'count%', 'count-', 'count=', 'count-digits', 'count-letters']
        
        feature_chart_data = [
            {
                'name': key.replace('count', '').replace('-', '').replace('.', 'Dots').replace('@', 'At').replace('%', 'Percent').replace('=', 'Equals') or key,
                'value': features[key],
                'fullName': feature_descriptions.get(key, key),
            }
            for key in chart_features
        ]
        
        # Check if trusted domain - skip ML, return benign
        if is_trusted:
            result = {
                'url': url,
                'domain': domain,
                'protocol': protocol,
                'is_trusted': True,
                'features': features,
                'feature_chart_data': feature_chart_data,
                'prediction': {
                    'final_prediction': 'benign',
                    'final_label': 'Benign',
                    'confidence': 99.0,
                    'vote_counts': {'benign': len(ensemble.models)},
                    'model_predictions': {name: {'prediction_label': 'benign', 'confidence': 99.0} for name in ensemble.models},
                    'total_models': len(ensemble.models),
                    'voting_models': len(ensemble.models),
                    'trusted_domain_override': True,
                },
                'safety_score': 95,
                'explanation': [
                    f'✓ Domain "{domain}" is in our trusted domains list.',
                    f'✓ Protocol: {protocol.upper()} ({"Secure" if protocol == "https" else "Not secure"})',
                    '✓ Skipped ML analysis - trusted domain.',
                ],
            }
            return jsonify(result)
        
        # Run ensemble prediction
        ensemble_result = ensemble.ensemble_vote(features_df)
        
        # Calculate safety score based on prediction
        safety_scores = {
            'benign': 90,
            'defacement': 60,
            'phishing': 35,
            'malicious': 15,
        }
        base_score = safety_scores.get(ensemble_result['final_prediction'], 50)
        
        # Adjust based on confidence
        confidence_factor = ensemble_result['confidence'] / 100
        safety_score = int(base_score * confidence_factor + (100 - base_score) * (1 - confidence_factor) * 0.3)
        safety_score = max(5, min(95, safety_score))
        
        # Adjust for protocol
        if protocol == 'http':
            safety_score = max(5, safety_score - 10)
        
        # Build explanation
        explanation = []
        
        if protocol == 'https':
            explanation.append('✓ Secure HTTPS connection detected.')
        else:
            explanation.append('⚠ HTTP connection - no encryption.')
        
        explanation.append(f'Domain "{domain}" is not in our trusted list - ML analysis performed.')
        
        # Feature-based explanations
        if features['use_of_ip']:
            explanation.append('⚠ URL uses IP address instead of domain name.')
        if features['short_url']:
            explanation.append('⚠ URL shortener detected - could hide malicious destination.')
        if features['sus_url']:
            explanation.append('⚠ Suspicious keywords found (login, bank, account, etc.).')
        if features['count@'] > 0:
            explanation.append('⚠ @ symbol in URL - potential credential harvesting.')
        if features['url_length'] > 75:
            explanation.append('⚠ Unusually long URL - often used in phishing.')
        
        # Model voting summary
        vote_summary = ', '.join([f"{k}: {v}" for k, v in ensemble_result['vote_counts'].items()])
        explanation.append(f'🗳 Ensemble vote: {vote_summary}')
        explanation.append(f'📊 {ensemble_result["voting_models"]}/{ensemble_result["total_models"]} models voted.')
        
        result = {
            'url': url,
            'domain': domain,
            'protocol': protocol,
            'is_trusted': False,
            'features': features,
            'feature_chart_data': feature_chart_data,
            'prediction': ensemble_result,
            'safety_score': safety_score,
            'explanation': explanation,
        }
        
        return jsonify(result)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "message": "Failed to analyze URL",
        }), 500


@app.get("/api/models")
def list_models():
    """List all loaded models"""
    return jsonify({
        "models": list(ensemble.models.keys()),
        "count": len(ensemble.models),
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    print(f"\n🌐 Starting URL Guard API on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
