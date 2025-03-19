
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, BadgePercent, CreditCard } from 'lucide-react';
import TotalDebtSummary from '@/components/TotalDebtSummary';
import LoanSummaryTable from '@/components/LoanSummaryTable';
import CreditCardSummaryTable from '@/components/CreditCardSummaryTable';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';

interface DebtBreakdownTabsProps {
  activeLoans: Loan[];
  activeCards: CreditCardType[];
}

const DebtBreakdownTabs = ({ activeLoans, activeCards }: DebtBreakdownTabsProps) => {
  const { t } = useLanguage();
  
  return (
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
  );
};

export default DebtBreakdownTabs;
