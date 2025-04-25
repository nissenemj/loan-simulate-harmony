
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.scenarioGuideTitle')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.scenarioGuideIntro')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">{t('scenarios.current')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.currentScenarioExplained')}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">{t('scenarios.optimistic')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.optimisticScenarioExplained')}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">{t('scenarios.pessimistic')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.pessimisticScenarioExplained')}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{t('common.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioGuide;
