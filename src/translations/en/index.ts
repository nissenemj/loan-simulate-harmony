
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

// Export the combined translations
export const en = {
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
  affiliate,
  blog,
  language,
  landing
};

// Define the type based on the complete English translations
export type TranslationsType = typeof en;
