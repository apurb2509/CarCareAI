import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Download necessary NLTK data (run once)
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('punkt_tab')

print("⏳ Loading expanded intents...")
intents = json.loads(open('intents.json').read())

words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',', "'", '-']

# 1. Process the data
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenize each word
        word_list = nltk.word_tokenize(pattern)
        words.extend(word_list)
        # Add to documents in corpus
        documents.append((word_list, intent['tag']))
        # Add to classes list
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize and clean up
words = [lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore_letters]
words = sorted(list(set(words)))

classes = sorted(list(set(classes)))

print(f"✅ Data Processed: {len(documents)} documents, {len(classes)} classes, {len(words)} unique lemmatized words")

# Save words and classes for the actual chat system later
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# 2. Create Training Data
training = []
output_empty = [0] * len(classes)

for document in documents:
    bag = []
    word_patterns = document[0]
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    
    for word in words:
        bag.append(1) if word in word_patterns else bag.append(0)
    
    output_row = list(output_empty)
    output_row[classes.index(document[1])] = 1
    
    training.append([bag, output_row])

# Shuffle and convert to array
random.shuffle(training)
training = np.array(training, dtype=object)

train_x = list(training[:, 0])
train_y = list(training[:, 1])

# 3. Build a Bigger, Deeper Neural Network
print("⚙️  Building Advanced Neural Network...")
model = Sequential()

# Input Layer: Increased to 256 neurons for better pattern recognition
model.add(Dense(256, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))

# Hidden Layer 1: 128 neurons
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))

# Hidden Layer 2: 64 neurons (Added extra layer for depth)
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))

# Output Layer
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile model (Stochastic Gradient Descent)
# Reduced learning rate slightly for more precise convergence
sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# 4. Train the Model
# Increased Epochs to 300 to ensure 99% accuracy
print("🚀 Training Model (300 Epochs)...")
hist = model.fit(np.array(train_x), np.array(train_y), epochs=300, batch_size=5, verbose=1)

# Save the model
model.save('chatbot_model.h5')
print("✅ Done! Advanced Chatbot Model saved.")