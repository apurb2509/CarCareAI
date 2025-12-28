import json
import re
import glob
import os
from pypdf import PdfReader

# 1. Configuration
PDF_PATTERN = os.path.join("knowledgebase", "knowledgebase_*.pdf")
JSON_DB_FILE = "car_knowledge.json"

def clean_text(text):
    """Removes extra spaces and weird formatting."""
    text = text.replace('\n', ' ')
    return re.sub(r'\s+', ' ', text).strip()

def is_garbage(text):
    """Returns True if the chunk looks like a Table of Contents or useless data."""
    # 1. If it has too many dots (Table of Contents usually has "Topic ..... 12")
    if text.count('.') > 3 and re.search(r'\.{4,}', text):
        return True
    # 2. If it's too short (headers, page numbers)
    if len(text) < 50:
        return True
    # 3. If it has too many numbers compared to letters (Index pages)
    digit_count = sum(c.isdigit() for c in text)
    if digit_count > len(text) / 4:
        return True
    return False

def chunk_text(text, chunk_size=400):
    """Splits text into meaningful paragraphs."""
    # Split by sentence endings (. ! ?)
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # Filter out garbage lines immediately
        if is_garbage(sentence):
            continue
            
        if len(current_chunk) + len(sentence) < chunk_size:
            current_chunk += sentence + " "
        else:
            if current_chunk: chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def extract_all_text_from_pdf(pdf_path):
    print(f"📖 Indexing: {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        # Skip the first 2 pages (usually Title/Copyright)
        start_page = 2 if len(reader.pages) > 5 else 0
        
        for i in range(start_page, len(reader.pages)):
            text = reader.pages[i].extract_text()
            if text:
                full_text += text + " "
        
        full_text_clean = clean_text(full_text)
        chunks = chunk_text(full_text_clean)
        
        print(f"   ✅ Cleaned & Indexed {len(chunks)} paragraphs.")
        return chunks

    except Exception as e:
        print(f"   ❌ Error reading {pdf_path}: {e}")
        return []

def update_json_database(all_chunks):
    print("\n💾 Updating Knowledge Base...")
    
    try:
        with open(JSON_DB_FILE, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {"parts": {}, "diagnostics": {}, "pdf_library": []}

    if "pdf_library" not in data:
        data["pdf_library"] = []

    # Reset library to avoid duplicates on re-run
    data["pdf_library"] = []

    count = 0
    for source_file, chunks in all_chunks.items():
        for text_chunk in chunks:
            entry = {"text": text_chunk, "source": source_file}
            data["pdf_library"].append(entry)
            count += 1

    with open(JSON_DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"🚀 Success! Database rebuilt with {count} high-quality entries.")

if __name__ == "__main__":
    pdf_files = glob.glob(PDF_PATTERN)
    if not pdf_files:
        print(f"⚠️ No files found matching '{PDF_PATTERN}'.")
    else:
        all_new_data = {}
        for pdf_file in pdf_files:
            file_chunks = extract_all_text_from_pdf(pdf_file)
            all_new_data[os.path.basename(pdf_file)] = file_chunks
        
        if all_new_data:
            update_json_database(all_new_data)