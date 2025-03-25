
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Award, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCardType[];
}

const DebtFreeTimeline = ({ totalDebt, formattedDebtFreeDate, activeCards }: DebtFreeTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          {t('dashboard.debtFreeTimeline')}
        </CardTitle>
        <CardDescription>{t('dashboard.timelineDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
            
            <div className="relative pl-8 pb-6">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Clock className="h-3 w-3 text-primary-foreground" />
              </div>
              <h4 className="font-medium">{t('dashboard.now')}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
            </div>
            
            {activeCards.length > 0 && (
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <CreditCard className="h-3 w-3" />
                </div>
                <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t('dashboard.projectDate')}: +1 {t('dashboard.year')}</p>
              </div>
            )}
            
            <div className="relative pl-8">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
              <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.projectDate')}: {formattedDebtFreeDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate('/debt-summary')}>
          {t('dashboard.viewDetailedTimeline')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DebtFreeTimeline;
