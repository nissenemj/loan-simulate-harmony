
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loan, LoanType, InterestType } from '@/utils/loanCalculations';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface LoanFormProps {
  onAddLoan: (loan: Loan) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onAddLoan }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [repaymentType, setRepaymentType] = useState<LoanType>('annuity');
  const [interestType, setInterestType] = useState<InterestType>('fixed');
  const [isFocused, setIsFocused] = useState(false);
  
  const needsInterestType = repaymentType === 'annuity' || repaymentType === 'fixed-installment';
  
  const resetForm = () => {
    setName('');
    setAmount('');
    setInterestRate('');
    setTermYears('');
    setRepaymentType('annuity');
    setInterestType('fixed');
  };
  
  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast({
        title: "Loan name is required",
        description: "Please enter a name for the loan",
        variant: "destructive",
      });
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid loan amount",
        description: "Please enter a positive number for loan amount",
        variant: "destructive",
      });
      return false;
    }
    
    if (!interestRate || parseFloat(interestRate) <= 0) {
      toast({
        title: "Invalid interest rate",
        description: "Please enter a positive number for interest rate",
        variant: "destructive",
      });
      return false;
    }
    
    if (!termYears || parseInt(termYears) <= 0) {
      toast({
        title: "Invalid loan term",
        description: "Please enter a positive number for loan term in years",
        variant: "destructive",
      });
      return false;
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
    
    onAddLoan(newLoan);
    resetForm();
    
    toast({
      title: "Loan Added",
      description: `${name.trim()} has been added to your loans`,
    });
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
          <CardTitle className="text-xl sm:text-2xl font-medium text-center">Add New Loan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Loan Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Car Loan, Mortgage"
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
                Loan Amount (€)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                placeholder="e.g., 10000"
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
                Annual Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 3.5"
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
                Loan Term (years)
              </Label>
              <Input
                id="termYears"
                type="number"
                min="1"
                step="1"
                placeholder="e.g., 5"
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
                Repayment Type
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
                  <SelectItem value="annuity">Annuity</SelectItem>
                  <SelectItem value="equal-principal">Equal Principal</SelectItem>
                  <SelectItem value="fixed-installment">Fixed Installment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {needsInterestType && (
              <div className="space-y-2">
                <Label htmlFor="interestType" className="text-sm font-medium">
                  Interest Type
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
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable-euribor">Variable - Euribor</SelectItem>
                  </SelectContent>
                </Select>
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
            <span>Add Loan</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoanForm;
