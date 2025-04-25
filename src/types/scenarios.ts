
export type Strategy = 'avalanche' | 'snowball' | 'equal';

export interface Scenario {
  id: string;
  name: string;
  interestRateAdjustment: number;
  monthlyPayment: number;
  extraPayment: number;
  strategy: Strategy;
}
