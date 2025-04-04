
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

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup = ({ className }: NewsletterSignupProps) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Direct SQL query for tables not in generated types
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: data.email, name: data.name || null }]);

      if (error) {
        if (error.code === "23505") { // Unique violation code
          toast.error(t("newsletter.alreadySubscribed") || "Olet jo tilannut uutiskirjeemme.");
        } else {
          toast.error(t("newsletter.subscribeError") || "Virhe uutiskirjeen tilaamisessa. Yritä uudelleen.");
          console.error("Newsletter subscription error:", error);
        }
      } else {
        toast.success(t("newsletter.subscribeSuccess") || "Kiitos tilauksestasi! Olet nyt uutiskirjeemme tilaaja.");
        form.reset();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(t("common.error") || "Virhe tapahtui. Yritä uudelleen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 bg-accent/20 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-xl font-bold mb-2">
        {t("newsletter.title") || "Tilaa uutiskirjeemme"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {t("newsletter.description") || "Saat säännöllisesti talousvinkkejä ja neuvoja velanhoitoon."}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.email") || "Sähköposti"}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("newsletter.emailPlaceholder") || "email@example.com"}
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
                <FormLabel>{t("common.name") || "Nimi"} ({t("common.optional") || "valinnainen"})</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("newsletter.namePlaceholder") || "Etunimi Sukunimi"}
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
              ? (t("common.submitting") || "Lähetetään...") 
              : (t("newsletter.subscribe") || "Tilaa uutiskirje")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsletterSignup;
