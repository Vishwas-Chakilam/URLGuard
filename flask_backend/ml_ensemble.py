"""
ML Ensemble Module
Loads all .pkl models and performs ensemble voting
"""

import os
import pickle
from collections import Counter
from typing import Dict, List, Tuple, Any
import pandas as pd

# Label mapping (encoded labels to string labels)
LABEL_MAPPING = {
    0: 'benign',
    1: 'defacement', 
    2: 'malicious',
    3: 'phishing',
}

# Reverse mapping
LABEL_TO_CODE = {v: k for k, v in LABEL_MAPPING.items()}

# Model files to load
MODEL_FILES = {
    'Random Forest': 'rf.pkl',
    'XGBoost': 'xgb.pkl',
    'LightGBM': 'lgbm.pkl',
    'Gradient Boosting': 'gbdt.pkl',
    'Naive Bayes': 'naive_bayes (1).pkl',
}


class MLEnsemble:
    """Ensemble of ML models for URL classification"""
    
    def __init__(self, models_dir: str = None):
        self.models_dir = models_dir or os.path.dirname(os.path.abspath(__file__))
        self.models: Dict[str, Any] = {}
        self.load_models()
    
    def load_models(self):
        """Load all available .pkl model files"""
        for name, filename in MODEL_FILES.items():
            filepath = os.path.join(self.models_dir, filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'rb') as f:
                        self.models[name] = pickle.load(f)
                    print(f"✓ Loaded {name} from {filename}")
                except Exception as e:
                    print(f"✗ Failed to load {name}: {e}")
            else:
                print(f"✗ Model file not found: {filename}")
        
        print(f"\nLoaded {len(self.models)} models: {list(self.models.keys())}")
    
    def predict_single(self, model_name: str, features_df: pd.DataFrame) -> Tuple[int, str]:
        """Get prediction from a single model"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not loaded")
        
        model = self.models[model_name]
        prediction_code = model.predict(features_df)[0]
        prediction_label = LABEL_MAPPING.get(prediction_code, 'unknown')
        
        return prediction_code, prediction_label
    
    def predict_all(self, features_df: pd.DataFrame) -> Dict[str, dict]:
        """Get predictions from all loaded models"""
        results = {}
        
        for name in self.models:
            try:
                code, label = self.predict_single(name, features_df)
                
                # Try to get probability/confidence if available
                confidence = None
                model = self.models[name]
                if hasattr(model, 'predict_proba'):
                    try:
                        proba = model.predict_proba(features_df)[0]
                        confidence = float(max(proba)) * 100
                    except:
                        pass
                
                results[name] = {
                    'prediction_code': int(code),
                    'prediction_label': label,
                    'confidence': confidence,
                }
            except Exception as e:
                results[name] = {
                    'error': str(e),
                    'prediction_label': 'error',
                }
        
        return results
    
    def ensemble_vote(self, features_df: pd.DataFrame) -> dict:
        """
        Perform ensemble voting - majority wins!
        Returns the final prediction and all individual model predictions.
        """
        all_predictions = self.predict_all(features_df)
        
        # Collect valid predictions for voting
        votes = []
        for name, result in all_predictions.items():
            if 'error' not in result:
                votes.append(result['prediction_label'])
        
        if not votes:
            return {
                'final_prediction': 'unknown',
                'final_label': 'Unknown',
                'confidence': 0,
                'vote_counts': {},
                'model_predictions': all_predictions,
                'total_models': len(self.models),
                'voting_models': 0,
            }
        
        # Count votes
        vote_counts = Counter(votes)
        winner, winner_count = vote_counts.most_common(1)[0]
        
        # Calculate ensemble confidence
        confidence = (winner_count / len(votes)) * 100
        
        # Map to display label
        display_labels = {
            'benign': 'Benign',
            'defacement': 'Defacement',
            'malicious': 'Malicious',
            'phishing': 'Phishing',
        }
        
        return {
            'final_prediction': winner,
            'final_label': display_labels.get(winner, winner.title()),
            'confidence': round(confidence, 1),
            'vote_counts': dict(vote_counts),
            'model_predictions': all_predictions,
            'total_models': len(self.models),
            'voting_models': len(votes),
        }


# Singleton instance
_ensemble_instance = None

def get_ensemble() -> MLEnsemble:
    """Get or create the singleton ensemble instance"""
    global _ensemble_instance
    if _ensemble_instance is None:
        _ensemble_instance = MLEnsemble()
    return _ensemble_instance

