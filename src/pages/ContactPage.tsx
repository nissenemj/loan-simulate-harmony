
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Check } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: values.name,
            email: values.email,
            message: values.message,
          }
        ]);
      
      if (error) {
        toast.error(t('common.error') || 'An error occurred while submitting the form');
        console.error('Error submitting contact form:', error);
      } else {
        toast.success(t('contact.submitSuccess') || 'Your message has been sent!');
        form.reset();
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error(t('common.error') || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.pageTitle') || 'Contact Us'} | Velkavapaus</title>
        <meta name="description" content={t('contact.metaDescription') || 'Contact the Velkavapaus team for assistance with debt-related questions or technical support.'} />
      </Helmet>
      
      <div className="container max-w-4xl py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold text-center mb-8">{t('contact.title') || 'Contact Us'}</h1>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.infoTitle') || 'Get in Touch'}</CardTitle>
                <CardDescription>
                  {t('contact.infoDesc') || 'We\'re here to help with any questions you may have.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{t('contact.emailTitle') || 'Email'}</h3>
                  <p className="text-muted-foreground">info@velkavapaus.fi</p>
                </div>
                
                <div>
                  <h3 className="font-medium">{t('contact.hoursTitle') || 'Customer Service Hours'}</h3>
                  <p className="text-muted-foreground">{t('contact.hours') || 'Mon - Fri: 9:00 - 16:00'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">{t('contact.responseTitle') || 'Response Time'}</h3>
                  <p className="text-muted-foreground">
                    {t('contact.responseText') || 'We aim to respond to all inquiries within 1-2 business days.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.formTitle') || 'Send us a message'}</CardTitle>
                <CardDescription>
                  {t('contact.formDesc') || 'Fill out the form below and we\'ll get back to you as soon as possible.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t('contact.thankYou') || 'Thank you!'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t('contact.successMessage') || 'Your message has been received. We\'ll get back to you shortly.'}
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                    >
                      {t('contact.sendAnother') || 'Send another message'}
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('common.name') || 'Name'}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact.namePlaceholder') || 'Your name'} {...field} />
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
                            <FormLabel>{t('common.email') || 'Email'}</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder={t('contact.emailPlaceholder') || 'your.email@example.com'} 
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
                            <FormLabel>{t('contact.message') || 'Message'}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t('contact.messagePlaceholder') || 'How can we help you?'} 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></div>
                            {t('common.submitting') || 'Submitting...'}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t('contact.submit') || 'Send Message'}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
