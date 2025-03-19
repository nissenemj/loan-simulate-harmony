
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { CreditCard } from "@/utils/creditCardCalculations";
import { CreditCard as CreditCardIcon, DollarSign, Percent } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditCardFormProps {
  onAddCreditCard: (card: CreditCard) => void;
}

export default function CreditCardForm({ onAddCreditCard }: CreditCardFormProps) {
  const { t } = useLanguage();
  
  // Define the validation schema
  const formSchema = z.object({
    name: z.string().min(1, {
      message: t("validation.nameRequired"),
    }),
    balance: z.coerce.number().positive({
      message: t("validation.invalidAmount"),
    }),
    limit: z.coerce.number().positive({
      message: t("validation.invalidAmount"),
    }),
    apr: z.coerce.number().positive({
      message: t("validation.invalidRate"),
    }),
    minPayment: z.coerce.number().min(0, {
      message: t("validation.invalidAmount"),
    }),
    minPaymentPercent: z.coerce.number().min(0, {
      message: t("validation.invalidRate"),
    }),
    fullPayment: z.boolean().default(false),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: undefined,
      limit: undefined,
      apr: undefined,
      minPayment: undefined,
      minPaymentPercent: 3, // Default to 3%
      fullPayment: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    const newCreditCard: CreditCard = {
      id: uuidv4(),
      name: values.name,
      balance: values.balance,
      limit: values.limit,
      apr: values.apr,
      minPayment: values.minPayment || 0,
      minPaymentPercent: values.minPaymentPercent || 0,
      fullPayment: values.fullPayment,
      isActive: true,
    };

    onAddCreditCard(newCreditCard);
    
    // Fix toast error: update to use a single parameter with formatted string
    toast(t("toast.loanAdded") + ": " + values.name);
    
    // Reset the form
    form.reset({
      name: "",
      balance: undefined,
      limit: undefined,
      apr: undefined,
      minPayment: undefined,
      minPaymentPercent: 3,
      fullPayment: false,
    });
  };

  const fullPaymentValue = form.watch("fullPayment");

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-left">{t("creditCard.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.name")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <CreditCardIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder={t("creditCard.form.placeholderName")} 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Balance */}
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.balance")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder={t("creditCard.form.placeholderBalance")} 
                          className="pl-10" 
                          step="0.01"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Credit Limit */}
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.limit")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder={t("creditCard.form.placeholderCreditLimit")} 
                          className="pl-10" 
                          step="0.01"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* APR */}
              <FormField
                control={form.control}
                name="apr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.apr")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Percent className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder={t("creditCard.form.placeholderApr")} 
                          className="pl-10"
                          step="0.01" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Payment (€) */}
              <FormField
                control={form.control}
                name="minPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.minPayment")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder={t("creditCard.form.placeholderMinPayment")} 
                          className="pl-10" 
                          step="0.01"
                          disabled={fullPaymentValue}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Payment (%) */}
              <FormField
                control={form.control}
                name="minPaymentPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("creditCard.form.minPaymentPercent")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Percent className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder={t("creditCard.form.minPaymentPercent")} 
                          className="pl-10" 
                          step="0.01"
                          disabled={fullPaymentValue}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full Payment Option */}
            <FormField
              control={form.control}
              name="fullPayment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {t("creditCard.form.fullPayment")}
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">{t("creditCard.form.submit")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
