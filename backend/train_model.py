import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import os

print("--- SMART LOGISTICS: WEEK 4 ML PIPELINE ---")
print("1. Generating Synthetic Historical Dataset...")

# Set random seed for reproducibility
np.random.seed(42)
num_samples = 2000

# Generate Features
route_distance_km = np.random.uniform(50, 1000, num_samples)
nearest_incident_distance_km = np.random.uniform(0.1, 200, num_samples)
# 0=None, 1=Low, 2=Medium, 3=High
nearest_incident_severity = np.random.choice([0, 1, 2, 3], num_samples, p=[0.4, 0.3, 0.2, 0.1])
destination_windspeed = np.random.uniform(0, 80, num_samples) # km/h
is_raining = np.random.choice([0, 1], num_samples, p=[0.7, 0.3])

# Generate Target Label (is_disrupted: 1 if disrupted, 0 if normal)
# We embed realistic "hidden rules" that the Random Forest must learn:
# - If an incident is High severity AND within 20km, highly likely to disrupt.
# - If windspeed is > 60 km/h AND it's raining, likely to disrupt.
# - Otherwise, mostly safe with some random noise (accidents, etc.).
is_disrupted = []
for i in range(num_samples):
    prob_disruption = 0.05  # Base chance of random delay
    
    if nearest_incident_severity[i] == 3 and nearest_incident_distance_km[i] < 20:
        prob_disruption += 0.80
    elif nearest_incident_severity[i] == 2 and nearest_incident_distance_km[i] < 15:
        prob_disruption += 0.40
        
    if destination_windspeed[i] > 60 and is_raining[i] == 1:
        prob_disruption += 0.50
        
    # Cap probability and resolve to binary 0 or 1
    prob_disruption = min(prob_disruption, 0.95)
    disrupted = np.random.binomial(1, prob_disruption)
    is_disrupted.append(disrupted)

# Create DataFrame
df = pd.DataFrame({
    'route_distance_km': route_distance_km,
    'nearest_incident_distance_km': nearest_incident_distance_km,
    'nearest_incident_severity': nearest_incident_severity,
    'destination_windspeed': destination_windspeed,
    'is_raining': is_raining,
    'is_disrupted': is_disrupted
})

print(f"Dataset generated with {num_samples} records.")
print(f"Disruption Rate: {df['is_disrupted'].mean() * 100:.2f}%")

# 2. Data Preparation & Split
X = df.drop('is_disrupted', axis=1)
y = df['is_disrupted']

# 80% training, 20% testing split. Stratified to maintain class balance.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("\n2. Training Random Forest Classifier...")
# We use a Pipeline to ensure scaling and modeling are bundled together
# class_weight='balanced' prevents the model from ignoring the minority class
model_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, max_depth=10, class_weight='balanced', random_state=42))
])

model_pipeline.fit(X_train, y_train)

print("\n3. Evaluating Model Performance (Test Set)...")
y_pred = model_pipeline.predict(X_test)
y_prob = model_pipeline.predict_proba(X_test)[:, 1]

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")

print("\n4. Serializing and Exporting Model...")
model_filepath = os.path.join(os.path.dirname(__file__), "disruption_model.pkl")
joblib.dump(model_pipeline, model_filepath)
print(f"Success! Model exported to: {model_filepath}")