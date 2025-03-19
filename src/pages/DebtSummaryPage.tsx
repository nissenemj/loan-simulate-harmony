
import React from "react";
import DebtSummary from "./DebtSummary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";

export default function DebtSummaryPage() {
  // Get loans and credit cards from local storage
  const [loans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards] = useLocalStorage<CreditCard[]>("creditCards", []);

  return <DebtSummary loans={loans} creditCards={creditCards} />;
}
