import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/upload_pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const askQuestion = async (question: string, pdfName: string) => {
  const response = await axios.post(`${API_URL}/ask`, {
    question,
    pdf_name: pdfName,
  });
  
  return response.data;
};