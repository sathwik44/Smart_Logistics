import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

print("--- SMART LOGISTICS: ML DRIVER EFFICIENCY PIPELINE ---")
print("1. Generating Synthetic Driver Performance Dataset...")

np.random.seed(42)
num_samples = 2000

# Features
# Driver base efficiency (50% to 100%)
driver_efficiency = np.random.uniform(50, 100, num_samples) 
# Route distance (10km to 1000km)
route_distance_km = np.random.uniform(10, 1000, num_samples)
# Weather Severity (0=Clear, 1=Rain, 2=Storm, 3=Extreme)
weather_severity = np.random.choice([0, 1, 2, 3], num_samples, p=[0.6, 0.2, 0.15, 0.05]) 
# Local Traffic Density (0 to 10)
traffic_density = np.random.uniform(0, 10, num_samples) 

# TARGET LABEL: Delay in Minutes
# The hidden rule: Bad weather and traffic cause a base delay. 
# BUT low efficiency drivers multiply that delay exponentially over long distances.
base_delay = (traffic_density * 5) + (weather_severity * 15)
driver_penalty = (100 - driver_efficiency) * 0.8 * (route_distance_km / 100)

# Add random real-world noise (accidents, bathroom breaks)
noise = np.random.normal(0, 10, num_samples)

# Total Delay (can't be negative)
delay_minutes = np.maximum(0, base_delay + driver_penalty + noise)

df = pd.DataFrame({
    'driver_efficiency': driver_efficiency,
    'route_distance_km': route_distance_km,
    'weather_severity': weather_severity,
    'traffic_density': traffic_density,
    'delay_minutes': delay_minutes
})

print("2. Training Random Forest Regressor...")
X = df.drop('delay_minutes', axis=1)
y = df['delay_minutes']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Notice we use Regressor (for numbers) instead of Classifier (for Yes/No)
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

print("\n3. Evaluating ETA Prediction Accuracy...")
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error: +/- {mae:.2f} minutes")
print(f"R-Squared (Accuracy fit): {r2_score(y_test, y_pred):.2f}")

print("\n4. Exporting Driver AI Model...")
model_filepath = os.path.join(os.path.dirname(__file__), "driver_delay_model.pkl")
joblib.dump(model, model_filepath)
print(f"Success! Model saved to: {model_filepath}")