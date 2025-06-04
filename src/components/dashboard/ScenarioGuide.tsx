
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ScenarioGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScenarioGuide = ({ isOpen, onClose }: ScenarioGuideProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Skenaarioiden opas</DialogTitle>
          <DialogDescription>
            Tutustu erilaisiin velkojen maksustrategioihin ja niiden vaikutuksiin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Nykyinen tilanne</h4>
            <p className="text-sm text-muted-foreground">
              Nykyinen tilanne perustuu syöttämiisi tietoihin ja maksuehtoihin
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Optimistinen skenaario</h4>
            <p className="text-sm text-muted-foreground">
              Parempi tilanne, jossa korot laskevat tai maksukyky paranee
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Pessimistinen skenaario</h4>
            <p className="text-sm text-muted-foreground">
              Haastavampi tilanne, jossa korot nousevat tai maksukyky heikkenee
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Sulje</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioGuide;
