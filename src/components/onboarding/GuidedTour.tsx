import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  BarChart, 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  TrendingDown,
  ArrowDownToLine,
  Calendar,
  Coins
} from 'lucide-react';

interface GuidedTourProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/**
 * A guided tour component for first-time users
 */
const GuidedTour: React.FC<GuidedTourProps> = ({ 
  onComplete,
  forceShow = false
}) => {
  const { t } = useLanguage();
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('hasSeenTour', false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Tour steps
  const tourSteps = [
    {
      id: 'welcome',
      title: t('tour.welcomeTitle'),
      description: t('tour.welcomeDescription'),
      icon: Calculator
    },
    {
      id: 'addDebt',
      title: t('tour.addDebtTitle'),
      description: t('tour.addDebtDescription'),
      icon: PlusCircle
    },
    {
      id: 'strategies',
      title: t('tour.strategiesTitle'),
      description: t('tour.strategiesDescription'),
      icon: BarChart,
      content: (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">{t('repayment.avalancheMethod')}</h4>
            </div>
            <p className="text-sm">{t('repayment.avalancheDescription')}</p>
          </div>
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownToLine className="h-5 w-5 text-green-500" />
              <h4 className="font-medium">{t('repayment.snowballMethod')}</h4>
            </div>
            <p className="text-sm">{t('repayment.snowballDescription')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'results',
      title: t('tour.resultsTitle'),
      description: t('tour.resultsDescription'),
      icon: CheckCircle,
      content: (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-medium">{t('calculator.debtFreeDate')}</h4>
            </div>
            <p className="text-sm">{t('tour.debtFreeDateExplanation')}</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-primary" />
              <h4 className="font-medium">{t('calculator.totalInterestPaid')}</h4>
            </div>
            <p className="text-sm">{t('tour.interestExplanation')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'getStarted',
      title: t('tour.getStartedTitle'),
      description: t('tour.getStartedDescription'),
      icon: CheckCircle
    }
  ];
  
  // Check if we should show the tour
  useEffect(() => {
    if (forceShow || (!hasSeenTour && !isOpen)) {
      setIsOpen(true);
    }
  }, [forceShow, hasSeenTour, isOpen]);
  
  // Handle tour completion
  const handleComplete = () => {
    setHasSeenTour(true);
    setIsOpen(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip
  const handleSkip = () => {
    handleComplete();
  };
  
  // Current step
  const currentTourStep = tourSteps[currentStep];
  const Icon = currentTourStep.icon;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>{currentTourStep.title}</DialogTitle>
          </div>
          <DialogDescription>
            {currentTourStep.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentTourStep.content && (
          <div className="py-2">
            {currentTourStep.content}
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-4 mb-2">
          {tourSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`h-1.5 w-12 mx-1 rounded-full ${
                index === currentStep 
                  ? 'bg-primary' 
                  : index < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('tour.previous')}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>
                {t('tour.skip')}
              </Button>
            )}
          </div>
          <Button onClick={handleNext}>
            {currentStep < tourSteps.length - 1 ? (
              <>
                {t('tour.next')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              t('tour.getStarted')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuidedTour;
