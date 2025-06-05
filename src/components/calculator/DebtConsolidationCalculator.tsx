import React from 'react';
import { useState, useEffect } from 'react';
import { Debt } from '@/utils/calculator/types';
import { calculateConsolidationOptions } from '@/utils/calculator/debtCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        { name: 'Henkilökohtainen laina', interestRate: 10.99, termMonths: 60 },
        { name: 'Saldonsiirto', interestRate: 0, termMonths: 18 },
        { name: 'Asuntolaina', interestRate: 7.5, termMonths: 120 },
        { name: 'Velkojen yhdistämislaina', interestRate: 8.99, termMonths: 48 }
      ];
      
      const results = calculateConsolidationOptions(debts, options);
      setConsolidationOptions(results);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Virhe laskennassa');
      setConsolidationOptions([]);
    }
  }, [debts]);
  
  // Add a custom consolidation option
  const handleAddCustomOption = () => {
    if (!customOption.name || customOption.interestRate < 0 || customOption.termMonths <= 0) {
      setError('Täytä kaikki kentät kelvollisilla arvoilla');
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
      setError(err.message || 'Virhe lisättäessä vaihtoehtoa');
    }
  };
  
  // Update an existing option
  const handleUpdateOption = () => {
    if (!editingOptionId || !customOption.name || customOption.interestRate < 0 || customOption.termMonths <= 0) {
      setError('Täytä kaikki kentät kelvollisilla arvoilla');
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
      setError(err.message || 'Virhe päivittäessä vaihtoehtoa');
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
            Velkojen yhdistäminen
          </CardTitle>
          <CardDescription>Tarkastele velkojen yhdistämismahdollisuuksia</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Lisää ensin velkoja analysoidaksesi yhdistämismahdollisuuksia</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Velkojen yhdistäminen
        </CardTitle>
        <CardDescription>Tarkastele velkojen yhdistämismahdollisuuksia</CardDescription>
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
            Huomio
          </p>
          <p className="mt-1 text-sm">
            Nämä ovat arvioita. Todelliset ehdot voivat vaihdella lainanantajan mukaan.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Lisää oma vaihtoehto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Muokkaa vaihtoehtoa' : 'Lisää oma vaihtoehto'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="optionName">Vaihtoehdon nimi</Label>
                <Input
                  id="optionName"
                  value={customOption.name}
                  onChange={(e) => setCustomOption({...customOption, name: e.target.value})}
                  placeholder="Esim. Oma lainavaihtoehto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Korko (%)</Label>
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
                <Label htmlFor="termMonths">Laina-aika (kuukautta)</Label>
                <Input
                  id="termMonths"
                  type="number"
                  min="1"
                  value={customOption.termMonths}
                  onChange={(e) => setCustomOption({...customOption, termMonths: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Kuinka monessa kuukaudessa laina maksetaan takaisin
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Peruuta</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={isEditing ? handleUpdateOption : handleAddCustomOption}>
                  {isEditing ? 'Päivitä' : 'Lisää'}
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
                  <TableHead>Vaihtoehto</TableHead>
                  <TableHead className="text-right">Korko</TableHead>
                  <TableHead className="text-right">Laina-aika</TableHead>
                  <TableHead className="text-right">Kuukausierä</TableHead>
                  <TableHead className="text-right">Kokonaiskorko</TableHead>
                  <TableHead className="text-right">Maksettu</TableHead>
                  <TableHead className="text-right">Säästö</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidationOptions.map((option) => (
                  <TableRow key={option.id} className={option.interestSaved > 0 ? "bg-green-50/30 dark:bg-green-950/30" : ""}>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell className="text-right">{option.interestRate.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{option.termMonths} kk</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.monthlyPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.totalInterestPaid)}</TableCell>
                    <TableCell className="text-right">{formatDate(option.payoffDate)}</TableCell>
                    <TableCell className={`text-right flex items-center justify-end gap-1 ${option.interestSaved > 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400'}`}>
                      {option.interestSaved > 0 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          {formatCurrency(option.interestSaved)} säästöä
                        </>
                      ) : (
                        formatCurrency(Math.abs(option.interestSaved)) + " enemmän"
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
                              <DialogTitle>{'Muokkaa vaihtoehtoa'}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="editOptionName">Vaihtoehdon nimi</Label>
                                <Input
                                  id="editOptionName"
                                  value={customOption.name}
                                  onChange={(e) => setCustomOption({...customOption, name: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="editInterestRate">Korko (%)</Label>
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
                                <Label htmlFor="editTermMonths">Laina-aika (kuukautta)</Label>
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
                                <Button variant="outline">Peruuta</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleUpdateOption}>
                                  Päivitä
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
          <h4 className="font-semibold">Huomioitavaa velkojen yhdistämisessä</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tarkista mahdolliset kulut ja palkkiot</li>
            <li>Varmista luottokelpoisuutesi</li>
            <li>Mieti vakuuksien tarve</li>
            <li>Älä ota uusia velkoja vanhojen tilalle</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtConsolidationCalculator;
