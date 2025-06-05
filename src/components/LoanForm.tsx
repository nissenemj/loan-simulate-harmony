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
      return 'Maksu liian pieni - laina ei koskaan maksettu pois';
    }
    
    const initialPrincipalPortion = payment - (loanAmount * monthlyInterestRate);
    const roughMonths = Math.ceil(loanAmount / initialPrincipalPortion);
    const years = Math.floor(roughMonths / 12);
    const months = roughMonths % 12;
    
    return years > 0 
      ? `${years} vuotta${months > 0 ? ` ${months} kuukautta` : ''}`
      : `${months} kuukautta`;
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
        title: "Nimi vaaditaan",
        description: "Anna lainalle nimi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Virheellinen summa",
        description: "Anna kelvollinen lainasumma",
        variant: "destructive",
      });
      return false;
    }
    
    if (!interestRate || parseFloat(interestRate) <= 0) {
      toast({
        title: "Virheellinen korko",
        description: "Anna kelvollinen korkoprosentti",
        variant: "destructive",
      });
      return false;
    }
    
    if (!termYears || parseInt(termYears) <= 0) {
      toast({
        title: "Virheellinen laina-aika",
        description: "Anna kelvollinen laina-aika vuosina",
        variant: "destructive",
      });
      return false;
    }
    
    if (isCustomPayment && (!customPayment || parseFloat(customPayment) <= 0)) {
      toast({
        title: "Virheellinen maksu",
        description: "Anna kelvollinen kuukausimaksu",
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
          title: "Maksu liian pieni",
          description: "Kuukausimaksun tulee olla suurempi kuin kuukausikorko",
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
        title: "Laina päivitetty",
        description: "Lainatiedot on päivitetty onnistuneesti",
      });
    } else {
      onAddLoan(loanData);
      toast({
        title: "Laina lisätty",
        description: "Uusi laina on lisätty onnistuneesti",
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
    <form onSubmit={handleSubmit} aria-label="Lainan lisäyslomake">
      <Card 
        className={cn(
          "transition-all duration-300 overflow-hidden", 
          "dark:bg-secondary dark:border-bg-highlight backdrop-blur-subtle shadow-subtle hover:shadow-elevated",
          isFocused && "ring-2 ring-primary/20"
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-medium text-center">
            {isEditing ? 'Muokkaa lainaa' : 'Lisää uusi laina'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Banknote size={16} className="text-brand-primary dark:text-brand-primary-light" />
                Lainan nimi
              </Label>
              <Input
                id="name"
                placeholder="Esim. Asuntolaina"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Lainan nimi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} className="text-brand-primary dark:text-brand-primary-light" />
                Lainasumma (€)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                placeholder="100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Lainasumma euroina"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-2">
                <Percent size={16} className="text-brand-primary dark:text-brand-primary-light" />
                Korkoprosentti (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="3.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Korkoprosentti"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termYears" className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} className="text-brand-primary dark:text-brand-primary-light" />
                Laina-aika (vuotta)
              </Label>
              <Input
                id="termYears"
                type="number"
                min="1"
                step="1"
                placeholder="25"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Laina-aika vuosina"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="repaymentType" className="text-sm font-medium">
                Lyhennystyyppi
              </Label>
              <Select
                value={repaymentType}
                onValueChange={(value) => setRepaymentType(value as LoanType)}
                onOpenChange={() => setIsFocused(true)}
              >
                <SelectTrigger
                  id="repaymentType"
                  className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-label="Lyhennystyyppi"
                >
                  <SelectValue placeholder="Valitse lyhennystyyppi" />
                </SelectTrigger>
                <SelectContent className="dark:bg-bg-secondary">
                  <SelectItem value="annuity">Tasaerä</SelectItem>
                  <SelectItem value="equal-principal">Tasalyhennys</SelectItem>
                  <SelectItem value="fixed-installment">Kiinteä erä</SelectItem>
                  <SelectItem value="custom-payment">Oma maksu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {needsInterestType && (
              <div className="space-y-2">
                <Label htmlFor="interestType" className="text-sm font-medium">
                  Korkotyyppi
                </Label>
                <Select
                  value={interestType}
                  onValueChange={(value) => setInterestType(value as InterestType)}
                  onOpenChange={() => setIsFocused(true)}
                >
                  <SelectTrigger
                    id="interestType"
                    className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    aria-label="Korkotyyppi"
                  >
                    <SelectValue placeholder="Valitse korkotyyppi" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-bg-secondary">
                    <SelectItem value="fixed">Kiinteä</SelectItem>
                    <SelectItem value="variable">Vaihtuva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {isCustomPayment && (
            <div className="space-y-2">
              <Label htmlFor="customPayment" className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} className="text-brand-primary dark:text-brand-primary-light" />
                Kuukausimaksu (€)
              </Label>
              <Input
                id="customPayment"
                type="number"
                min="0"
                step="0.01"
                placeholder="1200"
                value={customPayment}
                onChange={(e) => setCustomPayment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Kuukausimaksu euroina"
                required
              />
              {calculateEstimatedTerm() && (
                <p className="text-sm text-muted-foreground">
                  Arvioitu maksuaika: {calculateEstimatedTerm()}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="monthlyFee" className="text-sm font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-brand-primary dark:text-brand-primary-light" />
              Kuukausimaksu (€) - Valinnainen
            </Label>
            <Input
              id="monthlyFee"
              type="number"
              min="0"
              step="0.01"
              placeholder="15"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="dark:bg-bg-elevated dark:border-bg-highlight shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Kuukausimaksu euroina"
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 pt-0">
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isEditing ? (
              <>
                <Edit size={18} className="mr-2" />
                Päivitä laina
              </>
            ) : (
              <>
                <PlusCircle size={18} className="mr-2" />
                Lisää laina
              </>
            )}
          </Button>
          {isEditing && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="dark:border-bg-highlight dark:hover:bg-bg-elevated"
            >
              <X size={18} className="mr-2" />
              Peruuta
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoanForm;
