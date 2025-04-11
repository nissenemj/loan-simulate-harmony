
import React, { useState, useEffect, useRef } from 'react';
import { uploadFile, listFiles, deleteFile } from '@/utils/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Eye, Trash2, Upload, File, FileArchive, FileText, FileImage, FileAudio, FileVideo, FileCode, Paperclip, Loader2 } from 'lucide-react';

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get appropriate icon based on file type
const getFileIcon = (contentType: string | undefined): React.ReactNode => {
  if (!contentType) return <File className="h-5 w-5" />;
  
  if (contentType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
  if (contentType.startsWith('audio/')) return <FileAudio className="h-5 w-5" />;
  if (contentType.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
  if (contentType.startsWith('text/')) return <FileText className="h-5 w-5" />;
  if (contentType.includes('application/pdf')) return <FileText className="h-5 w-5" />;
  if (contentType.includes('application/json') || contentType.includes('application/xml')) return <FileCode className="h-5 w-5" />;
  if (contentType.includes('zip') || contentType.includes('compressed')) return <FileArchive className="h-5 w-5" />;
  
  return <File className="h-5 w-5" />;
};

interface FileItem {
  name: string;
  url: string;
  path: string;
  size?: number;
  contentType?: string;
}

const FileStorage: React.FC = () => {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [folder, setFolder] = useState('files');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files when component mounts or folder changes
  useEffect(() => {
    fetchFiles();
  }, [folder]);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filesList = await listFiles(folder);
      setFiles(filesList.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files. Please try again.');
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        // Update progress based on current file
        setUploadProgress(prevProgress => {
          const fileProgress = (i / selectedFiles.length) * 100;
          return Math.max(10, Math.min(90, fileProgress));
        });
        
        await uploadFile(file, folder);
        
        if (i === selectedFiles.length - 1) {
          setUploadProgress(100);
          toast.success(`File${selectedFiles.length > 1 ? 's' : ''} uploaded successfully`);
          
          // Refresh the file list
          fetchFiles();
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    // Reset the file input and uploading state
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const handleOpenShareDialog = (file: FileItem) => {
    setSelectedFile(file);
    setShareDialogOpen(true);
  };

  const handleConfirmDelete = (file: FileItem) => {
    setFileToDelete(file);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      await deleteFile(fileToDelete.path);
      toast.success('File deleted successfully');
      setFiles(files.filter(f => f.path !== fileToDelete.path));
      setConfirmDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="manage">Manage Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload files to share on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="folder">Folder</Label>
                <div className="flex gap-2">
                  <Input 
                    id="folder" 
                    value={folder} 
                    onChange={(e) => setFolder(e.target.value || 'files')} 
                    placeholder="files"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Files will be uploaded to this folder in storage
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="file-upload">File</Label>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-muted-foreground">
                    You can select multiple files
                  </p>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Uploading... ({uploadProgress.toFixed(0)}%)</p>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-2 transition-all duration-300 ease-in-out" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Files</CardTitle>
              <CardDescription>
                View, share, and delete your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="folder-filter">Folder</Label>
                <div className="flex gap-2">
                  <Input 
                    id="folder-filter" 
                    value={folder} 
                    onChange={(e) => setFolder(e.target.value || 'files')} 
                    placeholder="files"
                  />
                  <Button 
                    variant="outline" 
                    onClick={fetchFiles}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Refresh
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="rounded-md border">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.length === 0 && !isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No files found in this folder</p>
                          </TableCell>
                        </TableRow>
                      ) : null}
                      
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Loading files...</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        files.map((file) => (
                          <TableRow key={file.path}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file.contentType)}
                                <span className="font-medium truncate max-w-[240px]">
                                  {file.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {file.size ? formatFileSize(file.size) : "Unknown"}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleCopyLink(file.url)}
                                  title="Copy link"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleOpenShareDialog(file)}
                                  title="Share"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleConfirmDelete(file)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>
              Copy the link to share this file
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                {getFileIcon(selectedFile.contentType)}
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              
              {selectedFile.contentType?.startsWith('image/') && (
                <div className="relative rounded-md overflow-hidden border h-48 flex items-center justify-center bg-muted">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="file-url">File URL</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="file-url" 
                    value={selectedFile.url} 
                    readOnly 
                  />
                  <Button 
                    variant="secondary" 
                    onClick={() => handleCopyLink(selectedFile.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(selectedFile.url, '_blank')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Open
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => setShareDialogOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {fileToDelete && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                {getFileIcon(fileToDelete.contentType)}
                <span className="font-medium">{fileToDelete.name}</span>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteFile}
                >
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileStorage;
