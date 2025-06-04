
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MAX_QUESTIONS = 5;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useLocalStorage('chat_question_count', 0);
  const [limitReached, setLimitReached] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = "Hei! Olen VelkaAI, taloudellinen apurisi. Voin auttaa sinua henkilökohtaisen talouden ja velanhallinnan kysymyksissä. Huomioithan, että en voi antaa sijoitusneuvontaa.";
    
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
    
    // Check if the user has already reached the limit
    if (questionCount >= MAX_QUESTIONS) {
      setLimitReached(true);
    }
  }, [questionCount]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || limitReached) return;
    
    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .slice(-4);
      
      const { data, error } = await supabase.functions.invoke('financial-advisor', {
        body: {
          message: inputValue,
          chatHistory,
          questionCount
        }
      });
      
      if (error) throw error;
      
      if (data.response) {
        const assistantMessage: Message = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
        
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
        
        if (data.limitReached || newCount >= MAX_QUESTIONS) {
          setLimitReached(true);
        }
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Virhe',
        description: 'Viestin lähettäminen epäonnistui. Yritä uudelleen myöhemmin.',
        variant: 'destructive'
      });
      
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Pahoittelut, en voinut käsitellä viestiä. Voinko auttaa sinua jotenkin muuten?'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderLimitMessage = () => {
    const limitMessage = `Olet käyttänyt kaikki ${MAX_QUESTIONS} kysymystäsi. Palaa myöhemmin uudelleen.`;
    
    return (
      <div className="p-3 text-center text-sm text-muted-foreground bg-muted rounded-md">
        {limitMessage}
      </div>
    );
  };

  const renderChatContent = () => (
    <>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-4">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-3 bg-muted flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Ajattelee...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div className="p-3">
        {limitReached ? renderLimitMessage() : (
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Kirjoita viesti..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Lähetä viesti"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Kysymyksiä käytetty: {questionCount}/{MAX_QUESTIONS}
        </div>
      </div>
    </>
  );

  return (
    <>
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full p-3 h-14 w-14 shadow-lg z-50 ${isMobile ? 'h-12 w-12' : ''}`}
        aria-label="Avaa keskustelu"
      >
        {isOpen ? <X size={isMobile ? 20 : 24} /> : <MessageSquare size={isMobile ? 20 : 24} />}
      </Button>

      {isOpen && !isMobile && (
        <Card className="fixed bottom-24 right-6 w-96 h-[480px] shadow-xl z-50 flex flex-col animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg p-4">
            <div className="flex items-center space-x-2">
              <BookOpen size={20} />
              <CardTitle className="text-lg font-medium">
                Talousapuri
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat} 
              className="text-primary-foreground hover:bg-primary/80"
              aria-label="Sulje keskustelu"
            >
              <X size={20} />
            </Button>
          </CardHeader>

          {renderChatContent()}
        </Card>
      )}

      {isOpen && isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="bg-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <DrawerTitle className="text-lg font-medium">
                    Talousapuri
                  </DrawerTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat} 
                  className="text-primary-foreground hover:bg-primary/80"
                  aria-label="Sulje keskustelu"
                >
                  <X size={18} />
                </Button>
              </div>
            </DrawerHeader>
            <div className="flex-1 pb-0 overflow-hidden">
              {renderChatContent()}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ChatBot;
