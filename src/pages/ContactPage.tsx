import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
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
				<p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
					{t("contact.subtitle") ||
						"We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					<Card className="bg-muted/30">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 p-2 rounded-full">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-lg">
									{t("contact.emailTitle") || "Email"}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								{t("contact.emailDescription") ||
									"Send us an email and we'll get back to you."}
							</p>
							<p className="font-medium mt-2">info@velkavapaus.fi</p>
						</CardContent>
					</Card>

					<Card className="bg-muted/30">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 p-2 rounded-full">
									<MapPin className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-lg">
									{t("contact.addressTitle") || "Address"}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								{t("contact.addressDescription") || "Our office location."}
							</p>
							<p className="font-medium mt-2">Helsinki, Finland</p>
						</CardContent>
					</Card>

					<Card className="bg-muted/30">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 p-2 rounded-full">
									<Phone className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-lg">
									{t("contact.phoneTitle") || "Phone"}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								{t("contact.phoneDescription") ||
									"Call us during business hours."}
							</p>
							<p className="font-medium mt-2">+358 XX XXX XXXX</p>
						</CardContent>
					</Card>
				</div>

				<div className="max-w-2xl mx-auto">
					<ContactFormEnhanced />
				</div>
			</div>
		</>
	);
};

export default ContactPage;
