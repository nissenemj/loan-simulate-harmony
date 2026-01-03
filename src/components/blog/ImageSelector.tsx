
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, Image as ImageIcon, UploadCloud, FileImage } from "lucide-react";
import { uploadImage } from "@/utils/supabaseStorage";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// List of demo images from the assets folder
const demoImages = [
  {
    name: "financial-freedom.jpg",
    path: "/src/assets/images/blog/financial-freedom.jpg",
  },
  {
    name: "Rahapsykologia.png",
    path: "/src/Rahapsykologia.png",
  }
];

// Stock images from Unsplash for demonstration
const stockImages = [
  {
    name: "laptop-user",
    path: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    name: "laptop",
    path: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    name: "circuit-board",
    path: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    name: "programming",
    path: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  }
];

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ open, onClose, onSelectImage }) => {
  const [selectedTab, setSelectedTab] = useState("project");
  const [selectedImage, setSelectedImage] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleSelectImage = () => {
    if (selectedTab === "url" && customUrl) {
      onSelectImage(customUrl);
    } else if (selectedImage) {
      onSelectImage(selectedImage);
    }
    onClose();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await processFileUpload(file);
  };

  const processFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vain kuvatiedostot sallittu (.jpg, .png, .gif)');
      return;
    }

    // Maximum file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Kuvan maksimikoko on 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      console.log("Processing file upload:", file.name);

      // Simulate progress (Firebase doesn't provide progress natively)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const nextProgress = prev + Math.floor(Math.random() * 15);
          return nextProgress > 90 ? 90 : nextProgress;
        });
      }, 400);

      // Upload the file using our helper function
      const downloadURL = await uploadImage(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Set as selected image
      setSelectedImage(downloadURL);
      toast.success('Kuva ladattu onnistuneesti!');
    } catch (error) {
      console.error('Error in file upload process:', error);
      toast.error('Kuvan lataus epäonnistui. Yritä myöhemmin uudelleen.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add a drop zone handler for better UX
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      processFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Valitse kuva</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="project" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1 mb-4' : 'grid-cols-4 mb-4'}`}>
            <TabsTrigger value="project">{isMobile ? 'Projekti' : 'Projektin kuvat'}</TabsTrigger>
            <TabsTrigger value="stock">{isMobile ? 'Vapaat' : 'Vapaita kuvia'}</TabsTrigger>
            <TabsTrigger value="upload">{isMobile ? 'Lataa' : 'Lataa kuva'}</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="project">
            <ScrollArea className="h-[250px] md:h-[300px] p-2 border rounded-md">
              <RadioGroup value={selectedImage} onValueChange={setSelectedImage}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
                  {demoImages.map((image) => (
                    <Card key={image.name} className={`overflow-hidden cursor-pointer ${selectedImage === image.path ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-2">
                        <div className="aspect-video relative mb-2 bg-muted rounded">
                          <div className="flex items-center justify-center w-full h-full absolute">
                            <Label htmlFor={image.name} className="cursor-pointer w-full h-full">
                              <img
                                src={image.path}
                                alt={image.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </Label>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={image.path} id={image.name} className="mr-2" />
                          <Label htmlFor={image.name} className="text-xs truncate">
                            {image.name}
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>

              {demoImages.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8">
                  <p className="text-muted-foreground text-center">
                    Ei kuvia vielä lisätty. Voit lisätä kuvia src/assets/images/blog -kansioon.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stock">
            <ScrollArea className="h-[250px] md:h-[300px] p-2 border rounded-md">
              <RadioGroup value={selectedImage} onValueChange={setSelectedImage}>
                <div className="grid grid-cols-2 gap-4 p-2">
                  {stockImages.map((image) => (
                    <Card key={image.name} className={`overflow-hidden cursor-pointer ${selectedImage === image.path ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-2">
                        <div className="aspect-video relative mb-2 bg-muted rounded">
                          <div className="flex items-center justify-center w-full h-full absolute">
                            <Label htmlFor={image.name} className="cursor-pointer w-full h-full">
                              <img
                                src={image.path}
                                alt={image.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </Label>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={image.path} id={image.name} className="mr-2" />
                          <Label htmlFor={image.name} className="text-xs truncate">
                            {image.name}
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-md p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <UploadCloud className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-sm text-center">
                    <Label
                      htmlFor="file-upload"
                      className="font-medium text-primary hover:text-primary/80 cursor-pointer"
                    >
                      Valitse kuvatiedosto
                    </Label>
                    <p className="text-muted-foreground">tai raahaa tiedosto tähän</p>
                  </div>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Ladataan kuvaa... ({uploadProgress}%)</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {selectedImage && selectedTab === "upload" && !isUploading && (
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Esikatselu:</h4>
                  <div className="relative h-40 flex items-center justify-center bg-muted rounded">
                    <img
                      src={selectedImage}
                      alt="Upload preview"
                      className="max-h-40 max-w-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {selectedImage.split('/').pop()}
                  </p>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>Tuetut tiedostomuodot: JPG, PNG, GIF</p>
                <p>Maksimikoko: 5MB</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-url">Kuvan URL-osoite</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="custom-url"
                    placeholder="https://example.com/image.jpg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                </div>
              </div>

              {customUrl && (
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Esikatselu:</h4>
                  <div className="relative h-40 flex items-center justify-center bg-muted rounded">
                    {isLoading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                    <img
                      src={customUrl}
                      alt="URL preview"
                      className="max-h-40 max-w-full object-contain"
                      onLoad={() => setIsLoading(false)}
                      onError={() => setIsLoading(false)}
                      style={{ display: isLoading ? 'none' : 'block' }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Voit käyttää esim. <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="underline">Unsplash-kuvia</a>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Peruuta
          </Button>
          <Button
            onClick={handleSelectImage}
            disabled={(selectedTab === "url" && !customUrl) ||
              (selectedTab !== "url" && !selectedImage) ||
              isUploading}
          >
            {isUploading ? "Ladataan..." : "Valitse kuva"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
