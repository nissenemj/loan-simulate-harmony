
import React, { useState } from 'react';
import { Loan, formatCurrency, formatPercentage, calculateLoan } from '@/utils/loanCalculations';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calculator } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import AnimatedNumber from './AnimatedNumber';

interface LoanTableProps {
  loans: Loan[];
  onToggleActive: (id: string, isActive: boolean) => void;
  onDeleteLoan: (id: string) => void;
  onEditLoan: (loan: Loan) => void;
}

const LoanTable: React.FC<LoanTableProps> = ({ 
  loans, 
  onToggleActive, 
  onDeleteLoan, 
  onEditLoan 
}) => {
  const { toast } = useToast();
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleActive = (id: string, isActive: boolean) => {
    onToggleActive(id, isActive);
    
    const loan = loans.find(loan => loan.id === id);
    if (loan) {
      toast({
        title: isActive ? "Laina aktivoitu" : "Laina poistettu käytöstä",
        description: `${loan.name} ${isActive ? 'on nyt aktiivinen' : 'poistettu käytöstä'}`,
      });
    }
  };

  const handleEditClick = (loan: Loan) => {
    console.log('Edit button clicked for loan:', loan);
    onEditLoan(loan);
    toast({
      title: "Muokkaa lainaa",
      description: `Avaa lainan ${loan.name} muokkauslomake`,
    });
  };

  const confirmDelete = (loan: Loan) => {
    setLoanToDelete(loan);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (loanToDelete) {
      onDeleteLoan(loanToDelete.id);
      toast({
        title: "Laina poistettu",
        description: `${loanToDelete.name} on poistettu onnistuneesti`,
      });
      setLoanToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatLoanType = (type: string): string => {
    const translations = {
      'annuity': 'Tasaerä',
      'equal-principal': 'Tasalyhennys',
      'fixed-installment': 'Kiinteä erä',
      'custom-payment': 'Oma maksu'
    };
    return translations[type as keyof typeof translations] || type;
  };

  const formatInterestType = (type?: string): string => {
    if (!type) return '';
    const translations = {
      'fixed': 'Kiinteä',
      'variable': 'Vaihtuva'
    };
    return translations[type as keyof typeof translations] || type;
  };

  if (loans.length === 0) {
    return (
      <Card className="dark:bg-secondary dark:border-bg-highlight">
        <CardHeader>
          <CardTitle className="text-xl">Lainat</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              Ei vielä lisättyjä lainoja. Lisää ensimmäinen lainasi yllä olevalla lomakkeella.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="dark:bg-secondary dark:border-bg-highlight overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Lainat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-bg-highlight">
                  <TableHead className="w-[200px]">Laina</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Korko</TableHead>
                  <TableHead>Aika</TableHead>
                  <TableHead>Tyyppi</TableHead>
                  <TableHead>Kuukausierä</TableHead>
                  <TableHead className="text-right">Toiminnot</TableHead>
                  <TableHead className="text-right">Aktiivinen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => {
                  const calculation = calculateLoan(loan);
                  return (
                    <TableRow 
                      key={loan.id} 
                      className={cn(
                        "dark:border-bg-highlight transition-colors",
                        !loan.isActive && "opacity-60"
                      )}
                    >
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div>{loan.name}</div>
                          {loan.monthlyFee && loan.monthlyFee > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{formatCurrency(loan.monthlyFee)}/kk
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AnimatedNumber
                          value={loan.amount}
                          formatter={(v) => formatCurrency(v)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <AnimatedNumber
                            value={loan.interestRate}
                            formatter={(v) => formatPercentage(v)}
                          />
                          {loan.interestType && (
                            <div className="text-xs text-muted-foreground">
                              {formatInterestType(loan.interestType)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {loan.termYears} vuotta
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{formatLoanType(loan.repaymentType)}</div>
                          {loan.customPayment && (
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(loan.customPayment)}/kk
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AnimatedNumber
                          value={calculation.monthlyPayment}
                          formatter={(v) => formatCurrency(v)}
                        />
                        {calculation.totalInterest && (
                          <div className="text-xs text-muted-foreground">
                            Kokonaiskorko: <AnimatedNumber
                              value={calculation.totalInterest}
                              formatter={(v) => formatCurrency(v)}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(loan)}
                            className="hover:bg-accent"
                            aria-label={`Muokkaa lainaa ${loan.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(loan)}
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            aria-label={`Poista laina ${loan.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={loan.isActive}
                          onCheckedChange={(checked) => handleToggleActive(loan.id, checked)}
                          aria-label={`${loan.isActive ? 'Poista käytöstä' : 'Aktivoi'} laina ${loan.name}`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vahvista poisto</DialogTitle>
            <DialogDescription>
              Haluatko varmasti poistaa lainan "{loanToDelete?.name}"? Tätä toimintoa ei voi peruuttaa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Peruuta
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Poista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanTable;
