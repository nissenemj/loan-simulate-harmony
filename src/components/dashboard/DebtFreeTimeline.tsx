
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Bookmark, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/loanCalculations';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { 
  getActiveStrategy, 
  getRepaymentStrategies, 
  SavedRepaymentStrategy, 
  setActiveStrategyId,
  generateRepaymentPlan,
  DebtItem
} from '@/utils/repayment';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { convertLoanToDebtItem, convertCreditCardToDebtItem } from '@/utils/repayment/debtConverters';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCard[];
  activeLoans: Loan[];
  monthlyBudget: number;
}

const DebtFreeTimeline = ({
  totalDebt,
  formattedDebtFreeDate,
  activeCards,
  activeLoans,
  monthlyBudget
}: DebtFreeTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [savedStrategies, setSavedStrategies] = useState<SavedRepaymentStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<SavedRepaymentStrategy | null>(null);
  const [debtFreeDate, setDebtFreeDate] = useState<Date | null>(null);
  const [creditCardFreeDate, setCreditCardFreeDate] = useState<Date | null>(null);
  
  const hasDebts = totalDebt > 0 || activeCards.length > 0 || activeLoans.length > 0;
  
  // Load saved strategies on mount
  useEffect(() => {
    const strategies = getRepaymentStrategies();
    setSavedStrategies(strategies);
    
    const active = getActiveStrategy();
    if (active) {
      setActiveStrategy(active);
    }
  }, []);
  
  // Calculate dates when active strategy or debts change
  useEffect(() => {
    if (hasDebts) {
      calculateDates();
    }
  }, [activeStrategy, activeCards, activeLoans, monthlyBudget]);
  
  const calculateDates = () => {
    const now = new Date();
    let monthsToDebtFree = 0;
    let monthsToCreditCardFree = 0;
    
    if (activeStrategy && activeStrategy.timeline && activeStrategy.timeline.length > 0) {
      // Use saved strategy timeline
      monthsToDebtFree = activeStrategy.totalMonths || 0;
      monthsToCreditCardFree = activeStrategy.creditCardFreeMonth || 0;
    } else {
      // No active strategy or strategy has no timeline, calculate a simple estimate
      try {
        // Convert loans and credit cards to debt items
        const debtItems: DebtItem[] = [
          ...activeLoans.map(convertLoanToDebtItem),
          ...activeCards.map(convertCreditCardToDebtItem)
        ];
        
        // Use avalanche method for the calculation
        const calculatedPlan = generateRepaymentPlan(debtItems, monthlyBudget, 'avalanche');
        
        if (calculatedPlan.isViable) {
          monthsToDebtFree = calculatedPlan.totalMonths || 0;
          monthsToCreditCardFree = calculatedPlan.creditCardFreeMonth || 0;
        }
      } catch (error) {
        console.error("Error calculating repayment plan:", error);
      }
    }
    
    // Calculate dates
    if (monthsToDebtFree > 0) {
      const debtFreeDateCalc = new Date(now);
      debtFreeDateCalc.setMonth(now.getMonth() + monthsToDebtFree);
      setDebtFreeDate(debtFreeDateCalc);
    } else {
      setDebtFreeDate(null);
    }
    
    if (monthsToCreditCardFree > 0) {
      const cardFreeDateCalc = new Date(now);
      cardFreeDateCalc.setMonth(now.getMonth() + monthsToCreditCardFree);
      setCreditCardFreeDate(cardFreeDateCalc);
    } else {
      setCreditCardFreeDate(null);
    }
  };
  
  // Format date as locale string
  const formatDate = (date: Date | null): string => {
    if (!date) return t('debtStrategies.errorMaxMonths');
    return date.toLocaleDateString('fi-FI');
  };
  
  // Set active strategy
  const selectStrategy = (strategy: SavedRepaymentStrategy | null) => {
    if (strategy) {
      setActiveStrategy(strategy);
      setActiveStrategyId(strategy.id);
      toast.success(t('dashboard.strategySelected', { name: strategy.name }));
    } else {
      setActiveStrategy(null);
      setActiveStrategyId(null);
      toast.info(t('dashboard.strategyCleared'));
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            {t('dashboard.debtFreeTimeline')}
          </CardTitle>
          
          {savedStrategies.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {activeStrategy ? activeStrategy.name : t('dashboard.selectStrategy')}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('dashboard.savedStrategies')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {savedStrategies.map(strategy => (
                  <DropdownMenuItem 
                    key={strategy.id}
                    onClick={() => selectStrategy(strategy)}
                    className={activeStrategy?.id === strategy.id ? 'bg-accent' : ''}
                  >
                    {strategy.name} ({t(`dashboard.${strategy.method}Strategy`)})
                  </DropdownMenuItem>
                ))}
                {activeStrategy && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => selectStrategy(null)}>
                      {t('dashboard.clearStrategy')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardDescription>{t('dashboard.timelineDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasDebts ? (
          <div className="relative pt-4">
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
            
            <div className="relative mb-12">
              <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-primary"></div>
              <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                <h4 className="font-medium">{t('dashboard.now')}</h4>
                <p className="text-sm text-muted-foreground">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
              </div>
            </div>
            
            {activeCards.length > 0 && creditCardFreeDate && (
              <div className="relative mb-12">
                <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-primary/70"></div>
                <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                  <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.projectDate')}: {formatDate(creditCardFreeDate)}
                  </p>
                </div>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-green-600"></div>
              <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.projectDate')}: {formatDate(debtFreeDate)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">{t('noDebtToDisplay')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {t('dashboard.timelineExplanation')}. {t('dashboard.paymentFlowExplanation')}.
        </div>
        <Button variant="outline" onClick={() => navigate('/debt-summary?tab=repayment-plan')}>
          {t('dashboard.goToRepaymentPlan')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DebtFreeTimeline;
