
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageSquare, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const welcomeMessage = language === 'fi' 
      ? "Hei! Olen VelkaAI-apuri. Voin auttaa sinua navigoimaan sivustolla ja vastata kysymyksiisi. Miten voin auttaa?"
      : "Hi! I'm VelkaAI Assistant. I can help you navigate the site and answer your questions. How can I help you?";
    
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  }, [language]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    const assistantMessage: Message = {
      role: 'assistant',
      content: generateResponse(inputValue, language),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
  };

  const generateResponse = (input: string, lang: string): string => {
    const responses = {
      fi: {
        calculator: "Lainalaskurilla voit laskea eri velkojen takaisinmaksua. Löydät sen päävalikosta tai voit klikata 'Aloita ilmainen suunnitelma' -painiketta.",
        strategies: "Velanmaksustrategiat-sivulla voit tutustua erilaisiin tapoihin maksaa velkoja pois tehokkaasti.",
        courses: "Kurssit-osiosta löydät materiaalia taloudenhallinnasta ja veloista selviämisestä.",
        blog: "Blogista löydät hyödyllisiä artikkeleita taloudenhallinnasta ja velkojen maksamisesta.",
        default: "Miten voin auttaa sinua? Voit kysyä sivuston käytöstä tai eri ominaisuuksista.",
      },
      en: {
        calculator: "The loan calculator helps you plan debt repayment. Find it in the main menu or click the 'Start Free Plan' button.",
        strategies: "On the Debt Strategies page, you can learn about different methods for paying off debt effectively.",
        courses: "In the Courses section, you'll find materials about financial management and debt relief.",
        blog: "The Blog contains useful articles about financial management and debt repayment.",
        default: "How can I help you? You can ask about site navigation or different features.",
      }
    };

    const currentLang = lang === 'fi' ? responses.fi : responses.en;
    const inputLower = input.toLowerCase();

    if (inputLower.includes('laskur') || inputLower.includes('calculat')) {
      return currentLang.calculator;
    } else if (inputLower.includes('strateg') || inputLower.includes('velanmaksu')) {
      return currentLang.strategies;
    } else if (inputLower.includes('kurssi') || inputLower.includes('course')) {
      return currentLang.courses;
    } else if (inputLower.includes('blogi') || inputLower.includes('blog')) {
      return currentLang.blog;
    }
    
    return currentLang.default;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatContent = () => (
    <>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
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
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'fi'
                ? 'Kirjoita viestisi tähän...'
                : 'Type your message here...'
            }
          />
          <Button onClick={handleSendMessage}>
            {language === 'fi' ? 'Lähetä' : 'Send'}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full p-3 h-14 w-14 shadow-lg z-50"
        aria-label={language === 'fi' ? 'Avaa keskustelu' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {isOpen && !isMobile && (
        <Card className="fixed bottom-24 right-6 w-96 h-[480px] shadow-xl z-50 flex flex-col animate-fade-in">
          <CardHeader className="border-b p-4">
            <CardTitle>
              {language === 'fi' ? 'Keskustele VelkaAI:n kanssa' : 'Chat with VelkaAI'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            {renderChatContent()}
          </CardContent>
        </Card>
      )}

      {isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="border-b">
              <DrawerTitle>
                {language === 'fi' ? 'Keskustele VelkaAI:n kanssa' : 'Chat with VelkaAI'}
              </DrawerTitle>
            </DrawerHeader>
            {renderChatContent()}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ChatBot;
