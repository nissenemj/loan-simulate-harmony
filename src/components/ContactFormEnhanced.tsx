import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedFormField } from "@/components/ui/enhanced-form-field";
import { combineValidators, createRequiredValidator, createEmailValidator, createMinLengthValidator, useValidationMessages } from "@/utils/formValidation";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactFormEnhancedProps {
  className?: string;
}

const ContactFormEnhanced: React.FC<ContactFormEnhancedProps> = ({ className }) => {
  const { t } = useLanguage();
  const validationMessages = useValidationMessages();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Validation functions
  const nameValidator = combineValidators(
    createRequiredValidator(validationMessages.required),
    createMinLengthValidator(2, validationMessages.minLength(2))
  );
  
  const emailValidator = combineValidators(
    createRequiredValidator(validationMessages.required),
    createEmailValidator(validationMessages.email)
  );
  
  const messageValidator = combineValidators(
    createRequiredValidator(validationMessages.required),
    createMinLengthValidator(10, validationMessages.minLength(10))
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    const nameResult = nameValidator(formData.name);
    if (!nameResult.isValid) {
      newErrors.name = nameResult.message || validationMessages.required;
    }
    
    // Validate email
    const emailResult = emailValidator(formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.message || validationMessages.email;
    }
    
    // Validate message
    const messageResult = messageValidator(formData.message);
    if (!messageResult.isValid) {
      newErrors.message = messageResult.message || validationMessages.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t("contact.form.validationError") || "Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t("contact.form.success") || "Your message has been sent successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("contact.form.error") || "There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("contact.form.title") || "Contact Us"}</CardTitle>
        <CardDescription>
          {t("contact.form.description") || "Fill out the form below to send us a message."}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <EnhancedFormField
            id="contact-name"
            name="name"
            label={t("contact.form.name") || "Name"}
            placeholder={t("contact.form.namePlaceholder") || "Your name"}
            value={formData.name}
            onChange={handleChange}
            validation={nameValidator}
            required
            errorMessage={errors.name}
          />
          
          <EnhancedFormField
            id="contact-email"
            name="email"
            type="email"
            label={t("contact.form.email") || "Email"}
            placeholder={t("contact.form.emailPlaceholder") || "your.email@example.com"}
            value={formData.email}
            onChange={handleChange}
            validation={emailValidator}
            required
            errorMessage={errors.email}
            helpText={t("contact.form.emailHelp") || "We'll never share your email with anyone else."}
          />
          
          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-sm font-medium">
              {t("contact.form.message") || "Message"}
              <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder={t("contact.form.messagePlaceholder") || "Your message..."}
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
              rows={5}
              required
            />
            {errors.message && (
              <p className="text-sm font-medium text-destructive">{errors.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("contact.form.sending") || "Sending..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("contact.form.submit") || "Send Message"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContactFormEnhanced;
