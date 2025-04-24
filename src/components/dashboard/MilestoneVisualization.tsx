
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { HelpTooltip } from '@/components/ui/help-tooltip';

interface TimelinePoint {
  month: number;
  totalRemaining: number;
  totalInterestPaid: number;
}

interface MilestoneVisualizationProps {
  timeline: TimelinePoint[];
  totalDebt: number;
}

export const MilestoneVisualization: React.FC<MilestoneVisualizationProps> = ({ timeline, totalDebt }) => {
  const { t } = useLanguage();

  // Skip rendering if timeline is empty
  if (!timeline.length) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-2 mb-3">
        <h3 className="text-base font-medium">{t('dashboard.keyMilestones')}</h3>
        <HelpTooltip content={t('visualization.milestonesExplanation') || 'Key points in your debt repayment journey'} />
      </div>
      
      <div className="relative pt-6 pb-2" aria-label={t('visualization.debtMilestones') || 'Debt payoff milestones'}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          {timeline.map((point, index) => {
            const milestones = [0.75, 0.5, 0.25, 0];
            const milestone = milestones.find(m => 
              point.totalRemaining <= totalDebt * m && 
              (index === 0 || timeline[index - 1].totalRemaining > totalDebt * m)
            );
            
            if (milestone !== undefined) {
              const position = `${(index / timeline.length) * 100}%`;
              const label = `${(1 - milestone) * 100}%`;
              const percentPaidOff = (1 - milestone) * 100;
              
              return (
                <div 
                  key={label} 
                  className="absolute top-0 transform -translate-x-1/2"
                  style={{ left: position }}
                  aria-label={`${percentPaidOff}% paid off at month ${point.month}`}
                >
                  <div className="h-3 w-3 rounded-full bg-primary -mt-1"></div>
                  <div className="text-xs font-medium mt-1">{label}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('repayment.month')} {point.month}
                  </div>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
