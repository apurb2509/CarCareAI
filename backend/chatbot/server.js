require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pinecone } = require('@pinecone-database/pinecone');
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { PineconeStore } = require('@langchain/pinecone');
const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

// 1. Initialize AI Clients
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", 
  temperature: 0.3,
});

// 2. Initialize Embeddings
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
  res.send('🚗 CarCareAI Brain is Online & Connected to Pinecone.');
});

// Chat Route (RAG System)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ response: "Please send a message." });
    }

    console.log(`🔎 Searching Knowledge Base for: "${message}"`);

    // A. Search Pinecone for context
    const index = pinecone.Index(PINECONE_INDEX_NAME);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    // Get top 3 most relevant PDF chunks
    const results = await vectorStore.similaritySearch(message, 3);
    
    // Combine chunks into one block of text
    const context = results.map((r) => r.pageContent).join("\n\n---\n\n");
    
    console.log(`✅ Found ${results.length} relevant manual pages.`);

    // B. Create the Prompt (UPDATED WITH GUARDRAILS)
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are Carlo, an intelligent automotive AI assistant for 'CarCare AI'.
      Your ONLY purpose is to assist users with cars, vehicle maintenance, repairs, parts, and troubleshooting.

      STRICT GUARDRAILS:
      1. If the user asks about anything unrelated to cars, mechanics, or CarCare AI (e.g., coding, history, math, movies, cooking), you MUST politely decline.
      2. Refusal message: "I am sorry, but I can only assist with questions related to cars, repairs, and CarCare AI. Please ask me something automotive!"
      3. Do not attempt to answer non-car questions even if you know the answer.

      INSTRUCTIONS:
      - Use the provided Technical Context from the manuals to answer accurate details.
      - If the context doesn't have the answer, use your general automotive knowledge, but ONLY if it is about cars.
      - Be polite, professional, and concise.
      - Do not use asterisk or other formatting in your answer.
      - Please don't give very long answers to the user. Use very precise, concise and to the point responses to give to the user, maximum 5 sentences, i.e you can also give your response in 1 sentence if it can be concised.

      Context from Manuals:
      {context}
      
      User Question: {question}
      
      Answer:
    `);

    // C. Run the Chain
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke({
      context: context,
      question: message,
    });

    console.log("🤖 AI Answer Generated.");
    
    // Send back to Frontend
    res.json({ response: response });

  } catch (error) {
    console.error("❌ Error in Chat:", error);
    if (error.response) console.error("API Response:", error.response.data);
    
    res.status(500).json({ 
      response: "Sorry, I'm having trouble accessing my memory right now. Please try again." 
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});