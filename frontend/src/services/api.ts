import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_V1_URL = `${API_URL}/v1`;

export interface Conversation{
    conversation_id : string ,
    title : string ,
    created_at : string ,
}

export interface PDFInfo{
    pdf_id : string ,
    filename : string ,
    conversation_id? : string | null ,
    uploaded_at : string  
}

export interface ProviderConfig{
    llm_provider? : string | null ,
    embedding_provider? : string | null,
    verctordb_provider? : string | null ,
}


export interface UserCreate {
    email : string , 
    password : string
}

export interface UserLogin {
    email : string , 
    password : string
}

export interface UserResponse {
    id : string
    email : string , 
}

export interface LoginResponse {
    access_token : string
    token_type : string , 
}

export interface CurrentConfigReponse {
    llm_provider? : string | null ,
    embedding_provider? : string | null,
    verctordb_provider? : string | null ,
    llm_model? : string | null ,
    embedding_model : string | null,
    verctordb_index? : string | null ,
}


export interface QueryResponse {
  answer: string;
  conversation_id?: string | null;
}

export interface ChatRequest {
  conversation_id: string;
  message: string;
  top_k?: number;
  history_limit?: number;
}

export interface ChatResponse {
  conversation_id: string;
  user_message_id?: string | null;
  assistant_message_id?: string | null;
  answer: string;
}

export interface MessageResponseApi {
  conversation_id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  created_at: string;
}


export interface StatsResponse {
  total_conversations: number;
  total_pdfs: number;
  global_pdfs: number;
  conversation_pdfs: number;
}


const apiClient = axios.create({
    baseURL : API_V1_URL,
    headers : {"Content-Type" : "application/json"},
    timeout : 30000
})

// Add retry mechanism
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (axios.isAxiosError(error) && error.response?.status && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (i === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
};



