from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_pdf(pdf):
    pdf_reader = PdfReader(pdf)
    text = ""

    for page in pdf_reader.pages :
        text += page.extract_text() or ""
    return text


def split_text(text):
    splitter =  RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=300, length_function=len)
    chuncks =  splitter.split_text(text=text)
    
    return  chuncks
