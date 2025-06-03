
import React from 'react';
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
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Esimerkkitiedot käytössä</CardTitle>
        </div>
        <CardDescription>Käytössä on esimerkkitietoja havainnollistamaan toimintoja</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Nämä tiedot on tarkoitettu vain demonstraatioon. Lisää omat velkasi saadaksesi tarkkoja tuloksia.
        </p>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Vaihtoehdot:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>Lisää omat velkasi laskurissa</span>
            </li>
            {showClearButton && (
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Tyhjennä esimerkkitiedot</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3">
        <Button asChild variant="default">
          <Link to="/calculator">
            <PlusCircle className="h-4 w-4 mr-2" />
            Lisää tietoja
          </Link>
        </Button>
        
        {showClearButton && onClearDemoData && (
          <Button variant="outline" onClick={onClearDemoData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Tyhjennä tiedot
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DemoDataNotice;
