
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Award, ArrowRight, DollarSign, CircleDollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCardType[];
}

const DebtFreeTimeline = ({ totalDebt, formattedDebtFreeDate, activeCards }: DebtFreeTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Simuloitu optimoidun maksun päivämäärä (todellisessa käytössä tulee käyttää simulateRepayment-funktiota)
  const optimizedDate = new Date();
  optimizedDate.setFullYear(optimizedDate.getFullYear() + 2); // 2 vuotta optimoidulla maksusuunnitelmalla
  const formattedOptimizedDate = optimizedDate.toLocaleDateString('fi-FI');
  
  // Simuloidut kokonaissummat (todellisuudessa nämä laskettaisiin simulateRepayment-funktiolla)
  const totalMinimumPayments = totalDebt * 1.3; // +30% korkoa minimimaksuilla
  const totalOptimizedPayments = totalDebt * 1.15; // +15% korkoa optimoidulla strategialla
  const savedAmount = totalMinimumPayments - totalOptimizedPayments;
  
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
        <Tabs defaultValue="minimum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="minimum">{t('repayment.minimumPayments')}</TabsTrigger>
            <TabsTrigger value="optimized">{t('repayment.optimizedStrategy')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="minimum" className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Clock className="h-3 w-3 text-primary-foreground" />
                </div>
                <h4 className="font-medium">{t('dashboard.now')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}
                </p>
              </div>
              
              {activeCards.length > 0 && (
                <div className="relative pl-8 pb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-3 w-3" />
                  </div>
                  <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{t('dashboard.projectDate')}: +3 {t('dashboard.years')}</p>
                </div>
              )}
              
              <div className="relative pl-8">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.projectDate')}: {formattedDebtFreeDate}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.totalPaid')}: {formatCurrency(totalMinimumPayments)}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimized" className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Clock className="h-3 w-3 text-primary-foreground" />
                </div>
                <h4 className="font-medium">{t('dashboard.now')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}
                </p>
              </div>
              
              {activeCards.length > 0 && (
                <div className="relative pl-8 pb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <CreditCard className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{t('dashboard.projectDate')}: +8 {t('dashboard.months')}</p>
                </div>
              )}
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.projectDate')}: {formattedOptimizedDate}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.totalPaid')}: {formatCurrency(totalOptimizedPayments)}
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <CircleDollarSign className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-medium">{t('repayment.savings')}</h4>
                <p className="text-sm font-medium text-green-600 mt-1">
                  {formatCurrency(savedAmount)} {t('repayment.saved')}
                </p>
              </div>
            </div>
            
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('repayment.strategyUsed')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('repayment.avalancheDescription')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
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
