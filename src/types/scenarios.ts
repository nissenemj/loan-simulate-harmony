
import { PaymentStrategy } from '../utils/calculator/types';

export type Strategy = PaymentStrategy;

export interface Scenario {
  id: string;
  name: string;
  interestRateAdjustment: number;
  monthlyPayment: number;
  extraPayment: number;
  strategy: Strategy;
}
