
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
	const { t } = useLanguage();

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
			toast.error("Korjaa lomakkeen virheet");
			return;
		}

		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast.success("Viestisi on lähetetty onnistuneesti!");

			// Reset form
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
			});
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Viestin lähettämisessä tapahtui virhe. Yritä uudelleen.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Ota yhteyttä</CardTitle>
				<CardDescription>
					Täytä alla oleva lomake lähettääksesi meille viestin.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-6">
					<FormFieldGroup
						title="Henkilötiedot"
						description="Kerro meille hieman itsestäsi"
					>
						<SplitFormFields
							columns={2}
							fields={[
								{
									id: "contact-first-name",
									name: "firstName",
									label: "Etunimi",
									placeholder: "Etunimi",
									value: formData.firstName,
									onChange: handleChange,
									validation: nameValidator,
									required: true,
								},
								{
									id: "contact-last-name",
									name: "lastName",
									label: "Sukunimi",
									placeholder: "Sukunimi",
									value: formData.lastName,
									onChange: handleChange,
								},
							]}
						/>

						<SplitFormFields
							columns={2}
							fields={[
								{
									id: "contact-email",
									name: "email",
									type: "email",
									label: "Sähköposti",
									placeholder: "sähköposti@esimerkki.fi",
									value: formData.email,
									onChange: handleChange,
									validation: emailValidator,
									required: true,
									helpText: "Emme jaa sähköpostiosoitettasi kenellekään.",
								},
								{
									id: "contact-phone",
									name: "phone",
									type: "tel",
									label: "Puhelin",
									placeholder: "+358 XX XXX XXXX",
									value: formData.phone,
									onChange: handleChange,
								},
							]}
						/>
					</FormFieldGroup>

					<FormFieldGroup
						title="Viestisi"
						description="Miten voimme auttaa sinua?"
					>
						<EnhancedFormField
							id="contact-subject"
							name="subject"
							label="Aihe"
							placeholder="Mistä asiasta on kyse?"
							value={formData.subject}
							onChange={handleChange}
						/>

						<div className="space-y-2">
							<label htmlFor="contact-message" className="text-sm font-medium">
								Viesti
								<span className="text-destructive">*</span>
							</label>
							<Textarea
								id="contact-message"
								name="message"
								placeholder="Viestisi..."
								value={formData.message}
								onChange={handleChange}
								className={
									errors.message
										? "border-destructive focus-visible:ring-destructive"
										: ""
								}
								rows={5}
								required
							/>
							{errors.message && (
								<p className="text-sm font-medium text-destructive">
									{errors.message}
								</p>
							)}
						</div>
					</FormFieldGroup>
				</CardContent>

				<CardFooter>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
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
