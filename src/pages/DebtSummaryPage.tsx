
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { toast } from "sonner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, FileText } from "lucide-react";

export default function DebtSummaryPage() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const navigate = useNavigate();

  const handlePayoffLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, amount: 0, isActive: false } : loan))
    );
    
    const loanName = loans.find(loan => loan.id === id)?.name || '';
    toast(`Laina "${loanName}" merkitty maksetuksi`);
  };

  const handlePayoffCreditCard = (id: string) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, balance: 0, isActive: false } : card))
    );
    
    const cardName = creditCards.find(card => card.id === id)?.name || '';
    toast(`Luottokortti "${cardName}" merkitty maksetuksi`);
  };

  const handleClearLoans = () => {
    setLoans([]);
  };

  const handleClearCreditCards = () => {
    setCreditCards([]);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculate totals
  const totalBalance = loans.reduce((sum, loan) => sum + loan.amount, 0) + 
                     creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalMinimumPayments = loans.reduce((sum, loan) => sum + (loan.minPayment || 0), 0) + 
                              creditCards.reduce((sum, card) => sum + card.minPayment, 0);

  if (loans.length === 0 && creditCards.length === 0) {
    return (
      <>
        <Helmet>
          <title>Velkayhteenveto | Velkavapaus.fi</title>
          <meta name="description" content="Näe kaikki velkasi yhdessä paikassa ja seuraa edistymistäsi" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Helmet>
        <div className="container max-w-4xl mx-auto py-4 md:py-8 px-4">
          <div className="space-y-4">
            <BreadcrumbNav />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Takaisin
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 mt-4">Velkayhteenveto</h1>

          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Ei velkoja lisättynä</h3>
              <p className="text-muted-foreground mb-4">
                Lisää ensin lainoja tai luottokortteja nähdäksesi velkatiivistesi
              </p>
              <Button asChild>
                <a href="/calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  Siirry velkalaskuriin
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Velkayhteenveto | Velkavapaus.fi</title>
        <meta name="description" content="Näe kaikki velkasi yhdessä paikassa ja seuraa edistymistäsi" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <div className="container max-w-4xl mx-auto py-4 md:py-8 px-4">
        <div className="space-y-4">
          <BreadcrumbNav />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Takaisin
          </Button>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 mt-4">Velkayhteenveto</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Kokonaisvelka</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-muted-foreground">
                {loans.length + creditCards.length} velkaa yhteensä
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kuukausimaksut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalMinimumPayments)}</div>
              <p className="text-muted-foreground">
                Vähimmäismaksut yhteensä
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            Tämä on yksinkertainen yhteenveto velkoistasi. Käytä velkastrategioita-sivua yksityiskohtaisempaan analyysiin.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
