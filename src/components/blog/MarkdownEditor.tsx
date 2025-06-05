
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Bold, 
  Italic, 
  Link, 
  List, 
  Hash,
  Image as ImageIcon,
  Code,
  Quote,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  placeholder = "Kirjoita sisältöä...",
  className
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const { toast } = useToast();

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content, onChange]);

  const toolbarButtons = [
    { icon: Bold, label: 'Lihavointi', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Kursivointi', action: () => insertMarkdown('*', '*') },
    { icon: Link, label: 'Linkki', action: () => insertMarkdown('[', '](url)') },
    { icon: Hash, label: 'Otsikko', action: () => insertMarkdown('## ') },
    { icon: List, label: 'Lista', action: () => insertMarkdown('- ') },
    { icon: Code, label: 'Koodi', action: () => insertMarkdown('`', '`') },
    { icon: Quote, label: 'Lainaus', action: () => insertMarkdown('> ') },
    { icon: ImageIcon, label: 'Kuva', action: () => insertMarkdown('![alt](', ')') },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Markdown-editori</CardTitle>
        <CardDescription>Kirjoita ja esikatsele sisältöä</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="edit">
                <Edit className="h-4 w-4 mr-2" />
                Muokkaa
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Esikatselu
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit" className="space-y-4">
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/50">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.label}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            
            <Textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[400px] font-mono"
            />
          </TabsContent>

          <TabsContent value="preview">
            <div className="min-h-[400px] p-4 border rounded-lg bg-background prose prose-sm max-w-none">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">Ei sisältöä esikatseltavana</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Käytä Markdown-syntaksia tekstin muotoiluun. Työkalupalkin painikkeet auttavat yleisimpien elementtien lisäämisessä.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MarkdownEditor;
