
import { SavedRepaymentStrategy, RepaymentPlan, PrioritizationMethod } from './types';
import { v4 as uuidv4 } from 'uuid';

// Local storage key
const STRATEGIES_STORAGE_KEY = 'debt-repayment-strategies';

// Save a new repayment strategy
export const saveRepaymentStrategy = (
  name: string,
  method: PrioritizationMethod,
  monthlyBudget: number,
  repaymentPlan: RepaymentPlan
): SavedRepaymentStrategy => {
  const strategies = getRepaymentStrategies();
  
  const newStrategy: SavedRepaymentStrategy = {
    id: uuidv4(),
    name,
    method,
    monthlyBudget,
    timeline: repaymentPlan.timeline,
    totalMonths: repaymentPlan.totalMonths,
    totalInterestPaid: repaymentPlan.totalInterestPaid,
    creditCardFreeMonth: repaymentPlan.creditCardFreeMonth,
    createdAt: new Date().toISOString()
  };
  
  strategies.push(newStrategy);
  localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(strategies));
  
  return newStrategy;
};

// Get all saved repayment strategies
export const getRepaymentStrategies = (): SavedRepaymentStrategy[] => {
  const strategiesJson = localStorage.getItem(STRATEGIES_STORAGE_KEY);
  return strategiesJson ? JSON.parse(strategiesJson) : [];
};

// Get a specific repayment strategy by ID
export const getRepaymentStrategyById = (id: string): SavedRepaymentStrategy | undefined => {
  const strategies = getRepaymentStrategies();
  return strategies.find(strategy => strategy.id === id);
};

// Delete a repayment strategy
export const deleteRepaymentStrategy = (id: string): boolean => {
  const strategies = getRepaymentStrategies();
  const filteredStrategies = strategies.filter(strategy => strategy.id !== id);
  
  if (filteredStrategies.length !== strategies.length) {
    localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(filteredStrategies));
    return true;
  }
  
  return false;
};

// Update the active repayment strategy ID in local storage
export const setActiveStrategyId = (id: string | null): void => {
  if (id) {
    localStorage.setItem('active-repayment-strategy', id);
  } else {
    localStorage.removeItem('active-repayment-strategy');
  }
};

// Get the active repayment strategy ID from local storage
export const getActiveStrategyId = (): string | null => {
  return localStorage.getItem('active-repayment-strategy');
};

// Get the currently active repayment strategy
export const getActiveStrategy = (): SavedRepaymentStrategy | undefined => {
  const activeId = getActiveStrategyId();
  if (activeId) {
    return getRepaymentStrategyById(activeId);
  }
  return undefined;
};
