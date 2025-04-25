
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card,
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  AlertCircle, 
  HelpCircle, 
  Percent, 
  Calculator, 
  Calendar, 
  CreditCard, 
  DollarSign 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalculationExplanationsProps {
  onClose?: () => void;
}

const CalculationExplanations = ({ onClose }: CalculationExplanationsProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('calculator.howItWorks') || 'How the Calculator Works'}
        </CardTitle>
        <CardDescription>
          {t('calculator.explanation') || 'Detailed explanations of calculations and assumptions used in the loan simulator'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="loan-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('calculator.loanCalculations') || 'Loan Calculations'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.annuityLoan') || 'Annuity Loan'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.annuityExplanation') || 
                    'Annuity loans have equal monthly payments throughout the loan term. The formula used is:'}
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  MP = P * [r(1+r)^n] / [(1+r)^n - 1]
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.where') || 'Where'}:
                  <br />MP = {t('calculator.monthlyPayment') || 'Monthly Payment'}
                  <br />P = {t('calculator.principalAmount') || 'Principal (Loan Amount)'}
                  <br />r = {t('calculator.monthlyInterestRate') || 'Monthly Interest Rate (Annual Rate / 12 / 100)'}
                  <br />n = {t('calculator.totalNumberOfPayments') || 'Total Number of Payments (Term in Years * 12)'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.equalPrincipalLoan') || 'Equal Principal Loan'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.equalPrincipalExplanation') || 
                    'In equal principal loans, the principal payment remains constant, while the interest payment decreases. The monthly payment is calculated as:'}
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Principal = P / n
                  <br />
                  Interest = Outstanding Balance * r
                  <br />
                  Monthly Payment = Principal + Interest
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.note') || 'Note'}: {t('calculator.monthlyPaymentDecreases') || 'Monthly payment decreases over time as the outstanding balance reduces.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.fixedInstallmentLoan') || 'Fixed Installment Loan'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.fixedInstallmentExplanation') || 
                    'Similar to annuity loans but may have different compounding periods. We use the standard annuity formula for calculations.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.customPaymentLoan') || 'Custom Payment Loan'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.customPaymentExplanation') || 
                    'For custom payment loans, we calculate how long it will take to pay off the loan with your specified payment amount.'}
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Interest Payment = Outstanding Balance * r
                  <br />
                  Principal Payment = Monthly Payment - Interest Payment
                  <br />
                  New Balance = Previous Balance - Principal Payment
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.noteCustomPayment') || 'Note'}: {t('calculator.customPaymentWarning') || 'If your custom payment is less than the monthly interest, the loan will never be paid off.'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="credit-card-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                {t('calculator.creditCardCalculations') || 'Credit Card Calculations'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.minimumPayment') || 'Minimum Payment'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.minimumPaymentExplanation') || 
                    'Credit card minimum payments are calculated using either a fixed amount or a percentage of the balance, whichever is greater:'}
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Minimum Payment = MAX(Fixed Minimum, Balance * Minimum Payment Percentage)
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.noteMinimumPayment') || 'Note'}: {t('calculator.minimumPaymentWarning') || 'Paying only the minimum will result in high interest costs and a long repayment period.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.totalPaymentEstimate') || 'Total Payment Estimate'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.totalPaymentEstimateExplanation') || 
                    'We estimate the total payment needed to repay a credit card as:'}
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Total Payment = Balance + (Balance * APR/100 * EstimatedYears)
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.noteEstimate') || 'Note'}: {t('calculator.estimateExplanation') || 'This is a simplified estimate. Actual payments will vary based on your payment schedule.'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="repayment-strategies">
            <AccordionTrigger>
              <div className="flex items-center">
                <Percent className="mr-2 h-4 w-4" />
                {t('calculator.repaymentStrategies') || 'Repayment Strategies'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{t('repayment.avalancheStrategy') || 'Avalanche Method'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.avalancheExplanation') || 
                    'The Avalanche method prioritizes debts with the highest interest rates first:'}
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>{t('calculator.avalancheStep1') || 'Make minimum payments on all debts'}</li>
                  <li>{t('calculator.avalancheStep2') || 'Put extra money toward the debt with the highest interest rate'}</li>
                  <li>{t('calculator.avalancheStep3') || 'After paying off the highest-rate debt, move to the next highest'}</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.avalancheBenefit') || 'Benefit'}: {t('calculator.avalancheBenefitExplanation') || 'Minimizes the total interest paid over the life of all debts.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('repayment.snowballStrategy') || 'Snowball Method'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.snowballExplanation') || 
                    'The Snowball method prioritizes debts with the smallest balances first:'}
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>{t('calculator.snowballStep1') || 'Make minimum payments on all debts'}</li>
                  <li>{t('calculator.snowballStep2') || 'Put extra money toward the debt with the smallest balance'}</li>
                  <li>{t('calculator.snowballStep3') || 'After paying off the smallest debt, move to the next smallest'}</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.snowballBenefit') || 'Benefit'}: {t('calculator.snowballBenefitExplanation') || 'Provides psychological wins by eliminating individual debts faster.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('dashboard.equalDistribution') || 'Equal Distribution'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.equalDistributionExplanation') || 
                    'The Equal Distribution method distributes extra payments proportionally across all debts:'}
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>{t('calculator.equalStep1') || 'Make minimum payments on all debts'}</li>
                  <li>{t('calculator.equalStep2') || 'Distribute extra money proportionally based on balance size'}</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  {t('calculator.equalBenefit') || 'Benefit'}: {t('calculator.equalBenefitExplanation') || 'Reduces all debts simultaneously, which some may find psychologically satisfying.'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="timeline-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {t('calculator.timelineCalculations') || 'Timeline Calculations'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.debtFreeDate') || 'Debt-Free Date Estimation'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.debtFreeDateExplanation') || 
                    'We calculate the debt-free date by simulating monthly payments until all debts are paid off:'}
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>{t('calculator.debtFreeDateStep1') || 'Apply the selected repayment strategy (Avalanche, Snowball, or Equal)'}</li>
                  <li>{t('calculator.debtFreeDateStep2') || 'Calculate interest and apply payments each month'}</li>
                  <li>{t('calculator.debtFreeDateStep3') || 'Count the number of months until the balance reaches zero'}</li>
                  <li>{t('calculator.debtFreeDateStep4') || 'Add this number of months to the current date'}</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">{t('calculator.assumptions') || 'Assumptions & Limitations'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.assumptionsExplanation') || 
                    'Be aware of these assumptions in our calculations:'}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>{t('calculator.assumption1') || 'Interest rates remain constant unless changed in scenarios'}</li>
                  <li>{t('calculator.assumption2') || 'Monthly payments are made consistently'}</li>
                  <li>{t('calculator.assumption3') || 'No new debt is added'}</li>
                  <li>{t('calculator.assumption4') || 'Credit card minimum payments are recalculated as the balance decreases'}</li>
                  <li>{t('calculator.assumption5') || 'Compound interest is calculated using standard formulas'}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {onClose && (
        <CardFooter>
          <Button onClick={onClose}>{t('common.close') || 'Close'}</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const CalculationTooltip = ({ content }: { content: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { CalculationExplanations, CalculationTooltip };
