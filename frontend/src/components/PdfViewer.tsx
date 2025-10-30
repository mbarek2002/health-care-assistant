import React, { useEffect, useState } from "react";
import { listPdfs, generatePdf, downloadPdf, pdfUrl } from "../api/pdfApi";

export default function PdfViewer() {
	const [pdfs, setPdfs] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		(async () => {
			try {
				const data = await listPdfs();
				setPdfs(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error(e);
				setMessage("Impossible de récupérer la liste des PDF (vérifier backend).");
			}
		})();
	}, []);

	const handleGenerate = async () => {
		setLoading(true);
		setMessage("");
		try {
			const res = await generatePdf({ /* exemple payload */ });
			// si l'API renvoie un id :
			if (res && res.id) {
				setMessage(`PDF généré: ${res.id}`);
				const data = await listPdfs();
				setPdfs(Array.isArray(data) ? data : []);
			} else {
				setMessage("PDF généré (réponse inattendue).");
			}
		} catch (e) {
			console.error(e);
			setMessage("Erreur génération PDF.");
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async (id: string) => {
		setLoading(true);
		try {
			const blob = await downloadPdf(id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${id}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (e) {
			console.error(e);
			setMessage("Erreur téléchargement PDF.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h3>PDFs</h3>
			<button onClick={handleGenerate} disabled={loading}>Générer un PDF</button>
			{message && <div>{message}</div>}
			<ul>
				{pdfs.map((p: any) => (
					<li key={p.id || p}>
						{p.name || p.id || p}
						{" "}
						<button onClick={() => handleDownload(p.id || p)}>Télécharger</button>
						{" "}
						{/* Si backend expose une URL directe */}
						<a href={pdfUrl(p.id || p)} target="_blank" rel="noreferrer">Ouvrir</a>
					</li>
				))}
			</ul>
		</div>
	);
}