import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";

const CreditCardsPage = () => {
	const { t } = useLanguage();

	return (
		<div className="container mx-auto p-4">
			<Helmet>
				<title>
					{t("tabs.creditCards")} | {t("app.title")}
				</title>
			</Helmet>
			<h1 className="text-2xl font-bold mb-4">{t("tabs.creditCards")}</h1>
			<p className="text-muted-foreground">
				{t("creditCards.pageDescription")}
			</p>
		</div>
	);
};

export default CreditCardsPage;
