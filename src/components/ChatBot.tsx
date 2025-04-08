
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MAX_QUESTIONS = 5;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Start opened by default
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useLocalStorage('chat_question_count', 0);
  const [limitReached, setLimitReached] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Get current page context to provide relevant help
  const getCurrentPageContext = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return language === 'fi' 
        ? 'Olet nyt Kojelaudalla. Täällä näet yhteenvedon veloistasi ja maksusuunnitelmasi. Miten voin auttaa sinua käyttämään tätä näkymää?'
        : 'You are now on the Dashboard. Here you can see a summary of your debts and payment plan. How can I help you use this view?';
    } else if (path === '/debt-summary') {
      return language === 'fi'
        ? 'Olet nyt Velkasummaus-sivulla. Täällä voit tarkastella velkojasi yksityiskohtaisesti ja luoda maksusuunnitelmia. Miten voin auttaa?'
        : 'You are now on the Debt Summary page. Here you can view your debts in detail and create payment plans. How can I help?';
    } else if (path === '/debt-strategies') {
      return language === 'fi'
        ? 'Olet nyt Velkastrategiat-sivulla. Täällä voit vertailla eri velanmaksustrategioita. Miten voin auttaa sinua työkalujen käytössä?'
        : 'You are now on the Debt Strategies page. Here you can compare different debt repayment strategies. How can I help you use these tools?';
    }
    
    return language === 'fi'
      ? 'Tervetuloa Velaton-sovellukseen! Voin auttaa sinua käyttämään sovelluksen eri ominaisuuksia.'
      : 'Welcome to the Velaton app! I can help you use the various features of the application.';
  };

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = language === 'fi' 
      ? `Hei! Olen VelkaAI, apurisi. ${getCurrentPageContext()} Voit kysyä minulta miten käyttää sivuston laskureita ja visualisointeja.`
      : `Hello! I'm VelkaAI, your assistant. ${getCurrentPageContext()} You can ask me how to use the site's calculators and visualizations.`;
    
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
    
    // Check if the user has already reached the limit
    if (questionCount >= MAX_QUESTIONS) {
      setLimitReached(true);
    }
  }, [language, location.pathname, questionCount]);

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

  // Listen for route changes to update context message
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const contextMessage = { role: 'assistant' as const, content: getCurrentPageContext() };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [location.pathname]);

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
        .slice(-4); // Keep conversation context manageable
      
      // Add current path context to help the AI provide relevant guidance
      const contextEnhancedMessage = `[Current page: ${location.pathname}] ${inputValue}`;
      
      const { data, error } = await supabase.functions.invoke('financial-advisor', {
        body: {
          message: contextEnhancedMessage,
          chatHistory,
          questionCount
        }
      });
      
      if (error) throw error;
      
      if (data.response) {
        const assistantMessage: Message = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Increment question count and check if limit was reached
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
        title: language === 'fi' ? 'Virhe' : 'Error',
        description: language === 'fi' 
          ? 'Viestin lähettäminen epäonnistui. Yritä uudelleen myöhemmin.' 
          : 'Failed to send message. Please try again later.',
        variant: 'destructive'
      });
      
      // Add error message for user
      const errorMessage: Message = { 
        role: 'assistant', 
        content: language === 'fi' 
          ? 'Pahoittelut, en voinut käsitellä viestiä. Voinko auttaa sinua jotenkin muuten?' 
          : 'Sorry, I couldn\'t process your message. Can I help you with something else?' 
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
    const limitMessage = language === 'fi'
      ? `Olet käyttänyt kaikki ${MAX_QUESTIONS} kysymystäsi. Palaa myöhemmin uudelleen.`
      : `You have used all your ${MAX_QUESTIONS} questions. Please come back later.`;
    
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
                  <span>{language === 'fi' ? 'Ajattelee...' : 'Thinking...'}</span>
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
              placeholder={language === 'fi' ? 'Kysy käyttöohjeita...' : 'Ask for usage help...'}
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
        )}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {language === 'fi' 
            ? `Kysymyksiä käytetty: ${questionCount}/${MAX_QUESTIONS}` 
            : `Questions used: ${questionCount}/${MAX_QUESTIONS}`}
        </div>
      </div>
    </>
  );

  // Chat button (visible on all devices)
  return (
    <>
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full p-3 h-14 w-14 shadow-lg z-50 ${isMobile ? 'h-12 w-12' : ''}`}
        aria-label={language === 'fi' ? 'Avaa keskustelu' : 'Open chat'}
      >
        {isOpen ? <X size={isMobile ? 20 : 24} /> : <MessageSquare size={isMobile ? 20 : 24} />}
      </Button>

      {/* Use Sheet for desktop */}
      {isOpen && !isMobile && (
        <Card className="fixed bottom-24 right-6 w-96 h-[480px] shadow-xl z-50 flex flex-col animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg p-4">
            <div className="flex items-center space-x-2">
              <BookOpen size={20} />
              <CardTitle className="text-lg font-medium">
                {language === 'fi' ? 'Käyttöapuri' : 'Usage Guide'}
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat} 
              className="text-primary-foreground hover:bg-primary/80"
              aria-label={language === 'fi' ? 'Sulje keskustelu' : 'Close chat'}
            >
              <X size={20} />
            </Button>
          </CardHeader>

          {renderChatContent()}
        </Card>
      )}

      {/* Use Drawer for mobile - much better UX */}
      {isOpen && isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="bg-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <DrawerTitle className="text-lg font-medium">
                    {language === 'fi' ? 'Käyttöapuri' : 'Usage Guide'}
                  </DrawerTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat} 
                  className="text-primary-foreground hover:bg-primary/80"
                  aria-label={language === 'fi' ? 'Sulje keskustelu' : 'Close chat'}
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

