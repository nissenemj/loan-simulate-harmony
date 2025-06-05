import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  File, 
  Image, 
  Trash2, 
  Download, 
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

const FileStorage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    // Simulate file upload
    setTimeout(() => {
      const newFiles = selectedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      }));

      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setUploading(false);
      toast({
        title: "Tiedostot ladattu!",
        description: "Tiedostot ladattiin onnistuneesti",
      });
    }, 2000);
  }, [toast]);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast({
        title: "Kopioitu!",
        description: "URL kopioitu leikepöydälle",
      });
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (err) {
      toast({
        title: "Virhe",
        description: "URL:n kopiointi epäonnistui",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tiedostojen hallinta</CardTitle>
          <CardDescription>Lataa ja hallitse tiedostoja</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Lataa tiedostoja</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              multiple
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>

          {uploading && (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Ladataan tiedostoja...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {file.type.startsWith('image/') ? (
                    <Image className="h-6 w-6 text-blue-500" />
                  ) : (
                    <File className="h-6 w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(file.url)}
                  >
                    {copiedUrl === file.url ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {files.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ei ladattuja tiedostoja</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileStorage;
