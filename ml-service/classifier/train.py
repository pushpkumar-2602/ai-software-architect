"""
============================================================
File: ml-service/classifier/train.py
Purpose: Trains a text classification model to categorize
         software requirements into system components
============================================================
"""

import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import (
    train_test_split, cross_val_score
)
from sklearn.metrics import classification_report


def train_model():
    """
    Trains a TF-IDF + Logistic Regression pipeline
    to classify requirements into categories.
    """

    # Load training data
    data_path = os.path.join(
        os.path.dirname(__file__), '..', 'data',
        'requirements_dataset.csv'
    )
    df = pd.read_csv(data_path)

    print(f"Loaded {len(df)} training examples")
    print(f"Categories: {df['category'].nunique()}")
    print("\nCategory distribution:")
    print(df['category'].value_counts())

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['category'],
        test_size=0.2,
        random_state=42,
        stratify=df['category']
    )

    # Build pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),      # Unigrams + bigrams
            stop_words='english',
            min_df=1,
            sublinear_tf=True         # Apply log normalization
        )),
        ('classifier', LogisticRegression(
            max_iter=1000,
            C=10.0,                   # Regularization
            class_weight='balanced',  # Handle class imbalance
            solver='lbfgs',
        ))
    ])

    # Train
    print("\nTraining model...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Cross-validation (on full dataset, small size so cv=3)
    cv_scores = cross_val_score(
        pipeline, df['text'], df['category'], cv=3
    )
    print(f"\nCross-validation accuracy: "
          f"{cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Save model
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    os.makedirs(model_dir, exist_ok=True)

    model_path = os.path.join(model_dir, 'classifier.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(pipeline, f)

    print(f"\nModel saved to: {model_path}")

    return pipeline


if __name__ == '__main__':
    train_model()
