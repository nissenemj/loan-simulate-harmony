
import React from 'react';
import { useState, useEffect } from 'react';
import { Debt } from '@/utils/calculator/types';
import { calculateConsolidationOptions } from '@/utils/calculator/debtCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingDown, CheckCircle2, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface DebtConsolidationCalculatorProps {
  debts: Debt[];
}

interface ConsolidationOption {
  id: string;
  name: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  payoffDate: string;
  interestSaved: number;
  isCustom?: boolean;
}

/**
 * Debt Consolidation Calculator component
 * Allows users to see potential consolidation options for their debts
 */
const DebtConsolidationCalculator = ({ debts }: DebtConsolidationCalculatorProps) => {
  const { t, locale } = useTranslation();
  const [consolidationOptions, setConsolidationOptions] = useState<ConsolidationOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customOption, setCustomOption] = useState({
    name: '',
    interestRate: 0,
    termMonths: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  
  // Calculate consolidation options when debts change
  useEffect(() => {
    if (debts.length === 0) {
      setConsolidationOptions([]);
      return;
    }
    
    try {
      // Define some common consolidation options
      const options = [
        { name: t('debtPayoff.consolidation.personalLoan'), interestRate: 10.99, termMonths: 60 },
        { name: t('debtPayoff.consolidation.balanceTransfer'), interestRate: 0, termMonths: 18 },
        { name: t('debtPayoff.consolidation.homeEquityLoan'), interestRate: 7.5, termMonths: 120 },
        { name: t('debtPayoff.consolidation.debtConsolidationLoan'), interestRate: 8.99, termMonths: 48 }
      ];
      
      const results = calculateConsolidationOptions(debts, options);
      setConsolidationOptions(results);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error calculating consolidation options');
      setConsolidationOptions([]);
    }
  }, [debts, t]);
  
  // Add a custom consolidation option
  const handleAddCustomOption = () => {
    if (!customOption.name || customOption.interestRate < 0 || customOption.termMonths <= 0) {
      setError('Please fill in all fields with valid values');
      return;
    }
    
    try {
      const newOptions = [...consolidationOptions];
      
      // Calculate for the custom option
      const customResults = calculateConsolidationOptions(debts, [{
        name: customOption.name,
        interestRate: customOption.interestRate,
        termMonths: customOption.termMonths
      }]);
      
      if (customResults.length > 0) {
        // Add isCustom flag to the custom option
        const customResultWithFlag = {
          ...customResults[0],
          isCustom: true
        };
        
        newOptions.push(customResultWithFlag);
        setConsolidationOptions(newOptions);
        
        // Reset the custom option form
        setCustomOption({
          name: '',
          interestRate: 0,
          termMonths: 0
        });
        
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error adding custom option');
    }
  };
  
  // Update an existing option
  const handleUpdateOption = () => {
    if (!editingOptionId || !customOption.name || customOption.interestRate < 0 || customOption.termMonths <= 0) {
      setError('Please fill in all fields with valid values');
      return;
    }
    
    try {
      // Calculate for the updated option
      const updatedResults = calculateConsolidationOptions(debts, [{
        name: customOption.name,
        interestRate: customOption.interestRate,
        termMonths: customOption.termMonths
      }]);
      
      if (updatedResults.length > 0) {
        // Create new options array with the updated option
        const newOptions = consolidationOptions.map(option => 
          option.id === editingOptionId 
            ? { ...updatedResults[0], id: editingOptionId, isCustom: true }
            : option
        );
        
        setConsolidationOptions(newOptions);
        
        // Reset the form and editing state
        setCustomOption({
          name: '',
          interestRate: 0,
          termMonths: 0
        });
        setIsEditing(false);
        setEditingOptionId(null);
        
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error updating option');
    }
  };
  
  // Handle editing an option
  const handleEditOption = (option: ConsolidationOption) => {
    setCustomOption({
      name: option.name,
      interestRate: option.interestRate,
      termMonths: option.termMonths
    });
    setIsEditing(true);
    setEditingOptionId(option.id);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            {t('debtPayoff.consolidation.debtConsolidation')}
          </CardTitle>
          <CardDescription>{t('debtPayoff.consolidation.consolidationDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('debtPayoff.consolidation.noDebtsAdded')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          {t('debtPayoff.consolidation.debtConsolidation')}
        </CardTitle>
        <CardDescription>{t('debtPayoff.consolidation.consolidationDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-4 rounded">
          <p className="font-semibold flex items-center">
            <Info className="h-4 w-4 mr-2" />
            {t('debtPayoff.consolidation.consolidationDisclaimer')}
          </p>
          <p className="mt-1 text-sm">
            {t('debtPayoff.consolidation.consolidationDisclaimerText')}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('debtPayoff.consolidation.addCustomOption')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? t('debtPayoff.consolidation.editOption') : t('debtPayoff.consolidation.addCustomOption')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="optionName">{t('debtPayoff.consolidation.option')}</Label>
                <Input
                  id="optionName"
                  value={customOption.name}
                  onChange={(e) => setCustomOption({...customOption, name: e.target.value})}
                  placeholder={t('debtPayoff.consolidation.optionNamePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">{t('debtPayoff.consolidation.interestRate')}</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={customOption.interestRate}
                  onChange={(e) => setCustomOption({...customOption, interestRate: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termMonths">{t('debtPayoff.consolidation.term')}</Label>
                <Input
                  id="termMonths"
                  type="number"
                  min="1"
                  value={customOption.termMonths}
                  onChange={(e) => setCustomOption({...customOption, termMonths: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  {t('debtPayoff.consolidation.termDescription')}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('debtPayoff.consolidation.cancel')}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={isEditing ? handleUpdateOption : handleAddCustomOption}>
                  {isEditing ? t('debtPayoff.consolidation.update') : t('debtPayoff.consolidation.add')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {consolidationOptions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('debtPayoff.consolidation.option')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.interestRate')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.term')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.monthlyPayment')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.totalInterest')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.payoffDate')}</TableHead>
                  <TableHead className="text-right">{t('debtPayoff.consolidation.potentialSavings')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidationOptions.map((option) => (
                  <TableRow key={option.id} className={option.interestSaved > 0 ? "bg-green-50/30 dark:bg-green-950/30" : ""}>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell className="text-right">{option.interestRate.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{option.termMonths} {t('debtPayoff.consolidation.months')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.monthlyPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.totalInterestPaid)}</TableCell>
                    <TableCell className="text-right">{formatDate(option.payoffDate)}</TableCell>
                    <TableCell className={`text-right flex items-center justify-end gap-1 ${option.interestSaved > 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400'}`}>
                      {option.interestSaved > 0 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          {formatCurrency(option.interestSaved)} {t('debtPayoff.consolidation.saved')}
                        </>
                      ) : (
                        formatCurrency(Math.abs(option.interestSaved)) + " " + t('debtPayoff.consolidation.more')
                      )}
                    </TableCell>
                    <TableCell>
                      {option.isCustom && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditOption(option)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('debtPayoff.consolidation.editOption')}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="editOptionName">{t('debtPayoff.consolidation.option')}</Label>
                                <Input
                                  id="editOptionName"
                                  value={customOption.name}
                                  onChange={(e) => setCustomOption({...customOption, name: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="editInterestRate">{t('debtPayoff.consolidation.interestRate')}</Label>
                                <Input
                                  id="editInterestRate"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={customOption.interestRate}
                                  onChange={(e) => setCustomOption({...customOption, interestRate: parseFloat(e.target.value) || 0})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="editTermMonths">{t('debtPayoff.consolidation.term')}</Label>
                                <Input
                                  id="editTermMonths"
                                  type="number"
                                  min="1"
                                  value={customOption.termMonths}
                                  onChange={(e) => setCustomOption({...customOption, termMonths: parseInt(e.target.value) || 0})}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">{t('debtPayoff.consolidation.cancel')}</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleUpdateOption}>
                                  {t('debtPayoff.consolidation.update')}
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 space-y-2 bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold">{t('debtPayoff.consolidation.consolidationConsiderations')}</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('debtPayoff.consolidation.considerationFees')}</li>
            <li>{t('debtPayoff.consolidation.considerationCredit')}</li>
            <li>{t('debtPayoff.consolidation.considerationCollateral')}</li>
            <li>{t('debtPayoff.consolidation.considerationBehavior')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtConsolidationCalculator;
