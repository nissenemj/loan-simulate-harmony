
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Calculator, 
  Target, 
  BarChart3,
  CheckCircle 
} from 'lucide-react';

interface GuidedTourProps {
  onComplete: () => void;
  forceShow?: boolean;
}

const tourSteps = [
  {
    id: 'welcome',
    title: 'Tervetuloa Velkavapaus.fi:hin',
    description: 'Tehdään nopea kierros auttaaksemme sinua pääsemään alkuun velanmaksumatkallasi.',
    icon: CheckCircle,
    content: 'Tämä työkalu auttaa sinua luomaan tehokkaan suunnitelman velkojen maksamiseksi. Aloitetaan!'
  },
  {
    id: 'add-debts',
    title: 'Lisää velkasi',
    description: 'Aloita lisäämällä velkasi. Syötä nimi, saldo, korkoprosentti ja vähimmäismaksu jokaiselle velalle.',
    icon: Calculator,
    content: 'Syötä kaikki velkasi huolellisesti. Tarkemmat tiedot johtavat parempaan suunnitelmaan.'
  },
  {
    id: 'choose-strategy',
    title: 'Valitse strategia',
    description: 'Valitse sinulle parhaiten sopiva takaisinmaksustrategia. Jokaisella on omat etunsa.',
    icon: Target,
    content: 'Lumipallomenetelmä motivoi nopeilla voitoilla, lumivyörymenetelmä säästää korkoja.'
  },
  {
    id: 'view-results',
    title: 'Tarkastele tuloksiasi',
    description: 'Näe velattomuuspäiväsi, maksetut korot yhteensä ja muut keskeiset mittarit.',
    icon: BarChart3,
    content: 'Tulokset näyttävät selkeän suunnitelman ja motivoivat sinua pysymään tavoitteissasi.'
  }
];

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete, forceShow = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('velkavapaus-tour-completed');
    if (!hasSeenTour || forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('velkavapaus-tour-completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {step.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-gray-700">
            {step.content}
          </p>
          
          <div className="flex justify-center space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Edellinen
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {tourSteps.length}
            </span>
            
            <Button onClick={handleNext} className="flex items-center gap-2">
              {currentStep === tourSteps.length - 1 ? 'Aloita' : 'Seuraava'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {currentStep === 0 && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="w-full"
            >
              Ohita kierros
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedTour;
