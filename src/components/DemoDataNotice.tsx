import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DemoDataNoticeProps {
  onClearDemoData?: () => void;
  showClearButton?: boolean;
  className?: string;
}

/**
 * A component that displays a notice about demo data and provides actions to add real data or clear demo data
 */
const DemoDataNotice: React.FC<DemoDataNoticeProps> = ({
  onClearDemoData,
  showClearButton = true,
  className
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>{t('demoData.title')}</CardTitle>
        </div>
        <CardDescription>{t('demoData.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {t('demoData.explanation')}
        </p>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">{t('demoData.options')}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>{t('demoData.addRealData')}</span>
            </li>
            {showClearButton && (
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>{t('demoData.clearDemoData')}</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3">
        <Button asChild variant="default">
          <Link to="/calculator">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('demoData.addDataButton')}
          </Link>
        </Button>
        
        {showClearButton && onClearDemoData && (
          <Button variant="outline" onClick={onClearDemoData}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('demoData.clearDataButton')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DemoDataNotice;
