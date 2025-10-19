import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
  size: string;
}

const Documents = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'medical-guidelines.pdf',
      uploadedAt: new Date('2024-01-15'),
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'health-research.pdf',
      uploadedAt: new Date('2024-01-10'),
      size: '1.8 MB',
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    // Mock upload - replace with actual API call later
    // POST /api/rag/upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      uploadedAt: new Date(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsUploading(false);

    toast({
      title: 'Upload successful',
      description: `${file.name} has been added to the RAG database.`,
    });

    // Reset input
    event.target.value = '';
  };

  const handleDelete = async (id: string, name: string) => {
    // Mock delete - replace with actual API call later
    // DELETE /api/rag/documents/{id}
    await new Promise(resolve => setTimeout(resolve, 500));

    setDocuments(prev => prev.filter(doc => doc.id !== id));

    toast({
      title: 'Document deleted',
      description: `${name} has been removed from the RAG database.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">RAG Documents</h1>
          <p className="text-muted-foreground">
            Upload PDF documents to enhance the AI's knowledge base
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Click to upload PDF file'}
                  </span>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Uploaded Documents ({documents.length})
            </h2>
            {documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploadedAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Documents;
