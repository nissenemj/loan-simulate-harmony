import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loan, LoanType, InterestType } from '@/utils/loanCalculations';
import { PlusCircle, Edit, X, Percent, DollarSign, Clock, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoanFormProps {
  onAddLoan: (loan: Loan) => void;
  onUpdateLoan?: (loan: Loan) => void;
  loanToEdit?: Loan | null;
  onCancelEdit?: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ 
  onAddLoan, 
  onUpdateLoan, 
  loanToEdit, 
  onCancelEdit 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [repaymentType, setRepaymentType] = useState<LoanType>('annuity');
  const [interestType, setInterestType] = useState<InterestType>('fixed');
  const [customPayment, setCustomPayment] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (loanToEdit) {
      setName(loanToEdit.name);
      setAmount(loanToEdit.amount.toString());
      setInterestRate(loanToEdit.interestRate.toString());
      setTermYears(loanToEdit.termYears.toString());
      setRepaymentType(loanToEdit.repaymentType);
      setInterestType(loanToEdit.interestType || 'fixed');
      setCustomPayment(loanToEdit.customPayment?.toString() || '');
      setMonthlyFee(loanToEdit.monthlyFee?.toString() || '');
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [loanToEdit]);
  
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
      return t('loan.customPaymentWarning');
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
    setMonthlyFee('');
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
    
    const loanData: Loan = {
      id: isEditing && loanToEdit ? loanToEdit.id : Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      termYears: parseInt(termYears),
      repaymentType,
      interestType: needsInterestType ? interestType : undefined,
      isActive: isEditing && loanToEdit ? loanToEdit.isActive : true
    };
    
    if (isCustomPayment && customPayment) {
      loanData.customPayment = parseFloat(customPayment);
    }
    
    if (monthlyFee && parseFloat(monthlyFee) > 0) {
      loanData.monthlyFee = parseFloat(monthlyFee);
    }
    
    if (isEditing && onUpdateLoan) {
      onUpdateLoan(loanData);
      toast({
        title: t('form.loanUpdated'),
        description: t('form.loanUpdatedDesc'),
      });
    } else {
      onAddLoan(loanData);
      toast({
        title: t('form.loanAdded'),
        description: t('form.loanAddedDesc'),
      });
    }
    
    resetForm();
    if (isEditing && onCancelEdit) {
      onCancelEdit();
    }
  };
  
  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} aria-label="Velan lisäyslomake">
      <Card 
        className={cn(
          "transition-all duration-300 overflow-hidden", 
          "bg-white/80 backdrop-blur-subtle shadow-subtle hover:shadow-elevated",
          isFocused && "ring-2 ring-primary/20"
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-medium text-center">
            {isEditing ? t('form.editTitle') : t('form.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Banknote size={16} className="text-primary" />
                {t('form.name')}
              </Label>
              <Input
                id="name"
                placeholder={t('form.placeholderName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Velan nimi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                {t('form.amount')}
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                placeholder={t('form.placeholderAmount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Velan määrä euroina"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-2">
                <Percent size={16} className="text-primary" />
                {t('form.interestRate')}
              </Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                step="0.01"
                placeholder={t('form.placeholderInterestRate')}
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Korko prosentteina"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termYears" className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                {t('form.termYears')}
              </Label>
              <Input
                id="termYears"
                type="number"
                min="1"
                step="1"
                placeholder={t('form.placeholderTermYears')}
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Laina-aika vuosina"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  aria-label="Lyhennystapa"
                >
                  <SelectValue placeholder="Valitse lyhennystapa" />
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
                    aria-label="Korkotyyppi"
                  >
                    <SelectValue placeholder="Valitse korkotyyppi" />
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
                <Label htmlFor="customPayment" className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={16} className="text-primary" />
                  {t('form.customPayment')}
                </Label>
                <Input
                  id="customPayment"
                  type="number"
                  min="0"
                  step="10"
                  placeholder={t('form.placeholderCustomPayment')}
                  value={customPayment}
                  onChange={(e) => setCustomPayment(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-label="Mukautettu kuukausimaksu"
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
          
          <div className="space-y-2">
            <Label htmlFor="monthlyFee" className="text-sm font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-primary" />
              {t('form.monthlyFee')}
            </Label>
            <Input
              id="monthlyFee"
              type="number"
              min="0"
              step="0.01"
              placeholder={t('form.placeholderMonthlyFee')}
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="bg-white/50 border-muted shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Kuukausimaksu"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('form.monthlyFeeDescription')}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 py-5 transition-all"
                aria-label="Peruuta muokkaus"
              >
                <X size={18} className="mr-2" />
                <span>{t('form.cancel')}</span>
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 py-5 transition-all"
                aria-label="Päivitä velka"
              >
                <Edit size={18} />
                <span>{t('form.update')}</span>
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 py-5 transition-all"
              aria-label="Lisää velka"
            >
              <PlusCircle size={18} />
              <span>{t('form.submit')}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoanForm;
