
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentStrategy } from '@/utils/calculator/types';
import { ArrowDownToLine, TrendingDown, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedStrategySelectorProps {
  selectedStrategy: PaymentStrategy;
  onStrategyChange: (strategy: PaymentStrategy) => void;
  className?: string;
}

/**
 * Enhanced strategy selector with visual cues and detailed explanations
 */
const EnhancedStrategySelector: React.FC<EnhancedStrategySelectorProps> = ({
  selectedStrategy,
  onStrategyChange,
  className
}) => {
  
  const strategies = [
    {
      id: 'avalanche' as PaymentStrategy,
      title: "Lumivyörystrategia",
      description: "Maksa ensin korkoimmat velat - säästää rahaa pitkällä aikavälillä",
      benefits: [
        "Vähemmän korkoja yhteensä",
        "Tehokkain tapa säästää rahaa"
      ],
      icon: TrendingDown,
      color: 'bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/20 dark:border-blue-500/30',
      iconColor: 'text-blue-500 dark:text-blue-400'
    },
    {
      id: 'snowball' as PaymentStrategy,
      title: "Lumipallostrategia",
      description: "Maksa ensin pienimmät velat - lisää motivaatiota nopeilla voitoilla",
      benefits: [
        "Nopeat voitot lisäävät motivaatiota",
        "Helpompi pysyä mukana"
      ],
      icon: ArrowDownToLine,
      color: 'bg-green-500/10 border-green-500/20 dark:bg-green-500/20 dark:border-green-500/30',
      iconColor: 'text-green-500 dark:text-green-400'
    }
  ];
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Valitse takaisinmaksustrategia</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy) => {
          const isSelected = selectedStrategy === strategy.id;
          const Icon = strategy.icon;
          
          return (
            <Card 
              key={strategy.id}
              className={cn(
                "cursor-pointer transition-all border-2",
                isSelected 
                  ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background" 
                  : "hover:border-primary/50",
                strategy.color
              )}
              onClick={() => onStrategyChange(strategy.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", strategy.color)}>
                      <Icon className={cn("h-5 w-5", strategy.iconColor)} />
                    </div>
                    <h4 className="text-lg font-medium">{strategy.title}</h4>
                  </div>
                  
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <p className="mt-3 text-sm text-muted-foreground">
                  {strategy.description}
                </p>
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">Edut</h5>
                  <ul className="space-y-1">
                    {strategy.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedStrategySelector;
