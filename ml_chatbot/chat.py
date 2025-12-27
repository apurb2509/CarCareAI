import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize setup
lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbot_model.h5')

app = Flask(__name__)
CORS(app)  # Enable React to talk to this

# --- Helper Functions ---
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words, show_details=True):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    # bag of words - matrix of N words, vocabulary matrix
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence, model):
    # Filter out predictions below a threshold
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    
    # Sort by strength of probability
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def get_response(ints, intents_json):
    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

# --- API Routes ---

@app.route('/')
def home():
    return "CarCareAI Chatbot is Alive!"

@app.route('/chat', methods=['POST'])
def chat():
    message = request.json.get('message')
    
    # Predict the intent
    ints = predict_class(message, model)
    
    # If confidence is high, get response. Else, fallback.
    if ints and float(ints[0]['probability']) > 0.7:
        response = get_response(ints, intents)
    else:
        # Fallback for unknown questions
        response = "I don't know this answer. Sorry. I only answer questions related to cars and CarCareAI."
    
    return jsonify({"response": response})

if __name__ == '__main__':
    # Run on a different port (5001) so it doesn't clash with the Price Estimator (5000)
    app.run(debug=True, port=5001)