import random
import json
import pickle
import numpy as np
import nltk
import re
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS
from difflib import SequenceMatcher

# --- INITIALIZATION ---
print("⏳ Initializing Smart Search System (No AI)...")

lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())
knowledge = json.loads(open('car_knowledge.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbot_model.h5')

app = Flask(__name__)
CORS(app)

# Stopwords to ignore during search
STOPWORDS = {"what", "is", "the", "a", "an", "in", "on", "of", "for", "to", "and", "it", "does", "do", "are", "my", "car", "can", "you", "tell", "me", "about", "how", "much", "cost", "price"}

# Friendly openers to make it sound human
OPENERS = [
    "Here is the relevant information from the manual:",
    "I found this technical detail for you:",
    "According to the documentation:",
    "Here is the explanation found in the service guide:",
]

# --- TEXT CLEANING ENGINE ---
def clean_pdf_text(text):
    """
    Removes technical garbage from PDF text to make it readable.
    """
    # 1. Remove references to Figures/Tables (e.g., "See Figure 2.1", "Table 4-A")
    text = re.sub(r'(See )?(Figure|Fig\.|Table) \d+(\.\d+)?', '', text, flags=re.IGNORECASE)
    
    # 2. Remove isolated numbers (likely page numbers or markers)
    text = re.sub(r'\s\d{1,3}\s', ' ', text)
    
    # 3. Remove weird bullet points or artifacts
    text = text.replace('•', '').replace('', '').replace('', '')
    
    # 4. Remove "Chapter X" or "Section Y"
    text = re.sub(r'(Chapter|Section) \d+', '', text, flags=re.IGNORECASE)
    
    # 5. Collapse multiple spaces into one
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 6. Ensure it ends with punctuation
    if text and text[-1] not in '.!?':
        text += '.'
        
    return text

# --- SEARCH ENGINE ---
def search_pdf_library(query):
    # Clean query
    query_tokens = [w.lower() for w in nltk.word_tokenize(query) if w.isalnum()]
    keywords = [w for w in query_tokens if w not in STOPWORDS]
    
    if not keywords or "pdf_library" not in knowledge:
        return None

    best_score = 0
    best_text = None
    
    for entry in knowledge["pdf_library"]:
        chunk_text = entry["text"]
        chunk_lower = chunk_text.lower()
        
        # Scoring: +10 for each keyword match
        matches = sum(1 for k in keywords if k in chunk_lower)
        
        if matches > 0:
            score = matches * 10
            # Bonus: +20 if exact phrase exists
            if query.lower() in chunk_lower: score += 20
            # Bonus: +5 if it looks like a definition ("is a", "refers to")
            if "is a" in chunk_lower or "refers to" in chunk_lower: score += 5
            
            if score > best_score:
                best_score = score
                best_text = chunk_text

    # Threshold
    if best_score >= 10:
        cleaned_text = clean_pdf_text(best_text)
        opener = random.choice(OPENERS)
        return f"{opener}\n\n{cleaned_text}"
    
    return None

# --- NLP HELPERS ---
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: bag[i] = 1
    return np.array(bag)

def predict_class(sentence, model):
    p = bow(sentence, words)
    res = model.predict(np.array([p]))[0]
    results = [[i, r] for i, r in enumerate(res) if r > 0.25]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

# --- MAIN ROUTE ---
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        # 1. Intent Check
        ints = predict_class(message, model)
        intent_tag = ints[0]['intent'] if ints else "unknown"
        confidence = float(ints[0]['probability']) if ints else 0

        # 2. Logic Router
        if intent_tag == "price_redirect" and confidence > 0.8:
             response = "For accurate market prices, please use the 'Get Estimate' tool on our homepage."
        elif intent_tag == "greeting" and confidence > 0.8:
             response = "Hello! I am ready to help. Ask me technical questions about your car."
        elif intent_tag == "goodbye":
             response = "Drive safe! Taking care of your car is taking care of yourself."
        else:
            # 3. Smart Search (No AI Generation)
            search_result = search_pdf_library(message)
            
            if search_result:
                response = search_result
            else:
                response = "I checked the manual but couldn't find that specific detail. Could you try asking with the exact part name?"

        return jsonify({"response": response})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"response": "System Error."})

if __name__ == '__main__':
    app.run(debug=True, port=5001)