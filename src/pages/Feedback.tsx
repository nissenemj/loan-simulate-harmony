import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BreadcrumbNav from "@/components/BreadcrumbNav";

// Palautelomakkeen validointikaavio
const feedbackFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nimi on pakollinen ja vähintään 2 merkkiä pitkä.",
  }),
  email: z.string().email({
    message: "Syötä kelvollinen sähköpostiosoite.",
  }),
  subject: z.string().min(2, {
    message: "Aihe on pakollinen.",
  }),
  category: z.string({
    required_error: "Valitse palautteen kategoria.",
  }),
  message: z.string().min(10, {
    message: "Viesti on pakollinen ja vähintään 10 merkkiä pitkä.",
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const Feedback = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lomakkeen oletusarvot
  const defaultValues: Partial<FeedbackFormValues> = {
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    category: "",
    message: "",
  };

  // Lomakkeen määrittely
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues,
  });

  // Lomakkeen lähetys
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Tässä olisi normaalisti API-kutsu palautteen lähettämiseksi
      console.log("Lähetetään palaute:", data);
      
      // Simuloidaan API-kutsua
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Onnistunut lähetys
      setIsSuccess(true);
      toast.success("Palaute lähetetty onnistuneesti! Kiitos palautteestasi.");
      form.reset();
    } catch (error) {
      console.error("Virhe palautteen lähettämisessä:", error);
      toast.error("Palautteen lähettäminen epäonnistui. Yritä uudelleen myöhemmin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Helmet>
        <title>{t("feedback.pageTitle")} | {t("app.title")}</title>
      </Helmet>

      <div className="space-y-6">
        <BreadcrumbNav />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t("feedback.pageTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("feedback.pageDescription")}
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">{t("feedback.thankYou")}</h2>
            <p className="mb-4">{t("feedback.successMessage")}</p>
            <Button onClick={() => setIsSuccess(false)}>
              {t("feedback.sendAnother")}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.form.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("feedback.form.namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.form.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("feedback.form.emailPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.form.subject")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("feedback.form.subjectPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.form.category")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("feedback.form.categoryPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">{t("feedback.categories.general")}</SelectItem>
                          <SelectItem value="bug">{t("feedback.categories.bug")}</SelectItem>
                          <SelectItem value="feature">{t("feedback.categories.feature")}</SelectItem>
                          <SelectItem value="question">{t("feedback.categories.question")}</SelectItem>
                          <SelectItem value="other">{t("feedback.categories.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("feedback.form.message")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("feedback.form.messagePlaceholder")} 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("feedback.form.messageDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">{t("feedback.form.sending")}</span>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  t("feedback.form.submit")
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
