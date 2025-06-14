# 📄 AskMyPDF – LLM-Powered PDF Q&A Platform

![Logo](images/logo.png)

AskMyPDF is an AI-powered platform that lets you **ask natural language questions about your own PDFs**. It uses modern large language models (LLMs), embeddings, and a semantic search pipeline to deliver intelligent answers based on your documents.

🚀 **Try the live demo**: [https://ask-my-pdf-nu.vercel.app/](https://ask-my-pdf-nu.vercel.app/)

## 🧠 Core Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React / Vue / Next.js + Tailwind |
| AI Engine  | Python + LangChain + Groq (LLM)  |
| Embeddings | HuggingFace Transformers         |
| Vector DB  | FAISS (local vector store)       |
| PDF Reader | PyPDF                            |

## 🔧 Features

- 📤 Upload your PDF documents  
- 🤖 Ask contextual questions about them  
- 🧠 Powered by LLaMA-3.1 via Groq API  
- 💾 Local vector storage using FAISS  

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Ziadelsamanody/ASKMYPDF
cd askmypdf
```

### 3. Frontend Setup

```bash
cd Client
npm install
npm run dev
```

### 4. Python Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Python Dependencies

Create `requirements.txt` with:

```txt
langchain
langchain-groq
faiss-cpu
torch
transformers
pypdf
python-dotenv
```

## 🔌 API Endpoints

### Ask Questions

**POST** `/ask`

Ask questions about uploaded PDFs.

**Request Body**:

```json
{
  "pdf_name": "Introduction to Machine Learning",
  "question": "What is machine learning?"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GROQ_API_KEY | Your Groq API key | Yes |
| PORT | Backend server port | No |
| NODE_ENV | Environment (dev/prod) | No |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Acknowledgments

Made with ❤️ by the **Avengers** of AI 🚀

## ✅ Authors

* **Ziad Elsamanody** – [GitHub](https://github.com/Ziadelsamanody)
* **Zeyad Lotfy** - [GitHub](https://github.com/zeyadlotfy)
* **Ziad Ashraf** - [GitHub](https://github.com/Z-Ash0)