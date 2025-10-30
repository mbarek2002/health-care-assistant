# Analyse rapide du backend — detection des endpoints PDF

Étapes pour détecter les API PDF dans le backend (exécuter dans le dossier `backend`):

1. Rechercher occurrences "pdf" dans le code :
   - Windows PowerShell :
     - gci -Recurse -Include *.js,*.ts,*.py,*.java | Select-String -Pattern "pdf" -List
   - Git Bash / WSL / macOS / Linux :
     - grep -Rni --include=\*.{js,ts,py,java,go,rb} "pdf" .

2. Rechercher routes/express/fastify :
   - grep -Rni "router" .
   - grep -Rni "app.post" .
   - grep -Rni "/pdf" .

3. Exemples d'endpoints possibles à vérifier :
   - GET  /pdf/list
   - POST /pdf/generate
   - GET  /pdf/:id/download
   - GET  /pdf/:id (renvoie application/pdf)

4. Vérifier contrôleurs pour les mots-clés :
   - "Content-Type: application/pdf"
   - "res.download"
   - "res.setHeader('Content-Type', 'application/pdf')"

5. Tester manuellement avec curl ou Postman une fois les endpoints identifiés :
   - curl -v "http://localhost:PORT/pdf/list"
   - curl -v -X POST "http://localhost:PORT/pdf/generate" -H "Content-Type: application/json" -d '{"data": ...}' --output out.pdf

Remarque : ne pas modifier les fichiers backend. Une fois les endpoints confirmés, adaptez les URLs dans le wrapper frontend `frontend/src/api/pdfApi.ts`.
