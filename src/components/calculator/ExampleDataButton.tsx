
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Wand2 } from 'lucide-react';
import { Debt } from '@/utils/calculator/types';
import { v4 as uuidv4 } from 'uuid';

interface ExampleDataButtonProps {
  onFillExample: (debts: Debt[]) => void;
  className?: string;
}

const ExampleDataButton: React.FC<ExampleDataButtonProps> = ({
  onFillExample,
  className
}) => {
  
  const handleFillExample = () => {
    const exampleDebts: Debt[] = [
      {
        id: uuidv4(),
        name: 'Luottokortti',
        balance: 3500,
        interestRate: 18.5,
        minimumPayment: 150,
        type: 'credit-card'
      },
      {
        id: uuidv4(),
        name: 'Henkilökohtainen laina',
        balance: 8000,
        interestRate: 7.2,
        minimumPayment: 180,
        type: 'loan'
      },
      {
        id: uuidv4(),
        name: 'Autolaina',
        balance: 12000,
        interestRate: 4.5,
        minimumPayment: 220,
        type: 'loan'
      }
    ];
    
    onFillExample(exampleDebts);
  };
  
  return (
    <div className={className}>
      <Alert className="border-primary/20 bg-primary/5">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            Voit tyhjentää kentät ja syöttää omat tietosi tai kokeilla esimerkkitiedoilla:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFillExample}
            className="ml-4 h-8"
          >
            <Wand2 className="mr-2 h-3 w-3" />
            Täytä esimerkkitiedoilla
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ExampleDataButton;
