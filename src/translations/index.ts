import { common } from "./modules/common";
import { navigation } from "./modules/navigation";
import { forms } from "./modules/forms";
import { tables } from "./modules/tables";
import { results } from "./modules/results";
import { lists } from "./modules/lists";
import { loans } from "./modules/loans";
import { creditCards } from "./modules/credit-cards";
import { calculator } from "./modules/calculator";
import { debtStrategies } from "./modules/debt-strategies";
import { repayment } from "./modules/repayment";
import { visualization } from "./modules/visualization";
import { debtSummary } from "./modules/debt-summary";
import { dashboard } from "./modules/dashboard";
import { recommendations } from "./modules/recommendations";
import { tooltips } from "./modules/tooltips";
import { footer } from "./modules/footer";
import { landing } from "./modules/landing";
import { auth } from "./modules/auth";
import { newsletter } from "./modules/newsletter";
import { blog } from "./modules/blog";
import { course } from "./modules/course";
import { alerts } from "./modules/alerts";
import { affiliate } from "./modules/affiliate";
import { errors } from "./modules/errors";
import { savings } from "./modules/savings";

// Merge all translation modules for English
export const en = {
	...common.en,
	...navigation.en,
	...forms.en,
	...tables.en,
	...results.en,
	...lists.en,
	...loans.en,
	...creditCards.en,
	...calculator.en,
	...debtStrategies.en,
	...repayment.en,
	...visualization.en,
	...debtSummary.en,
	...dashboard.en,
	...recommendations.en,
	...tooltips.en,
	...footer.en,
	...landing.en,
	...auth.en,
	...newsletter.en,
	...blog.en,
	...course.en,
	...alerts.en,
	...affiliate.en,
	...errors.en,
	...savings.en,
};

// Merge all translation modules for Finnish
export const fi = {
	...common.fi,
	...navigation.fi,
	...forms.fi,
	...tables.fi,
	...results.fi,
	...lists.fi,
	...loans.fi,
	...creditCards.fi,
	...calculator.fi,
	...debtStrategies.fi,
	...repayment.fi,
	...visualization.fi,
	...debtSummary.fi,
	...dashboard.fi,
	...recommendations.fi,
	...tooltips.fi,
	...footer.fi,
	...landing.fi,
	...auth.fi,
	...newsletter.fi,
	...blog.fi,
	...course.fi,
	...alerts.fi,
	...affiliate.fi,
	...errors.fi,
	...savings.fi,
};

// Also export as default for backward compatibility
export default { en, fi };
