
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen, Send, X, MessageSquare, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = language === 'fi' 
      ? "Hei! Olen VelkaAI, sinun taloudellinen apurisi. Kysy minulta mitä tahansa liittyen henkilökohtaiseen talouteen, velanhallintaan tai sijoittamiseen. Tietoni perustuu 10 vaikutusvaltaiseen talouskirjaan!"
      : "Hello! I'm VelkaAI, your financial assistant. Ask me anything about personal finance, debt management, or investing. My knowledge is based on 10 influential financial books!";
    
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  }, [language]);

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
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .slice(-4); // Keep conversation context manageable
      
      const { data, error } = await supabase.functions.invoke('financial-advisor', {
        body: {
          message: inputValue,
          chatHistory
        }
      });
      
      if (error) throw error;
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'fi' ? 'Virhe' : 'Error',
        description: language === 'fi' 
          ? 'Viestin lähettäminen epäonnistui. Yritä uudelleen myöhemmin.' 
          : 'Failed to send message. Please try again later.',
        variant: 'destructive'
      });
      
      // Add error message for user
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: language === 'fi' 
            ? 'Pahoittelut, en voinut käsitellä viestiä. Voinko auttaa sinua jotenkin muuten?' 
            : 'Sorry, I couldn\'t process your message. Can I help you with something else?' 
        }
      ]);
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

  // Only show the chatbot on desktop view
  if (isMobile) return null;

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full p-3 h-14 w-14 shadow-lg z-50"
        aria-label={language === 'fi' ? 'Avaa keskustelu' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col animate-fade-in">
          <CardHeader className="flex flex-row items-center space-x-2 bg-primary text-primary-foreground rounded-t-lg p-4">
            <BookOpen size={20} />
            <CardTitle className="text-lg font-medium">
              {language === 'fi' ? 'Talousapuri' : 'Financial Assistant'}
            </CardTitle>
          </CardHeader>

          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
            <CardContent className="space-y-4 pt-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
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
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{language === 'fi' ? 'Ajattelee...' : 'Thinking...'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </ScrollArea>

          <Separator />

          <CardFooter className="p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'fi' ? 'Kirjoita viesti...' : 'Type a message...'}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                aria-label={language === 'fi' ? 'Lähetä viesti' : 'Send message'}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
