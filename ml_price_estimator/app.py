from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes so React can access it

# 1. Load the trained model
model = joblib.load("car_price_model.pkl")

@app.route('/')
def home():
    return "CarCareAI Price Estimator is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the request
        data = request.get_json()
        user_description = data.get('description', '')

        if not user_description:
            return jsonify({'error': 'No description provided'}), 400

        # Predict the price
        predicted_price = model.predict([user_description])[0]
        
        # Round to nearest 50 for cleaner numbers
        final_price = round(predicted_price / 50) * 50

        return jsonify({
            'description': user_description,
            'estimated_price': int(final_price),
            'currency': 'INR'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run locally on port 5000
    app.run(debug=True, port=5000)