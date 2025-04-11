
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
  Heading3,
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        // Fixed bullet list formatting
        if (selectedText.trim() === "") {
          // If no text is selected, just insert a bullet point
          formattedText = "- ";
          cursorOffset = 2;
        } else {
          // Split by new line and properly format each line
          const lines = selectedText.split('\n');
          formattedText = lines
            .map(line => line.trim() ? `- ${line}` : line)
            .join('\n');
        }
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
      case 'h3':
        formattedText = `### ${selectedText}`;
        cursorOffset = 4;
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
                  <span className="sr-only">{t("blog.editor.bold")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.bold")}</p>
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
                  <span className="sr-only">{t("blog.editor.italic")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.italic")}</p>
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
                  <span className="sr-only">{t("blog.editor.underline")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.underline")}</p>
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
                  <span className="sr-only">{t("blog.editor.heading1")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.heading1")}</p>
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
                  <span className="sr-only">{t("blog.editor.heading2")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.heading2")}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => formatText('h3')}
                >
                  <Heading3 className="h-4 w-4" />
                  <span className="sr-only">{t("blog.editor.heading3")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.heading3")}</p>
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
                  <span className="sr-only">{t("blog.editor.list")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.list")}</p>
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
                  <span className="sr-only">{t("blog.editor.link")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.link")}</p>
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
                  <span className="sr-only">{t("blog.editor.alignLeft")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.alignLeft")}</p>
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
                  <span className="sr-only">{t("blog.editor.alignCenter")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.alignCenter")}</p>
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
                  <span className="sr-only">{t("blog.editor.alignRight")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("blog.editor.alignRight")}</p>
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
          {t("blog.editor.formatting")}
        </p>
      </div>
    </div>
  );
};

export default MarkdownEditor;
