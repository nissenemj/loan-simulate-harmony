import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Debt } from '@/utils/calculator/types';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { 
  CreditCard, 
  Home, 
  Car, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Percent, 
  Calendar, 
  AlertCircle,
  Check
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface EnhancedDebtFormProps {
  onSave: (debt: Debt) => void;
  onCancel?: () => void;
  initialDebt?: Debt;
  className?: string;
}

/**
 * Enhanced debt input form with improved validation and user guidance
 */
const EnhancedDebtForm: React.FC<EnhancedDebtFormProps> = ({
  onSave,
  onCancel,
  initialDebt,
  className
}) => {
  const { t } = useLanguage();
  
  // Form state
  const [debt, setDebt] = useState<Debt>(() => {
    if (initialDebt) {
      return { ...initialDebt };
    }
    
    return {
      id: uuidv4(),
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'other'
    };
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);
  
  // Debt type options with icons
  const debtTypes = [
    { value: 'credit-card', label: t('loan.types.creditCard'), icon: CreditCard },
    { value: 'mortgage', label: t('loan.types.mortgage'), icon: Home },
    { value: 'auto', label: t('loan.types.auto'), icon: Car },
    { value: 'student', label: t('loan.types.student'), icon: GraduationCap },
    { value: 'personal', label: t('loan.types.personal'), icon: Briefcase },
    { value: 'other', label: t('loan.types.other'), icon: DollarSign }
  ];
  
  // Validate form
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (touched.name && !debt.name.trim()) {
      newErrors.name = t('validation.required');
    }
    
    // Balance validation
    if (touched.balance) {
      if (debt.balance <= 0) {
        newErrors.balance = t('validation.positiveNumber');
      }
    }
    
    // Interest rate validation
    if (touched.interestRate) {
      if (debt.interestRate < 0) {
        newErrors.interestRate = t('validation.nonNegativeNumber');
      } else if (debt.interestRate > 100) {
        newErrors.interestRate = t('validation.maxInterestRate');
      }
    }
    
    // Minimum payment validation
    if (touched.minimumPayment) {
      if (debt.minimumPayment <= 0) {
        newErrors.minimumPayment = t('validation.positiveNumber');
      } else if (debt.minimumPayment > debt.balance) {
        newErrors.minimumPayment = t('validation.paymentExceedsBalance');
      }
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0 && 
      debt.name.trim() !== '' && 
      debt.balance > 0 && 
      debt.interestRate >= 0 && 
      debt.minimumPayment > 0);
  }, [debt, touched, t]);
  
  // Handle input change
  const handleChange = (field: keyof Debt, value: any) => {
    setDebt(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  // Handle blur event
  const handleBlur = (field: keyof Debt) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(debt).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    if (isValid) {
      onSave(debt);
    }
  };
  
  // Get icon for debt type
  const getDebtTypeIcon = (type: string) => {
    const debtType = debtTypes.find(dt => dt.value === type);
    if (!debtType) return DollarSign;
    return debtType.icon;
  };
  
  // Get suggested minimum payment based on balance and type
  const getSuggestedMinPayment = () => {
    if (debt.balance <= 0) return 0;
    
    switch (debt.type) {
      case 'credit-card':
        // Typically 2-4% of balance
        return Math.max(20, Math.round(debt.balance * 0.03));
      case 'mortgage':
        // Rough estimate for mortgage
        return Math.round(debt.balance * 0.005);
      case 'auto':
        // Rough estimate for auto loan
        return Math.round(debt.balance * 0.02);
      case 'student':
        // Rough estimate for student loan
        return Math.round(debt.balance * 0.01);
      default:
        // Default suggestion
        return Math.max(20, Math.round(debt.balance * 0.02));
    }
  };
  
  // Get typical interest rate range based on type
  const getInterestRateHint = () => {
    switch (debt.type) {
      case 'credit-card':
        return t('loan.interestHints.creditCard');
      case 'mortgage':
        return t('loan.interestHints.mortgage');
      case 'auto':
        return t('loan.interestHints.auto');
      case 'student':
        return t('loan.interestHints.student');
      case 'personal':
        return t('loan.interestHints.personal');
      default:
        return '';
    }
  };
  
  const TypeIcon = getDebtTypeIcon(debt.type);
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TypeIcon className="h-5 w-5 text-primary" />
          {initialDebt ? t('loan.editDebt') : t('loan.addNewDebt')}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Debt Type */}
          <div className="space-y-2">
            <Label htmlFor="debt-type">
              {t('loan.type')}
              <HelpTooltip content={t('loan.typeTooltip')} className="ml-1" />
            </Label>
            <Select
              value={debt.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger id="debt-type" className="w-full">
                <SelectValue placeholder={t('loan.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {debtTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          {/* Debt Name */}
          <div className="space-y-2">
            <Label htmlFor="debt-name" className={errors.name ? 'text-destructive' : ''}>
              {t('loan.name')}
              <HelpTooltip content={t('loan.nameTooltip')} className="ml-1" />
            </Label>
            <Input
              id="debt-name"
              value={debt.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={t('loan.namePlaceholder')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>
          
          {/* Debt Balance */}
          <div className="space-y-2">
            <Label htmlFor="debt-balance" className={errors.balance ? 'text-destructive' : ''}>
              {t('loan.balance')}
              <HelpTooltip content={t('loan.balanceTooltip')} className="ml-1" />
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </span>
              <Input
                id="debt-balance"
                type="number"
                value={debt.balance || ''}
                onChange={(e) => handleChange('balance', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('balance')}
                placeholder="0.00"
                className={cn("pl-8", errors.balance ? 'border-destructive' : '')}
                step="0.01"
                min="0"
              />
            </div>
            {errors.balance && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.balance}
              </p>
            )}
          </div>
          
          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="debt-interest" className={errors.interestRate ? 'text-destructive' : ''}>
              {t('loan.interestRate')}
              <HelpTooltip content={t('loan.interestRateTooltip')} className="ml-1" />
            </Label>
            <div className="relative">
              <Input
                id="debt-interest"
                type="number"
                value={debt.interestRate || ''}
                onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('interestRate')}
                placeholder="0.00"
                className={cn("pr-8", errors.interestRate ? 'border-destructive' : '')}
                step="0.01"
                min="0"
                max="100"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                <Percent className="h-4 w-4" />
              </span>
            </div>
            {errors.interestRate ? (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.interestRate}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {getInterestRateHint()}
              </p>
            )}
          </div>
          
          {/* Minimum Payment */}
          <div className="space-y-2">
            <Label htmlFor="debt-payment" className={errors.minimumPayment ? 'text-destructive' : ''}>
              {t('loan.minimumPayment')}
              <HelpTooltip content={t('loan.minimumPaymentTooltip')} className="ml-1" />
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </span>
              <Input
                id="debt-payment"
                type="number"
                value={debt.minimumPayment || ''}
                onChange={(e) => handleChange('minimumPayment', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('minimumPayment')}
                placeholder="0.00"
                className={cn("pl-8", errors.minimumPayment ? 'border-destructive' : '')}
                step="0.01"
                min="0"
              />
            </div>
            {errors.minimumPayment ? (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.minimumPayment}
              </p>
            ) : (
              debt.balance > 0 && (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => handleChange('minimumPayment', getSuggestedMinPayment())}
                >
                  {t('loan.suggestedPayment', { amount: getSuggestedMinPayment() })}
                </Button>
              )
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!isValid && Object.keys(touched).length > 0}
            className="ml-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            {initialDebt ? t('common.update') : t('common.add')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EnhancedDebtForm;
