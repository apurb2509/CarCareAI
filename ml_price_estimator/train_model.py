import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

print("⏳ Loading massive dataset...")
df = pd.read_csv("car_repair_dataset.csv")

X = df["description"]
y = df["estimated_price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

# Increased estimators to 300 for better learning
model = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), max_features=10000), 
    RandomForestRegressor(n_estimators=300, max_depth=None, random_state=42, n_jobs=-1)
)

print("⚙️  Training Super-Accuracy Model (this might take 30-60 seconds)...")
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print("-" * 40)
print(f"✅ New Model Accuracy (R² Score): {r2:.5f}") # Target > 0.95
print(f"📉 Average Error Margin: ₹{mae:.2f}")
print("-" * 40)

joblib.dump(model, "car_price_model.pkl", compress=3)
print("💾 Model saved.")

# Verification
test_samples = [
    "Cost of clutch plate replacement for Swift",
    "Cost of clutch plate replacement for BMW",
    "Ceramic coating for Fortuner",
    "Car wash price"
]

print("\n🧪 Final Checks:")
for text in test_samples:
    price = model.predict([text])[0]
    print(f"   '{text}' -> ₹{int(price)}")