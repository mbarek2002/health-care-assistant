import axios from 'axios';

const API_URL =  'http://localhost:8000';
const API_V1_URL = `${API_URL}/v1`;

export interface Conversation {
  conversation_id: string,
  title: string,
  created_at: string,
}

export interface PDFInfo {
  pdf_id: string,
  filename: string,
  conversation_id?: string | null,
  uploaded_at: string
}

export interface ProviderConfig {
  llm_provider?: string | null,
  embedding_provider?: string | null,
  vectordb_provider?: string | null,
}


export interface UserCreate {
  email: string,
  password: string
}

export interface UserLogin {
  email: string,
  password: string
}

export interface UserResponse {
  id: string
  email: string,
}

export interface LoginResponse {
  access_token: string
  token_type: string,
}

export interface CurrentConfigReponse {
  llm_provider?: string | null,
  embedding_provider?: string | null,
  vectordb_provider?: string | null,
  llm_model?: string | null,
  embedding_model: string | null,
  vectordb_index?: string | null,
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



// Prediction
export interface PredictionInputApi {
  gender: string;
  age: number;
  occupation: string;
  sleepDuration: number;
  sleepQuality: number;
  physicalActivityLevel: number;
  stressLevel: number;
  bmiCategory: string;
  heartRate: number;
  dailySteps: number;
  systolicBP: number;
  diastolicBP: number;

}
export interface PredictionOutputApi {
  predictedSleep: string;
}

export interface PredictionHistoryItem extends PredictionInputApi {
  _id: string;
  predicted_sleep_discord: string;
  created_at: string;
}

const apiClient = axios.create({
  baseURL: API_V1_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000
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

export const apiService = {

  // health
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const { data } = await axios.get(`${API_URL}/health`)
    return data
  },
  // Auth
  signup: async (user: UserCreate): Promise<UserResponse> => {
    const { data } = await apiClient.post("/auth/signup", user)
    return data as UserResponse
  },
  login: async (credentials: UserLogin): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/login", credentials)
    return data as LoginResponse
  },

  // Providers config
  getCurrentProviders: async (): Promise<ProviderConfig> => {
    const { data } = await apiClient.get('/config/providers')
    const res = data as CurrentConfigReponse;
    return {
      llm_provider: res.llm_provider ?? undefined,
      embedding_provider: res.embedding_provider ?? undefined,
      vectordb_provider: res.vectordb_provider ?? undefined,
    } as ProviderConfig
  },

  configureProviders: async (config: ProviderConfig) => {
    const { data } = await apiClient.post('/config/providers', config)
    return data as { message: string, config: ProviderConfig }
  },

  createConversation: async (title: string) => {
    return retryRequest(async () => {
      const { data } = await apiClient.post("/conversations", { title });
      return data as Conversation
    })
  },
  listConversations: async (title: string) => {
    return retryRequest(async () => {
      const { data } = await apiClient.get('/conversations');
      return data as Conversation[];
    });
  },

  getConversation: async (conversationId: string) => {
    return retryRequest(async () => {
      const { data } = await apiClient.get(`/conversations/${conversationId}`);
      return data as Conversation;
    });
  },
  deleteConversation: async (conversationId: string) => {
    return retryRequest(async () => {
      const { data } = await apiClient.delete(`/conversations/${conversationId}`);
      return data as { message: string };
    });
  },

  // PDFs
  UploadPDF: async (file: File, conversationId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    // Ensure field is present; send empty string for global uploads
    formData.append("conversation_id", conversationId ?? "")

    const { data } = await apiClient.post("/pdfs/upload", formData, {
      headers: { "Content-type": "multipart/form-data" }
    })

    return data as {
      pdf_id: string,
      filename: string,
      conversation_id?: string | null,
      message: string,
    }
  },

  UploadPDFBatch: async (files: File[], conversationId?: string) => {
    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    // Ensure field is present; send empty string for global uploads
    formData.append("conversation_id", conversationId ?? "")

    const { data } = await apiClient.post("/pdfs/upload-batch", formData, {
      headers: { "Content-type": "multipart/form-data" }
    })

    return data as {
      results: Array<{
        pdf_id: string,
        filename: string,
        conversation_id?: string | null,
        message: string,
      }>
    }
  },  
  getConversationPdfs :  async (conversationId : string ) => {
    return retryRequest(async()=>{
      const {data} = await apiClient.get(`/pdfs/conversation/${conversationId}`)
      return data as PDFInfo[]
    })
  },
  getGlobalPdfs :  async () => {
    return retryRequest(async()=>{
      const {data} = await apiClient.get(`/pdfs/global`)
      return data as PDFInfo[]
    })
  },
  getPdfInfo : async (pdfId : string) => {
    const { data } = await apiClient.get(`/pdfs/${pdfId}`)
    return data as PDFInfo;
  },
  deleteInfo : async (pdfId : string) => {
    const { data } = await apiClient.delete(`/pdfs/${pdfId}`)
    return data as {message : string};
  },

  // Query 
  queryRAG : async (question : string , conversationId?: string , topk : number = 3)=>{
    return retryRequest(async ()=>{
      const {data} = await apiClient.post("/chat/query",{
        question ,
        conversation_id : conversationId , 
        top_k :topk
      })

      return data as QueryResponse
    })
  },
  // Chat 
  chat : async (conversationId: string , message : string ,  topk : number = 3 , historyLimit : number = 20)=>{
    return retryRequest(async ()=>{
      const {data} = await apiClient.post("/chat",{
        conversation_id : conversationId , 
        message ,
        top_k :topk,
        history_limit :historyLimit
      })
      return data as ChatResponse
    })
  },

  // Conversation Messages
  listMessages : async (conversationId : string , limit : number =50)=>{
    return retryRequest(
      async ()=> {
        const { data } = await apiClient.get(`/conversations/${conversationId}/messages`,{
          params : {limit}
        })
        return data as MessageResponseApi[]
      }
    )
  },
  stats : async ()=> {
    const { data } = await apiClient.get('/stats')
    return data as StatsResponse
  },
  
  // Price Prediction
  predictPrice: async (payload: PredictionInputApi) => {
    return retryRequest(async () => {
      const { data } = await apiClient.post('/predict', payload);
      console.log(data)
      return data as PredictionOutputApi;
    });
  },

  listPredictions: async () => {
    return retryRequest(async () => {
      const { data } = await apiClient.get('/predict/predictions');
      return data as PredictionHistoryItem[];
    });
  },

}


