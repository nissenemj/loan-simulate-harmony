
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Send } from "lucide-react";
import { ValidatedInput } from "@/components/ui/validated-input";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup = ({ className }: NewsletterSignupProps) => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return { 
      isValid, 
      message: isValid ? undefined : (language === 'fi' ? 'Virheellinen sähköpostiosoite' : 'Invalid email address') 
    };
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // First try to use the newsletter-signup edge function
      try {
        const response = await fetch('https://jwzzkqelqsqsirfowevs.supabase.co/functions/v1/newsletter-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3enprcWVscXNxc2lyZm93ZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTE2OTMsImV4cCI6MjA1Nzk2NzY5M30.o7TJCcPktro0nhTCNdVnT3mTno2uqfE1Zy31giCb9TE`
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name || null
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || t('newsletter.subscribeError'));
        }
        
        toast.success(t("newsletter.subscribeSuccess"));
        form.reset();
        return;
      } catch (edgeFunctionError) {
        console.error("Edge function error:", edgeFunctionError);
        // Fall back to direct database query if edge function fails
      }

      // Fallback: Direct SQL query if edge function fails
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: data.email, name: data.name || null }]);

      if (error) {
        if (error.code === "23505") { // Unique violation code
          toast.error(t("newsletter.alreadySubscribed"));
        } else {
          toast.error(t("newsletter.subscribeError"));
          console.error("Newsletter subscription error:", error);
        }
      } else {
        toast.success(t("newsletter.subscribeSuccess"));
        form.reset();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 bg-accent/20 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-xl font-bold mb-2">
        {t("newsletter.title")}
      </h3>
      <p className="text-muted-foreground mb-4">
        {t("newsletter.description")}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.email")}</FormLabel>
                <FormControl>
                  <ValidatedInput
                    type="email"
                    placeholder={t("newsletter.emailPlaceholder")}
                    label={t("common.email")}
                    validation={validateEmail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.name")} ({t("common.optional")})</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("newsletter.namePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting 
              ? t("common.submitting")
              : t("newsletter.subscribe")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsletterSignup;
