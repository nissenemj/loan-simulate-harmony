
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, HelpCircle, TrendingDown, Calendar, DollarSign, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PaymentPlan } from '@/utils/calculator/types';

interface ResultsInterpretationGuideProps {
  paymentPlan?: PaymentPlan | null;
  className?: string;
}

const ResultsInterpretationGuide: React.FC<ResultsInterpretationGuideProps> = ({
  paymentPlan,
  className
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!paymentPlan) return null;
  
  const interpretationItems = [
    {
      icon: DollarSign,
      key: 'totalInterest',
      value: `€${paymentPlan.totalInterestPaid.toLocaleString('fi-FI', { maximumFractionDigits: 0 })}`,
      description: t('guidance.resultsGuide.totalInterest')
    },
    {
      icon: Calendar,
      key: 'payoffDate',
      value: `${paymentPlan.totalMonths} ${t('calculator.months')}`,
      description: t('guidance.resultsGuide.payoffDate')
    },
    {
      icon: TrendingDown,
      key: 'totalPaid',
      value: `€${(paymentPlan.totalInterestPaid + paymentPlan.debts.reduce((sum, debt) => sum + debt.balance, 0)).toLocaleString('fi-FI', { maximumFractionDigits: 0 })}`,
      description: t('guidance.resultsGuide.totalPaid')
    },
    {
      icon: PiggyBank,
      key: 'monthlyPayment',
      value: `€${paymentPlan.monthlyPayment.toLocaleString('fi-FI', { maximumFractionDigits: 0 })}`,
      description: t('guidance.resultsGuide.monthlyPayment')
    }
  ];
  
  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                {t('guidance.resultsGuide.howToRead')}
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-4">
              {interpretationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-start gap-3 p-3 rounded-md bg-muted/30">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ResultsInterpretationGuide;
