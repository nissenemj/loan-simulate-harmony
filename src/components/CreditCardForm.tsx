
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { CreditCard } from "@/utils/creditCardCalculations";
import { CreditCard as CreditCardIcon, DollarSign, Percent } from "lucide-react";

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
  
  // Define the validation schema
  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Kortin nimi on pakollinen",
    }),
    balance: z.coerce.number().positive({
      message: "Virheellinen summa",
    }),
    limit: z.coerce.number().positive({
      message: "Virheellinen summa",
    }),
    apr: z.coerce.number().positive({
      message: "Virheellinen korko",
    }),
    minPayment: z.coerce.number().min(0, {
      message: "Virheellinen summa",
    }),
    minPaymentPercent: z.coerce.number().min(0, {
      message: "Virheellinen korko",
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

  // Watch for balance and minPaymentPercent changes to calculate minPayment
  const balance = form.watch("balance");
  const minPaymentPercent = form.watch("minPaymentPercent");
  const fullPaymentValue = form.watch("fullPayment");

  // Update minPayment whenever balance or minPaymentPercent changes
  useEffect(() => {
    if (balance && minPaymentPercent && !fullPaymentValue) {
      const calculatedMinPayment = (balance * minPaymentPercent / 100).toFixed(2);
      form.setValue("minPayment", parseFloat(calculatedMinPayment));
    }
  }, [balance, minPaymentPercent, fullPaymentValue, form]);

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
    toast("Luottokortti lisätty");
    
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

  return (
    <Card className="bg-card dark:bg-secondary dark:border-bg-highlight">
      <CardHeader>
        <CardTitle className="text-xl text-left">Lisää luottokortti</CardTitle>
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
                    <FormLabel>Kortin nimi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <CreditCardIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder="Esim. Nordea Mastercard" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight" 
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
                    <FormLabel>Saldo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="5000" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight" 
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
                    <FormLabel>Luottoraja</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight" 
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
                    <FormLabel>Vuosikorko (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Percent className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="18.0" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight"
                          step="0.01" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Payment Percent */}
              <FormField
                control={form.control}
                name="minPaymentPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vähimmäismaksu (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Percent className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="3.0" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight" 
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

              {/* Min Payment (€) - Now read-only based on percentage */}
              <FormField
                control={form.control}
                name="minPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vähimmäismaksu (€)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="150" 
                          className="pl-10 dark:bg-bg-elevated dark:border-bg-highlight bg-gray-50" 
                          step="0.01"
                          disabled={true}
                          readOnly
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lasketaan automaattisesti prosenttiosuuden perusteella
                    </p>
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
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 dark:border-bg-highlight dark:bg-bg-elevated">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="dark:border-brand-primary-light dark:data-[state=checked]:bg-brand-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Maksa koko saldo kerralla
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary-light text-white dark:bg-brand-primary dark:hover:bg-brand-primary-light"
            >
              Lisää luottokortti
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
