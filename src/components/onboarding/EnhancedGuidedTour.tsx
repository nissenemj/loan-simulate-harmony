
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Calculator, 
  Target, 
  TrendingUp,
  CheckCircle,
  Play
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Tervetuloa velkalaskuriin!',
    description: 'Tämä työkalu auttaa sinua luomaan optimaalisen suunnitelman velkojesi takaisinmaksuun. Aloitetaan yhdessä!',
    icon: <Calculator className="h-6 w-6" />,
    action: 'Aloita opastus'
  },
  {
    id: 'add-debts',
    title: 'Lisää velkasi',
    description: 'Syötä kaikki velkasi: luottokortit, lainat ja muut velvoitteet. Mitä tarkemmat tiedot, sitä parempi suunnitelma.',
    icon: <Target className="h-6 w-6" />,
    action: 'Ymmärsin'
  },
  {
    id: 'choose-strategy',
    title: 'Valitse strategia',
    description: 'Lumivyöry maksimoi säästöt, lumipallo motivoi nopeilla voitoilla. Voit vertailla molempia.',
    icon: <TrendingUp className="h-6 w-6" />,
    action: 'Selvä'
  },
  {
    id: 'set-budget',
    title: 'Aseta budjetti',
    description: 'Määritä kuukausittainen summa velkojesi maksuun. Muista: yli vähimmäismaksujen maksamisesta tulee nopeampi vapautuminen.',
    icon: <CheckCircle className="h-6 w-6" />,
    action: 'Aloita laskeminen'
  }
];

interface EnhancedGuidedTourProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export function EnhancedGuidedTour({ onComplete, forceShow = false }: EnhancedGuidedTourProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1}/{tourSteps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {step.icon}
          </div>
          <CardTitle className="text-xl">{step.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Takaisin
              </Button>
            )}
            
            <Button onClick={handleNext} className="flex-1">
              {currentStep === 0 && <Play className="h-4 w-4 mr-2" />}
              {step.action}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
          
          {currentStep === 0 && (
            <Button variant="ghost" onClick={handleSkip} className="w-full text-sm">
              Ohita opastus
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
