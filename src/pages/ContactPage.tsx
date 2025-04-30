import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import ContactFormEnhanced from "@/components/ContactFormEnhanced";

const ContactPage = () => {
	const { t } = useLanguage();
	const [submitted, setSubmitted] = useState(false);

	return (
		<>
			<Helmet>
				<title>{t("contact.pageTitle")} | Velkavapaus</title>
				<meta name="description" content={t("contact.metaDescription")} />
			</Helmet>

			<div className="container max-w-5xl py-12 px-4 md:px-6">
				<h1 className="text-3xl font-bold text-center mb-4">
					{t("contact.title")}
				</h1>
				<p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
					{t("contact.subtitle") ||
						"We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
				</p>

				<div className="max-w-2xl mx-auto">
					<ContactFormEnhanced />
				</div>
			</div>
		</>
	);
};

export default ContactPage;
