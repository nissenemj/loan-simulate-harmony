
import { app } from './app';
import { tabs } from './tabs';
import { auth } from './auth';
import { navigation } from './navigation';
import { form } from './form';
import { creditCard } from './creditCard';
import { toast } from './toast';
import { hero } from './hero';
import { features } from './features';
import { dashboard } from './dashboard';
import { results } from './results';
import { table } from './table';
import { repayment } from './repayment';
import { savings } from './savings';
import { summary } from './summary';
import { affiliate } from './affiliate';
import { blog } from './blog';
import { language } from './language';
import { landing } from './landing';
import { debtSummary } from './debtSummary';
import { budgetImpact } from './budgetImpact';
import { glossary } from './glossary';
import { ads } from './ads';

// Import the translation type from EN
import { TranslationsType } from '../en';

// Export the combined translations
export const fi: TranslationsType = {
  app,
  tabs,
  auth,
  navigation,
  form,
  creditCard,
  toast,
  hero,
  features,
  dashboard,
  results,
  table,
  repayment,
  savings,
  summary,
  affiliate, // Ensuring affiliate is included here
  blog,
  language,
  landing,
  debtSummary,
  budgetImpact,
  glossary,
  ads
};
