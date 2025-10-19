from pinecone import Pinecone
from typing import List, Dict
from src.stores.vectordb.vectordb_interface import VectorDBInterface

class PineconeDB(VectorDBInterface):
    def __init__(self, api_key: str, index_name: str = "rag-index"):
        self.pc = Pinecone(api_key=api_key)
        self.index = self.pc.Index(index_name)
    
    def add_documents(self, texts: List[str], embeddings: List[List[float]], 
                     metadata: List[Dict], ids: List[str]):
        vectors = []
        for id, emb, meta, text in zip(ids, embeddings, metadata, texts):
            meta['text'] = text
            vectors.append((id, emb, meta))
        self.index.upsert(vectors=vectors)
    
    def search(self, query_embedding: List[float], top_k: int) -> List[Dict]:
        results = self.index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
        return [
            {"text": match['metadata'].get('text', ''), "metadata": match['metadata']}
            for match in results['matches']
        ]
