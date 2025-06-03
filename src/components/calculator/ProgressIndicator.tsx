
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 3,
  className
}) => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 1, label: t('guidance.progress.step1') },
    { id: 2, label: t('guidance.progress.step2') },
    { id: 3, label: t('guidance.progress.step3') }
  ];
  
  return (
    <Card className={cn("p-4 bg-muted/30", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {t('guidance.progress.currentStep')}
        </span>
        <span className="text-sm font-medium">
          {currentStep}/{totalSteps}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 mx-2 transition-colors",
                    currentStep > step.id
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1]?.label}
        </p>
      </div>
    </Card>
  );
};

export default ProgressIndicator;
