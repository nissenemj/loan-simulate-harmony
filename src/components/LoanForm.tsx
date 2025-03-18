import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loan, LoanType, InterestType } from '@/utils/loanCalculations';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoanFormProps {
  onAddLoan: (loan: Loan) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onAddLoan }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [repaymentType, setRepaymentType] = useState<LoanType>('annuity');
  const [interestType, setInterestType] = useState<InterestType>('fixed');
  const [customPayment, setCustomPayment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const needsInterestType = repaymentType === 'annuity' || repaymentType === 'fixed-installment';
  const isCustomPayment = repaymentType === 'custom-payment';
  
  useEffect(() => {
    if (!isCustomPayment) {
      setCustomPayment('');
    } else if (amount) {
      const loanAmount = parseFloat(amount);
      const years = parseInt(termYears) || 1;
      const suggestedPayment = (loanAmount / (years * 12)).toFixed(2);
      setCustomPayment(suggestedPayment);
    }
  }, [repaymentType, isCustomPayment, amount, termYears]);
  
  const calculateEstimatedTerm = (): string => {
    if (!isCustomPayment || !amount || !interestRate || !customPayment) return '';
    
    const loanAmount = parseFloat(amount);
    const rate = parseFloat(interestRate);
    const payment = parseFloat(customPayment);
    const monthlyInterestRate = rate / 12 / 100;
    
    if (payment <= loanAmount * monthlyInterestRate) {
      return t('form.paymentTooSmall');
    }
    
    const initialPrincipalPortion = payment - (loanAmount * monthlyInterestRate);
    const roughMonths = Math.ceil(loanAmount / initialPrincipalPortion);
    const years = Math.floor(roughMonths / 12);
    const months = roughMonths % 12;
    
    return years > 0 
      ? `${years} ${t('form.years')}${months > 0 ? ` ${months} ${t('form.months')}` : ''}`
      : `${months} ${t('form.months')}`;
  };
  
  const resetForm = () => {
    setName('');
    setAmount('');
    setInterestRate('');
    setTermYears('');
    setRepaymentType('annuity');
    setInterestType('fixed');
    setCustomPayment('');
  };
  
  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast({
        title: t('validation.nameRequired'),
        description: t('validation.nameRequiredDesc'),
        variant: "destructive",
      });
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: t('validation.invalidAmount'),
        description: t('validation.invalidAmountDesc'),
        variant: "destructive",
      });
      return false;
    }
    
    if (!interestRate || parseFloat(interestRate) <= 0) {
      toast({
        title: t('validation.invalidRate'),
        description: t('validation.invalidRateDesc'),
        variant: "destructive",
      });
      return false;
    }
    
    if (!termYears || parseInt(termYears) <= 0) {
      toast({
        title: t('validation.invalidTerm'),
        description: t('validation.invalidTermDesc'),
        variant: "destructive",
      });
      return false;
    }
    
    if (isCustomPayment && (!customPayment || parseFloat(customPayment) <= 0)) {
      toast({
        title: t('validation.invalidPayment'),
        description: t('validation.invalidPaymentDesc'),
        variant: "destructive",
      });
      return false;
    }
    
    if (isCustomPayment && amount && interestRate) {
      const loanAmount = parseFloat(amount);
      const rate = parseFloat(interestRate);
      const monthlyInterest = loanAmount * (rate / 12 / 100);
      
      if (parseFloat(customPayment) <= monthlyInterest) {
        toast({
          title: t('validation.paymentTooSmall'),
          description: t('validation.paymentTooSmallDesc'),
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newLoan: Loan = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      termYears: parseInt(termYears),
      repaymentType,
      interestType: needsInterestType ? interestType : undefined,
      isActive: true
    };
    
    if (isCustomPayment && customPayment) {
      newLoan.customPayment = parseFloat(customPayment);
    }
    
    onAddLoan(newLoan);
    resetForm();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card 
        className={cn(
          "transition-all duration-300 overflow-hidden", 
          "bg-white/80 backdrop-blur-subtle shadow-subtle hover:shadow-elevated",
          isFocused && "ring-2 ring-primary/20"
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-medium text-center">{t('form.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('form.name')}
              </Label>
              <Input
                id="name"
                placeholder={t('form.name.placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                {t('form.amount')}
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                placeholder={t('form.amount.placeholder')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium">
                {t('form.interest')}
              </Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                step="0.01"
                placeholder={t('form.interest.placeholder')}
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termYears" className="text-sm font-medium">
                {t('form.term')}
              </Label>
              <Input
                id="termYears"
                type="number"
                min="1"
                step="1"
                placeholder={t('form.term.placeholder')}
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repaymentType" className="text-sm font-medium">
                {t('form.repaymentType')}
              </Label>
              <Select
                value={repaymentType}
                onValueChange={(value) => setRepaymentType(value as LoanType)}
                onOpenChange={() => setIsFocused(true)}
              >
                <SelectTrigger
                  id="repaymentType"
                  className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <SelectValue placeholder="Select repayment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annuity">{t('repayment.annuity')}</SelectItem>
                  <SelectItem value="equal-principal">{t('repayment.equalPrincipal')}</SelectItem>
                  <SelectItem value="fixed-installment">{t('repayment.fixedInstallment')}</SelectItem>
                  <SelectItem value="custom-payment">{t('repayment.customPayment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {needsInterestType && (
              <div className="space-y-2">
                <Label htmlFor="interestType" className="text-sm font-medium">
                  {t('form.interestType')}
                </Label>
                <Select
                  value={interestType}
                  onValueChange={(value) => setInterestType(value as InterestType)}
                  onOpenChange={() => setIsFocused(true)}
                >
                  <SelectTrigger
                    id="interestType"
                    className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <SelectValue placeholder="Select interest type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">{t('interest.fixed')}</SelectItem>
                    <SelectItem value="variable-euribor">{t('interest.variableEuribor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {isCustomPayment && (
              <div className="space-y-2">
                <Label htmlFor="customPayment" className="text-sm font-medium">
                  {t('form.customPayment')}
                </Label>
                <Input
                  id="customPayment"
                  type="number"
                  min="0"
                  step="10"
                  placeholder={t('form.customPayment.placeholder')}
                  value={customPayment}
                  onChange={(e) => setCustomPayment(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  required={isCustomPayment}
                />
                {isCustomPayment && amount && interestRate && customPayment && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('form.estimatedTerm')}: {calculateEstimatedTerm()}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 py-5 transition-all"
          >
            <PlusCircle size={18} />
            <span>{t('form.addButton')}</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoanForm;
