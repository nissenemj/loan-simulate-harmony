
import { common } from "./modules/common";
import { calculator } from "./modules/calculator";
import { repayment } from "./modules/repayment";
import { loans } from "./modules/loans";
import { creditCards } from "./modules/credit-cards";
import { auth } from "./modules/auth";
import { blog } from "./modules/blog";
import { contact } from "./modules/contact";
import { affiliate } from "./modules/affiliate";
import { course } from "./modules/course";
import { alerts } from "./modules/alerts";
import { calculatorEnhancements } from "./modules/calculator-enhancements";
import { tooltips } from "./modules/tooltips";
import { guidance } from "./modules/guidance";

// English translations
export const en = {
	...common.en,
	...calculator.en,
	...repayment.en,
	...loans.en,
	...creditCards.en,
	...auth.en,
	...blog.en,
	...contact.en,
	...affiliate.en,
	...course.en,
	...alerts.en,
	...calculatorEnhancements.en,
	...tooltips.en,
	...guidance.en,
};

// Finnish translations
export const fi = {
	...common.fi,
	...calculator.fi,
	...repayment.fi,
	...loans.fi,
	...creditCards.fi,
	...auth.fi,
	...blog.fi,
	...contact.fi,
	...affiliate.fi,
	...course.fi,
	...alerts.fi,
	...calculatorEnhancements.fi,
	...tooltips.fi,
	...guidance.fi,
};
