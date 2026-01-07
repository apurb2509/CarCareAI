const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Database & Route Imports
// Matches your folder structure: backend/database/db.js and backend/routes/authRoutes.js
const connectDB = require('./database/db'); 
const authRoutes = require('./routes/authRoutes');

// AI & Chatbot Imports
const { Pinecone } = require('@pinecone-database/pinecone');
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { PineconeStore } = require('@langchain/pinecone');
const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

const app = express();

// 2. Initialize Database Connection
connectDB();

// 3. Middleware
// Enable CORS for frontend requests
app.use(cors({
  origin: "http://localhost:5173", // Ensure this matches your Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// --- ROUTES ---

// Auth Routes (Login/Register)
app.use('/api/auth', authRoutes);

// Main Health Check
// FIX: Returns JSON to prevent "Unexpected token <" error in frontend
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "Online", 
    message: "🚗 CarCareAI Universal Server is Online." 
  });
});

// Universal Chat Route (RAG System)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ response: "Please send a message." });

    // Check if API keys exist to prevent crashes
    if (!process.env.PINECONE_API_KEY || !process.env.GROQ_API_KEY) {
      return res.status(503).json({ response: "AI Service Unavailable: Missing API Keys." });
    }

    console.log(`🔎 Searching Knowledge Base for: "${message}"`);

    // Initialize AI Services (Scoped to request for safety)
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    // Similarity Search
    const results = await vectorStore.similaritySearch(message, 3);
    const context = results.map((r) => r.pageContent).join("\n\n---\n\n");

    // Initialize Chat Model
    const aiModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant", 
      temperature: 0.3,
    });

    // Prompt Template
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are Carlo, an intelligent automotive AI assistant for 'CarCare AI'.
      Your ONLY purpose is to assist users with cars, vehicle maintenance, repairs, parts, and troubleshooting.

      STRICT GUARDRAILS:
      1. If the user asks about anything unrelated to cars, mechanics, or CarCare AI, you MUST politely decline.
      2. Refusal message: "I am sorry, but I can only assist with questions related to cars, repairs, and CarCare AI. Please ask me something automotive!"
      
      INSTRUCTIONS:
      - Handling Greetings: Reply warmly to Hi/Hello/Bye.
      - Be polite, professional, and concise (max 5 sentences).
      - Do not use asterisks or special formatting.

      Context from Manuals:
      {context}
      
      User Question: {question}
      
      Answer:
    `);

    const chain = RunnableSequence.from([
      promptTemplate,
      aiModel,
      new StringOutputParser(),
    ]);

    const aiResponse = await chain.invoke({
      context: context,
      question: message,
    });

    res.json({ response: aiResponse });

  } catch (error) {
    console.error("❌ Error in Chat:", error);
    res.status(500).json({ response: "Sorry, I'm having trouble accessing my memory right now." });
  }
});

// 4. Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Universal Server running on http://localhost:${PORT}`);
});