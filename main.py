import os 
import pickle
import torch
import sys 
from flask import Flask, request ,json, jsonify
from process import (process_pdf, split_text)
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_groq  import ChatGroq
import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


load_dotenv()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = Flask(__name__)

api_key = os.getenv("GROQ_API_KEY")

embeddings = HuggingFaceBgeEmbeddings(model_name="multi-qa-distilbert-cos-v1", cache_folder="./embeddings")

app = Flask(__name__)

# Basic CORS setup - allows all origins (good for development)
CORS(app)

# OR - More specific CORS setup (recommended for production)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000' , 'https://ask-my-pdf-nu.vercel.app'])

# OR - Even more detailed CORS configuration
CORS(app,
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE'],
     allow_headers=['Content-Type', 'Authorization'])




@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Upload ur pdf"})

@app.route("/upload_pdf", methods=["POST"])

def upload_pdf():
    file = request.files.get("file")
    if file is None or not file.filename.endswith(".pdf"):
        return jsonify({"error" : "No valid PDF uploaded try again."}) , 400
    
    text = process_pdf(file)
    chuncks = split_text(text)
    store_name = file.filename[:-4]
    vector_store = FAISS.from_texts(chuncks, embeddings)

    # store the file in  embeddings vector store
    with open(f"{store_name}.pkl", "wb") as f :
        pickle.dump(vector_store, f)

    return jsonify({"message": f"PDF '{file.filename}' uploaded and processed."})

@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()
    question = data.get("question")
    pdf_name = data.get("pdf_name")

    if not question or not pdf_name :
        return jsonify({"error": "missing question or pdf_name"}), 400
    
    path = f"{pdf_name}.pkl"
    if not os.path.exists(path):
        return jsonify({"error": "PDF not found please upload it first"}), 404

    with open(path, "rb") as f:
        vector_store = pickle.load(f)

    docs = vector_store.similarity_search(question, k=5)

    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0, api_key=api_key)
    chain = load_qa_chain(llm=llm, chain_type="stuff")
    # response  = chain({"input_documnents": docs, "question": question}, return_only_outputs=True)
    response = chain.run(input_documents=docs, question=question)


    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)