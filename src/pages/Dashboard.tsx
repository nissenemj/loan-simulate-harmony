import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PiggyBank, TrendingUp, CreditCard, Calendar, ArrowRight, Clock, Award } from 'lucide-react';
import TotalDebtSummary from '@/components/TotalDebtSummary';
import LoanSummary from '@/components/LoanSummary';
import LoanSummaryTable from '@/components/LoanSummaryTable';
import CreditCardSummaryTable from '@/components/CreditCardSummaryTable';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { formatCurrency } from '@/utils/loanCalculations';
import { DollarSign, CalendarClock, BadgePercent } from 'lucide-react';
import AnimatedNumber from '@/components/AnimatedNumber';

const Dashboard = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCardType[]>("creditCards", []);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const activeLoans = loans.filter(loan => loan.isActive);
  const activeCards = creditCards.filter(card => card.isActive);
  
  const totalDebt = 
    activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
    activeCards.reduce((sum, card) => sum + card.balance, 0);
  
  const now = new Date();
  const debtFreeDate = new Date(now.setFullYear(now.getFullYear() + 3));
  const formattedDebtFreeDate = debtFreeDate.toLocaleDateString('fi-FI');
  
  const monthlyBudget = 1500;
  
  const totalMinPayments = 
    activeLoans.reduce((sum, loan) => {
      return sum + (loan.amount * loan.interestRate / 100 / 12) + (loan.amount / (loan.termYears * 12));
    }, 0) + 
    activeCards.reduce((sum, card) => {
      return sum + Math.max(card.minPayment, card.balance * card.minPaymentPercent / 100);
    }, 0);
  
  const extraBudget = Math.max(0, monthlyBudget - totalMinPayments);
  
  let highestInterestDebt = { name: "", rate: 0 };
  
  activeLoans.forEach(loan => {
    if (loan.interestRate > highestInterestDebt.rate) {
      highestInterestDebt = { name: loan.name, rate: loan.interestRate };
    }
  });
  
  activeCards.forEach(card => {
    if (card.apr > highestInterestDebt.rate) {
      highestInterestDebt = { name: card.name, rate: card.apr };
    }
  });
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
      <Helmet>
        <title>{t('dashboard.title')} | Loan Simulator</title>
      </Helmet>
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}, {user?.email?.split('@')[0] || t('dashboard.user')}</h1>
            <p className="text-muted-foreground">{t('dashboard.welcomeSubtitle')}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/debt-summary')}>
              {t('dashboard.viewDebtSummary')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-muted/50 to-background border shadow-md">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalDebt')}</h3>
                <div className="text-2xl font-bold">
                  <AnimatedNumber
                    value={totalDebt}
                    formatter={formatCurrency}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.debtFreeDate')}</h3>
                <div className="text-2xl font-bold flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                  {formattedDebtFreeDate}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.monthlyPayment')}</h3>
                <div className="text-2xl font-bold">
                  <AnimatedNumber
                    value={totalMinPayments}
                    formatter={formatCurrency}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="mr-2 h-5 w-5 text-primary" />
              {t('dashboard.paymentPlanSummary')}
            </CardTitle>
            <CardDescription>{t('dashboard.paymentPlanDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.monthlyBudget')}</h4>
                <p className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</p>
              </div>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.minimumPayments')}</h4>
                <p className="text-2xl font-bold">{formatCurrency(totalMinPayments)}</p>
              </div>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.extraBudget')}</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{formatCurrency(extraBudget)}</p>
              </div>
            </div>
            
            {highestInterestDebt.name && (
              <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <h4 className="flex items-center text-primary font-medium">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t('dashboard.prioritizedDebt')}
                </h4>
                <p className="mt-1">
                  <span className="font-medium">{highestInterestDebt.name}</span> - {highestInterestDebt.rate.toFixed(2)}% {t('dashboard.interestRate')}
                </p>
                {extraBudget > 0 && (
                  <p className="text-sm mt-2">
                    {t('dashboard.allocatingExtra').replace('{{amount}}', formatCurrency(extraBudget))}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/debt-summary')}>
              {t('dashboard.viewFullPlan')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">{t('dashboard.debtBreakdown')}</h2>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('dashboard.allDebts')}
              </TabsTrigger>
              <TabsTrigger value="loans">
                <BadgePercent className="mr-2 h-4 w-4" />
                {t('dashboard.loans')}
              </TabsTrigger>
              <TabsTrigger value="credit-cards">
                <CreditCard className="mr-2 h-4 w-4" />
                {t('dashboard.creditCards')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TotalDebtSummary loans={activeLoans} creditCards={activeCards} />
            </TabsContent>
            
            <TabsContent value="loans">
              <LoanSummaryTable loans={activeLoans} />
            </TabsContent>
            
            <TabsContent value="credit-cards">
              <CreditCardSummaryTable creditCards={activeCards} />
            </TabsContent>
          </Tabs>
        </div>
        
        {activeLoans.length > 0 && (
          <LoanSummary loans={activeLoans} />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              {t('dashboard.financialTips')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</div>
                <p>{t('dashboard.tip1')}</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</div>
                <p>{t('dashboard.tip2')}</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</div>
                <p>{t('dashboard.tip3')}</p>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onClick={() => navigate('/terms')}>
              {t('dashboard.viewGlossary')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
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
      </div>
    </div>
  );
};

export default Dashboard;
