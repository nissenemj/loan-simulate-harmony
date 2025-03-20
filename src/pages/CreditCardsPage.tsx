import { useLanguage } from '@/contexts/LanguageContext';

const CreditCardsPage = () => {
  const { t } = useLanguage();
  const handleAddCreditCard = (card) => {
    console.log('New credit card added:', card);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("tabs.creditCards")}</h1>
      <CreditCardForm onAddCreditCard={handleAddCreditCard} />
    </div>
  );
};