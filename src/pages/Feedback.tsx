
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { useLanguage } from '@/contexts/LanguageContext';
import { ValidatedInput } from '@/components/ui/validated-input';

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Virheellinen sähköpostiosoite'),
  message: z.string().min(10, 'Viestin tulee olla vähintään 10 merkkiä pitkä')
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      // Insert feedback to Supabase
      const { error: feedbackError } = await supabase
        .from('feedback')
        .insert({ 
          name: data.name, 
          email: data.email, 
          message: data.message 
        });

      if (feedbackError) throw feedbackError;

      // Send email via edge function
      const response = await fetch('https://jwzzkqelqsqsirfowevs.supabase.co/functions/v1/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3enprcWVscXNxc2lyZm93ZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTE2OTMsImV4cCI6MjA1Nzk2NzY5M30.o7TJCcPktro0nhTCNdVnT3mTno2uqfE1Zy31giCb9TE`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Sähköpostin lähettäminen epäonnistui');
      }

      toast({
        title: t('feedback.successTitle'),
        description: t('feedback.successMessage')
      });

      form.reset();
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: t('feedback.errorTitle'),
        description: t('feedback.errorMessage'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return { 
      isValid, 
      message: isValid ? undefined : (language === 'fi' ? 'Virheellinen sähköpostiosoite' : 'Invalid email address') 
    };
  };

  return (
    <div className="h-auto min-h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased py-10">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold mb-6">
          {t('feedback.title')}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto my-6 text-sm md:text-base text-center relative z-10">
          {t('feedback.description')}
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')} ({t('common.optional')})</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('feedback.namePlaceholder')} 
                      className="h-12"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.email')}</FormLabel>
                  <FormControl>
                    <ValidatedInput
                      type="email" 
                      placeholder={t('feedback.emailPlaceholder')} 
                      label={t('common.email')}
                      validation={validateEmail}
                      className="h-12"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('feedback.message')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('feedback.messagePlaceholder')} 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') : t('feedback.submit')}
            </Button>
          </form>
        </Form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default FeedbackPage;
