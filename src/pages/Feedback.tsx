
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

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Virheellinen sähköpostiosoite'),
  message: z.string().min(10, 'Viestin tulee olla vähintään 10 merkkiä pitkä')
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackPage: React.FC = () => {
  const { t } = useLanguage();
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
      const response = await fetch('/functions/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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

  return (
    <div className="h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
          {t('feedback.title')}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          {t('feedback.description')}
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')} ({t('common.optional')})</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('feedback.namePlaceholder')} 
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
                    <Input 
                      type="email" 
                      placeholder={t('feedback.emailPlaceholder')} 
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
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
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
