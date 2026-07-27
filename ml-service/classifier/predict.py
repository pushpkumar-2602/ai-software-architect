"""
============================================================
File: ml-service/classifier/predict.py
Purpose: Loads trained model and predicts requirement categories
============================================================
"""

import pickle
import os
import numpy as np


class RequirementClassifier:
    """
    Wrapper class for the trained requirement classifier.
    Provides prediction with confidence scores.
    """

    def __init__(self):
        model_path = os.path.join(
            os.path.dirname(__file__), 'model', 'classifier.pkl'
        )

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                f"Run train.py first."
            )

        with open(model_path, 'rb') as f:
            self.pipeline = pickle.load(f)

        self.categories = self.pipeline.classes_

    def predict(self, text: str) -> dict:
        """
        Predicts the category for a single requirement text.

        Args:
            text: The requirement text to classify

        Returns:
            Dict with 'category', 'confidence', and
            'all_probabilities'
        """
        # Get prediction and probabilities
        prediction = self.pipeline.predict([text])[0]
        probabilities = self.pipeline.predict_proba([text])[0]

        # Get confidence (max probability)
        confidence = float(np.max(probabilities))

        # Build probability map for all categories
        prob_map = {
            cat: round(float(prob), 4)
            for cat, prob in zip(self.categories, probabilities)
        }

        # Sort by probability descending
        sorted_probs = dict(
            sorted(prob_map.items(),
                   key=lambda x: x[1], reverse=True)
        )

        return {
            "category": prediction,
            "confidence": round(confidence, 4),
            "all_probabilities": sorted_probs
        }

    def predict_batch(self, texts: list) -> list:
        """
        Predicts categories for multiple requirement texts.

        Args:
            texts: List of requirement strings

        Returns:
            List of prediction dicts
        """
        return [self.predict(text) for text in texts]
