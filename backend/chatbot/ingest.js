require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pinecone } = require('@pinecone-database/pinecone');
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { PineconeStore } = require('@langchain/pinecone');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

// 1. Configuration
const DIRECTORY_PATH = path.join(__dirname, 'documents');
const INDEX_NAME = process.env.PINECONE_INDEX_NAME;

// 2. Initialize Pinecone Client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const runIngestion = async () => {
  console.log("🚀 Starting Ingestion Process...");

  // A. Check if 'documents' folder exists
  if (!fs.existsSync(DIRECTORY_PATH)) {
    console.error(`❌ Error: Folder 'documents' not found at ${DIRECTORY_PATH}`);
    return;
  }

  // B. Load all PDFs using LangChain PDFLoader
  const files = fs.readdirSync(DIRECTORY_PATH).filter((file) => file.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log("⚠️ No PDF files found in the 'documents' folder.");
    return;
  }

  console.log(`📄 Found ${files.length} PDFs: ${files.join(', ')}`);
  
  const rawDocs = [];
  
  for (const file of files) {
    console.log(`   - Loading ${file}...`);
    const filePath = path.join(DIRECTORY_PATH, file);
    
    // Use the official PDFLoader
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    // Add these page documents to our master list
    // We modify metadata slightly to ensure the source filename is clear
    docs.forEach(doc => {
        doc.metadata.source = file;
        rawDocs.push(doc);
    });
  }

  console.log(`   ✅ Loaded ${rawDocs.length} pages of text.`);

  // C. Split Text into Chunks
  console.log("✂️  Splitting text into smaller chunks for AI...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const splitDocs = await splitter.splitDocuments(rawDocs);
  console.log(`   ✅ Created ${splitDocs.length} vector chunks.`);

  // D. Generate Embeddings & Upload to Pinecone
  console.log("🔮 Generating Embeddings and uploading to Pinecone...");
  
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_TOKEN, 
    model: "sentence-transformers/all-MiniLM-L6-v2", 
  });

  const index = pinecone.Index(INDEX_NAME);

  // Upload to Pinecone
  await PineconeStore.fromDocuments(splitDocs, embeddings, {
    pineconeIndex: index,
  });

  console.log("🎉 Success! Knowledge Base updated.");
};

runIngestion().catch((err) => {
  console.error("❌ Ingestion Failed:", err);
});