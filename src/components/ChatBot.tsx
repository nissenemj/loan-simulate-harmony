
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageSquare, X, Send } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const welcomeMessage = language === 'fi' 
      ? "Hei! Olen VelkaAI-apuri. Voin auttaa sinua vastaamalla kysymyksiisi veloista, lainoista, maksamisesta ja taloudenhallinnasta. Miten voin auttaa sinua tänään?"
      : "Hi! I'm VelkaAI Assistant. I can help you answer questions about debt, loans, payments, and financial management. How can I help you today?";
    
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate thinking delay for more natural conversation
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: generateResponse(inputValue, language),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const generateResponse = (input: string, lang: string): string => {
    const inputLower = input.toLowerCase();
    
    // Comprehensive response database
    const responses = {
      fi: {
        // Velka- ja lainakysymykset
        laina: "Lainan ottamisessa on tärkeää vertailla korkoja ja ehtoja eri pankkien välillä. Voit käyttää laskuriamme erilaisten lainavaihtoehtojen vertailuun. Lainan kokonaiskustannukset riippuvat korosta, laina-ajasta ja mahdollisista lisämaksuista.",
        velka: "Velkojen hallinnassa kannattaa keskittyä ensin korkeiden korkojen velkoihin. Velkavapaus.fi tarjoaa työkaluja velkojen järjestämiseen ja maksusuunnitelmien luomiseen. Suosittelemme aina avointa kommunikaatiota velkojien kanssa maksuvaikeuksien ilmetessä.",
        korko: "Korko on lainan hinta, jonka pankki tai rahoituslaitos veloittaa rahan lainaamisesta. Korot voivat olla kiinteitä tai vaihtuvia. Korkotaso vaikuttaa merkittävästi lainan kokonaiskustannuksiin pitkällä aikavälillä.",
        maksusuunnitelma: "Hyvä maksusuunnitelma huomioi tulosi, menosi ja realistiset maksumahdollisuutesi. Käytä sivustomme laskureita erilaisten maksusuunnitelmien vertailuun. Voit luoda henkilökohtaisen maksusuunnitelman laskurimme avulla.",
        
        // Maksustrategiat
        lumipallostrategia: "Lumipallostrategia (snowball) keskittyy pienimpien velkojen maksamiseen ensin. Tämä antaa nopeita onnistumisia ja motivaatiota. Strategia toimii hyvin monille, koska se antaa psykologisia voittoja matkan varrella.",
        lumivyörystrategia: "Lumivyörystrategia (avalanche) keskittyy korkeimman koron velkojen maksamiseen ensin. Tämä on matemaattisesti tehokkain tapa, koska se minimoi maksettavien korkojen määrän pitkällä tähtäimellä.",
        velkayhdistely: "Velkayhdistely tarkoittaa useiden velkojen yhdistämistä yhdeksi lainaksi, yleensä paremmalla korolla. Tämä voi selkeyttää maksamista ja mahdollisesti pienentää kokonaiskorkokustannuksia.",
        
        // Taloudenhallinta
        budjetti: "Tehokas budjetti on taloudenhallinnassa ensiarvoisen tärkeä. Kirjaa kaikki tulosi ja menosi, jotta näet kokonaiskuvan. Budjetin avulla voit suunnitella säästämistä ja velkojen maksua tehokkaammin.",
        säästäminen: "Säästäminen on tärkeä osa taloudenhallintaa, jopa velkaa maksaessa. Pieni hätävara auttaa välttämään uuden velan ottamista yllättävissä tilanteissa. Voit aloittaa säästämisen pienilläkin summilla.",
        sijoittaminen: "Sijoittaminen kannattaa aloittaa vasta korkeiden korkojen velkojen maksamisen jälkeen. Matalan koron velkoja voi olla järkevää pitää, jos sijoitusten tuotto-odotus on korkoja korkeampi.",
        
        // Työkalukysymykset
        laskuri: "Lainojen laskurilla voit laskea eri velkojen takaisinmaksua ja vertailla erilaisia maksustrategioita. Löydät sen sivun ylävalikosta tai voit klikata 'Aloita ilmainen suunnitelma' -painiketta.",
        strategiat: "Velanmaksustrategiat-sivulla voit tutustua erilaisiin tapoihin maksaa velkoja pois tehokkaasti. Voit vertailla lumipallo- ja lumivyörystrategioita sekä nähdä kuinka ne vaikuttavat maksuaikatauluusi.",
        kurssit: "Kurssit-osiosta löydät laadukasta materiaalia taloudenhallinnasta ja veloista selviämisestä. Kurssit on suunniteltu auttamaan sinua ymmärtämään paremmin taloutesi kokonaiskuvaa.",
        blogi: "Blogista löydät hyödyllisiä artikkeleita taloudenhallinnasta, velkojen maksamisesta ja säästämisestä. Päivitämme blogia säännöllisesti uusilla aiheilla.",
        työkalu: "Velkavapaus.fi tarjoaa useita työkaluja: velkalaskurin, maksustrategioiden simulointityökalun, budjettityökalun ja velanmaksuaikataulun visualisoinnin.",
        apuri: "Minä olen VelkaAI, tekoälyavustaja, joka auttaa käyttäjiä löytämään vastauksia velkoihin ja taloudenhoitoon liittyviin kysymyksiin. Voit kysyä minulta mitä tahansa aiheeseen liittyvää!",
        
        // Yleiset kysymykset
        yhteystiedot: "Voit ottaa yhteyttä meihin palautelomakkeella, jonka löydät Palaute-sivulta. Käsittelemme kaikki viestit mahdollisimman pian.",
        tietoja: "Velkavapaus.fi on suomalainen palvelu, joka auttaa ihmisiä hallitsemaan velkojaan ja parantamaan taloudellista tilannettaan. Tarjoamme tietoa, työkaluja ja tukea velkaongelmien ratkaisemiseen.",
        
        // Default vastaus
        default: "Kiitos kysymyksestäsi! Voin auttaa sinua velkoihin, lainoihin ja taloudenhallintaan liittyvissä asioissa. Kerro tarkemmin, mistä haluat tietää lisää?"
      },
      en: {
        // Debt and loan questions
        loan: "When taking a loan, it's important to compare interest rates and terms between different banks. You can use our calculator to compare various loan options. The total cost of a loan depends on the interest rate, loan term, and possible additional fees.",
        debt: "In debt management, focus first on high-interest debts. Velkavapaus.fi offers tools for organizing debts and creating payment plans. We always recommend open communication with creditors if payment difficulties arise.",
        interest: "Interest is the price of a loan that a bank or financial institution charges for borrowing money. Interest rates can be fixed or variable. The interest rate significantly affects the total cost of a loan in the long term.",
        payment_plan: "A good payment plan takes into account your income, expenses, and realistic payment possibilities. Use our site's calculators to compare different payment plans. You can create a personalized payment plan using our calculator.",
        
        // Payment strategies
        snowball: "The snowball strategy focuses on paying off the smallest debts first. This gives quick wins and motivation. The strategy works well for many because it provides psychological victories along the way.",
        avalanche: "The avalanche strategy focuses on paying off high-interest debts first. This is mathematically the most efficient way because it minimizes the amount of interest paid in the long run.",
        consolidation: "Debt consolidation means combining several debts into a single loan, usually with a better interest rate. This can simplify payments and potentially reduce total interest costs.",
        
        // Financial management
        budget: "An effective budget is essential in financial management. Record all your income and expenses to see the big picture. With a budget, you can plan savings and debt payments more efficiently.",
        saving: "Saving is an important part of financial management, even when paying off debt. A small emergency fund helps avoid taking on new debt in unexpected situations. You can start saving with small amounts.",
        investing: "Investing should be started only after paying off high-interest debts. It may make sense to keep low-interest debts if the expected return on investments is higher than the interest rates.",
        
        // Tool questions
        calculator: "With the loan calculator, you can calculate the repayment of different debts and compare different payment strategies. Find it in the main menu or click the 'Start Free Plan' button.",
        strategies: "On the Debt Strategies page, you can learn about different ways to pay off debt effectively. You can compare snowball and avalanche strategies and see how they affect your payment schedule.",
        courses: "In the Courses section, you'll find quality material on financial management and getting out of debt. The courses are designed to help you better understand the overall picture of your finances.",
        blog: "In the Blog, you'll find useful articles on financial management, debt repayment, and saving. We update the blog regularly with new topics.",
        tool: "Velkavapaus.fi offers several tools: a debt calculator, payment strategy simulation tool, budget tool, and debt payment schedule visualization.",
        assistant: "I am VelkaAI, an AI assistant who helps users find answers to questions about debt and financial management. You can ask me anything related to the topic!",
        
        // General questions
        contact: "You can contact us through the feedback form, which you'll find on the Feedback page. We process all messages as soon as possible.",
        about: "Velkavapaus.fi is a Finnish service that helps people manage their debts and improve their financial situation. We provide information, tools, and support for solving debt problems.",
        
        // Default response
        default: "Thank you for your question! I can help you with debt, loans, and financial management. Please tell me more about what you'd like to know?"
      }
    };

    const currentLang = lang === 'fi' ? responses.fi : responses.en;
    
    // Helper function to find the best matching response key
    const findMatchingKey = (input: string, responseObject: Record<string, string>): string => {
      // Try to find an exact match first
      const exactMatch = Object.keys(responseObject).find(key => input.includes(key));
      if (exactMatch) return responseObject[exactMatch];
      
      // If no exact match, look for keywords
      for (const key in responseObject) {
        if (key === 'default') continue; // Skip the default response when searching
        
        // Case insensitive search
        if (input.toLowerCase().includes(key.toLowerCase())) {
          return responseObject[key];
        }
        
        // Handle alternative forms of words (Finnish)
        if (lang === 'fi') {
          if (key === 'laina' && (input.includes('lainat') || input.includes('lainaa'))) {
            return responseObject[key];
          }
          if (key === 'velka' && (input.includes('velat') || input.includes('velkaa'))) {
            return responseObject[key];
          }
          if (key === 'kurssit' && input.includes('kurssi')) {
            return responseObject[key];
          }
        }
        
        // Handle alternative forms of words (English)
        if (lang === 'en') {
          if (key === 'loan' && (input.includes('loans') || input.includes('borrowing'))) {
            return responseObject[key];
          }
          if (key === 'debt' && (input.includes('debts') || input.includes('owing'))) {
            return responseObject[key];
          }
        }
      }
      
      return responseObject.default;
    };
    
    return findMatchingKey(inputLower, currentLang);
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
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[85%] rounded-lg p-3">
                <span className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                </span>
              </div>
            </div>
          )}
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
                ? 'Kirjoita kysymyksesi tähän...'
                : 'Type your question here...'
            }
          />
          <Button onClick={handleSendMessage}>
            <Send size={18} className="mr-2" />
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
              {language === 'fi' ? 'Kysy VelkaAI:lta' : 'Ask VelkaAI'}
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
                {language === 'fi' ? 'Kysy VelkaAI:lta' : 'Ask VelkaAI'}
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
