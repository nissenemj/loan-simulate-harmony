import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  value, 
  onChange, 
  rows = 15,
  placeholder = "Artikkelin sisältö..." 
}) => {
  const [selection, setSelection] = useState<{start: number, end: number} | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const formatText = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selStart = textarea.selectionStart;
    const selEnd = textarea.selectionEnd;

    // Store current selection for future operations
    setSelection({ start: selStart, end: selEnd });

    const selectedText = value.substring(selStart, selEnd);
    let formattedText = '';
    let cursorOffset = 0;

    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        // Markdown doesn't have native underline, we use HTML
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'list':
        // Split by new line and add bullet points
        formattedText = selectedText
          .split('\n')
          .map(line => line.trim() ? `- ${line}` : line)
          .join('\n');
        cursorOffset = 0;
        break;
      case 'align-left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        cursorOffset = 0;
        break;
      case 'align-center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        cursorOffset = 0;
        break;
      case 'align-right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        cursorOffset = 0;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        cursorOffset = 1;
        break;
      default:
        return;
    }

    const newText = 
      value.substring(0, selStart) + 
      formattedText + 
      value.substring(selEnd);
    
    onChange(newText);

    // Focus and set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      // If nothing was selected, place cursor inside the format markers
      if (selStart === selEnd) {
        textarea.selectionStart = selStart + cursorOffset;
        textarea.selectionEnd = selStart + cursorOffset;
      } else {
        // Otherwise, select the newly formatted text
        textarea.selectionStart = selStart;
        textarea.selectionEnd = selStart + formattedText.length;
      }
    }, 0);
  };

  return (
    <div className="markdown-editor flex flex-col space-y-2">
      <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-muted/50">
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center flex-wrap gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('bold')}
                >
                  <Bold className="h-4 w-4" />
                  <span className="sr-only">Lihavoi</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lihavoi (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('italic')}
                >
                  <Italic className="h-4 w-4" />
                  <span className="sr-only">Kursivoi</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Kursivoi (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('underline')}
                >
                  <Underline className="h-4 w-4" />
                  <span className="sr-only">Alleviivaa</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alleviivaa</p>
              </TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('h1')}
                >
                  <Heading1 className="h-4 w-4" />
                  <span className="sr-only">Otsikko 1</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pääotsikko</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('h2')}
                >
                  <Heading2 className="h-4 w-4" />
                  <span className="sr-only">Otsikko 2</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alaotsikko</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('list')}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">Lista</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Luettelolista</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('link')}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span className="sr-only">Linkki</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lisää linkki</p>
              </TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('align-left')}
                >
                  <AlignLeft className="h-4 w-4" />
                  <span className="sr-only">Tasaa vasemmalle</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tasaa vasemmalle</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('align-center')}
                >
                  <AlignCenter className="h-4 w-4" />
                  <span className="sr-only">Keskitä</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keskitä</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('align-right')}
                >
                  <AlignRight className="h-4 w-4" />
                  <span className="sr-only">Tasaa oikealle</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tasaa oikealle</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="font-mono text-sm"
      />
      
      <div className="text-xs text-muted-foreground">
        <p>
          Markdown-muotoilu: <code>**lihavoitu**</code>, <code>*kursivoitu*</code>, <code># Otsikko</code>
        </p>
      </div>
    </div>
  );
};

export default MarkdownEditor;
