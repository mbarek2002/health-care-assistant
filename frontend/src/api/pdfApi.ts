import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"; // ajuster le port si besoin

// Liste des PDF (ex: GET /pdf/list)
export async function listPdfs(): Promise<any> {
	return axios.get(`${API_BASE}/pdf/list`).then(r => r.data);
}

// Générer un PDF (ex: POST /pdf/generate) — renvoie méta ou id
export async function generatePdf(payload: any): Promise<any> {
	return axios.post(`${API_BASE}/pdf/generate`, payload).then(r => r.data);
}

// Télécharger un PDF en blob (ex: GET /pdf/:id/download)
export async function downloadPdf(id: string): Promise<Blob> {
	const resp = await axios.get(`${API_BASE}/pdf/${encodeURIComponent(id)}/download`, {
		responseType: "blob",
	});
	return resp.data as Blob;
}

// Obtenir URL direct si backend expose /pdf/:id
export function pdfUrl(id: string): string {
	return `${API_BASE}/pdf/${encodeURIComponent(id)}`;
}