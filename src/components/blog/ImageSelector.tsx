
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink } from "lucide-react";

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

  const handleSelectImage = () => {
    if (selectedTab === "url" && customUrl) {
      onSelectImage(customUrl);
    } else if (selectedImage) {
      onSelectImage(selectedImage);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Valitse kuva</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="project" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="project">Projektin kuvat</TabsTrigger>
            <TabsTrigger value="stock">Vapaita kuvia</TabsTrigger>
            <TabsTrigger value="url">URL-osoite</TabsTrigger>
          </TabsList>
          
          <TabsContent value="project">
            <ScrollArea className="h-[300px] p-2 border rounded-md">
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
            <ScrollArea className="h-[300px] p-2 border rounded-md">
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
            disabled={(selectedTab !== "url" && !selectedImage) || (selectedTab === "url" && !customUrl)}
          >
            Valitse kuva
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
