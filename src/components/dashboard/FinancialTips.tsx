
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancialTips = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Talousvinkit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</div>
            <p>Maksa aina vähintään vähimmäismaksut kaikista veloista</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</div>
            <p>Keskity korkeimman koron velkojen maksamiseen ensin</p>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</div>
            <p>Luo kuukausittainen budjetti ja noudata sitä</p>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" onClick={() => navigate('/terms')}>
          Näytä sanasto
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialTips;
