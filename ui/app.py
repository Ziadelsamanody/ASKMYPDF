import os
import  langchain
import torch
import pypdf
import  dotenv
import streamlit as st
from pypdf import PdfReader
import pickle
from langchain.text_splitter import  RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings, SentenceTransformerEmbeddings
from langchain.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.chains.question_answering import load_qa_chain

dotenv.load_dotenv()
api_key = os.environ.get("GROQ_API_KEY")
# GROQ_API_KEY = st.secrets["api"]["key"]
# api_key = os.environ["GROQ_API_KEY"]
device = torch.device("cuda" if torch.cuda.is_available() else "cpu"
                      )

with st.sidebar:
    st.markdown("""
    <h1 style='text-align: center; color: #78ff87; font-family: Arial;'>
        <span style = 'color: #ffffff'>Ask </span>MyPDF
    </h1>
    """, unsafe_allow_html=True)

    st.markdown("""
    <h2 style='color: green; font-size: 18px;'>
        About
    </h2>
    <p style='color: #262730;'>
        This is an LLM-powered chatbot using:
    </p>
    """, unsafe_allow_html=True )

    st.markdown("""
    <ul style='color: red;'>
        <li>Streamlit</li>
        <li>LangChain</li>
        <li>Groq LLM</li>
        <li>Vector database</li>
    </ul>
    """, unsafe_allow_html=True)

    st.markdown("<hr style='border: 1px solid #f0f2f6'>", unsafe_allow_html=True)
    st.markdown("""
    <p style='text-align: center; color: #808495;'>
        Made by the Avengers
    </p>
    """, unsafe_allow_html=True)




def main():
    st.markdown("<h1 style= 'text-align:center; color: #78ff87;'><span style = 'color: #ffffff'>Ask </span>My PDF 📄</h1>", unsafe_allow_html=True)
    pdf = st.file_uploader("Upload your PDF", type="pdf")

    if pdf is not None:
        st.write(pdf.name)
        pdf_reader = PdfReader(pdf)
        text = ""
        for page in pdf_reader.pages : 
            text += page.extract_text()
    
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size= 500,
            chunk_overlap= 200,
            length_function= len
        )

        chunks = text_splitter.split_text(text=text)
 

        store_name = pdf.name[:-4] 

        if os.path.exists(f"{store_name}.pkl"):
            with open(f"{store_name}.pkl", "rb") as f:
                vector_store = pickle.load(f)
          
        else:
            embeddings = HuggingFaceEmbeddings(model_name="multi-qa-distilbert-cos-v1", cache_folder="./embeddings")
            vector_store = FAISS.from_texts(chunks, embeddings)
            with open(f"{store_name}.pkl", "wb") as f:
                pickle.dump(vector_store, f)
       

        query = st.text_input("Ask Questions to Your pdf 📝:")

        if query :
            docs = vector_store.similarity_search(query,k=3)

            llm = ChatGroq(
                model="llama-3.1-8b-instant",
                temperature=0,
                api_key=api_key)
            chain = load_qa_chain(llm=llm, chain_type="stuff")

            response = chain({"input_documents": docs, "question": query}, return_only_outputs=True)
            st.write(response["output_text"])





if __name__ == "__main__":
    main()
