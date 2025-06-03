
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import ContactFormEnhanced from "@/components/ContactFormEnhanced";

const ContactPage = () => {
	const [submitted, setSubmitted] = useState(false);

	return (
		<>
			<Helmet>
				<title>Yhteystiedot | Velkavapaus</title>
				<meta name="description" content="Ota yhteyttä - autamme velkakysymyksissä" />
			</Helmet>

			<div className="container max-w-5xl py-12 px-4 md:px-6">
				<h1 className="text-3xl font-bold text-center mb-4">
					Yhteystiedot
				</h1>
				<p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
					Haluamme kuulla sinusta. Lähetä meille viesti ja vastaamme mahdollisimman pian.
				</p>

				<div className="max-w-2xl mx-auto">
					<ContactFormEnhanced />
				</div>
			</div>
		</>
	);
};

export default ContactPage;
