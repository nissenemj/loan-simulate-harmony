
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EnhancedFormField } from "@/components/ui/enhanced-form-field";
import {
	FormFieldGroup,
	SplitFormFields,
} from "@/components/ui/form-field-group";
import { Send, Loader2, User, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

// Yksinkertaiset validaattorit suoraan komponentissa
const createRequiredValidator = (errorMessage: string = "Tämä kenttä on pakollinen") => {
  return (value: string) => {
    const isValid = value.trim().length > 0;
    return { isValid, message: isValid ? undefined : errorMessage };
  };
};

const createEmailValidator = (errorMessage: string = "Syötä kelvollinen sähköpostiosoite") => {
  return (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return { isValid, message: isValid ? undefined : errorMessage };
  };
};

const createMinLengthValidator = (minLength: number, errorMessage: string) => {
  return (value: string) => {
    const isValid = value.trim().length >= minLength;
    return { isValid, message: isValid ? undefined : errorMessage };
  };
};

const combineValidators = (...validators: ((value: string) => { isValid: boolean; message?: string })[]) => {
  return (value: string) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};

interface ContactFormEnhancedProps {
	className?: string;
}

const ContactFormEnhanced: React.FC<ContactFormEnhancedProps> = ({
	className,
}) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Validation functions
	const nameValidator = combineValidators(
		createRequiredValidator("Nimi on pakollinen"),
		createMinLengthValidator(2, "Nimen täytyy olla vähintään 2 merkkiä")
	);

	const emailValidator = combineValidators(
		createRequiredValidator("Sähköposti on pakollinen"),
		createEmailValidator("Syötä kelvollinen sähköpostiosoite")
	);

	const messageValidator = combineValidators(
		createRequiredValidator("Viesti on pakollinen"),
		createMinLengthValidator(10, "Viestin täytyy olla vähintään 10 merkkiä")
	);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Validate first name
		const firstNameResult = nameValidator(formData.firstName);
		if (!firstNameResult.isValid) {
			newErrors.firstName = firstNameResult.message || "Nimi on pakollinen";
		}

		// Validate email
		const emailResult = emailValidator(formData.email);
		if (!emailResult.isValid) {
			newErrors.email = emailResult.message || "Sähköposti on pakollinen";
		}

		// Validate message
		const messageResult = messageValidator(formData.message);
		if (!messageResult.isValid) {
			newErrors.message = messageResult.message || "Viesti on pakollinen";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast("Tarkista lomakkeen tiedot", {
				description: "Joitakin kenttiä puuttuu tai ne sisältävät virheitä.",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Simuloidaan lähettämistä
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast("Viesti lähetetty!", {
				description: "Otamme sinuun yhteyttä pian.",
			});

			// Reset form
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
			});
			setErrors({});
		} catch (error) {
			toast("Virhe viestin lähetyksessä", {
				description: "Yritä uudelleen myöhemmin.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className={className}>
			<CardHeader className="text-center">
				<CardTitle className="flex items-center justify-center gap-2">
					<MessageSquare className="h-5 w-5" />
					Ota yhteyttä
				</CardTitle>
				<CardDescription>
					Lähetä meille viesti, niin vastaamme sinulle mahdollisimman pian.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-6">
					<FormFieldGroup>
						<SplitFormFields>
							<EnhancedFormField
								type="text"
								name="firstName"
								label="Etunimi"
								placeholder="Syötä etunimesi"
								value={formData.firstName}
								onChange={handleChange}
								icon={<User className="h-4 w-4" />}
								error={errors.firstName}
								disabled={isSubmitting}
								aria-label="Etunimi"
							/>
							<EnhancedFormField
								type="text"
								name="lastName"
								label="Sukunimi"
								placeholder="Syötä sukunimesi"
								value={formData.lastName}
								onChange={handleChange}
								disabled={isSubmitting}
								aria-label="Sukunimi"
							/>
						</SplitFormFields>
					</FormFieldGroup>

					<FormFieldGroup>
						<EnhancedFormField
							type="email"
							name="email"
							label="Sähköposti"
							placeholder="nimi@esimerkki.fi"
							value={formData.email}
							onChange={handleChange}
							icon={<Mail className="h-4 w-4" />}
							error={errors.email}
							disabled={isSubmitting}
							required
							aria-label="Sähköpostiosoite"
						/>
					</FormFieldGroup>

					<FormFieldGroup>
						<EnhancedFormField
							type="tel"
							name="phone"
							label="Puhelinnumero (valinnainen)"
							placeholder="+358 40 123 4567"
							value={formData.phone}
							onChange={handleChange}
							disabled={isSubmitting}
							aria-label="Puhelinnumero"
						/>
					</FormFieldGroup>

					<FormFieldGroup>
						<EnhancedFormField
							type="text"
							name="subject"
							label="Aihe (valinnainen)"
							placeholder="Mistä haluat keskustella?"
							value={formData.subject}
							onChange={handleChange}
							disabled={isSubmitting}
							aria-label="Viestin aihe"
						/>
					</FormFieldGroup>

					<FormFieldGroup>
						<div className="space-y-2">
							<label htmlFor="message" className="text-sm font-medium">
								Viesti
							</label>
							<Textarea
								id="message"
								name="message"
								placeholder="Kerro meille, miten voimme auttaa sinua..."
								value={formData.message}
								onChange={handleChange}
								disabled={isSubmitting}
								className={`min-h-[120px] resize-none ${
									errors.message ? "border-destructive" : ""
								}`}
								required
								aria-label="Viestisi"
							/>
							{errors.message && (
								<p className="text-sm text-destructive" role="alert">
									{errors.message}
								</p>
							)}
						</div>
					</FormFieldGroup>
				</CardContent>

				<CardFooter>
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting}
						aria-label="Lähetä viesti"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Lähetetään...
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Lähetä viesti
							</>
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};

export default ContactFormEnhanced;
