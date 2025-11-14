"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";

const partnershipFormSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise est requis."),
  contactPerson: z.string().min(2, "Le nom du contact est requis."),
  email: z.string().email("Adresse e-mail invalide."),
  phone: z.string().optional(),
  proposal: z.string().min(20, "Veuillez détailler votre proposition (min 20 caractères).").max(1000, "La proposition ne peut excéder 1000 caractères."),
});

export default function PartnershipContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof partnershipFormSchema>>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      proposal: "",
    },
  });

  function onSubmit(values: z.infer<typeof partnershipFormSchema>) {
    console.log(values);
    // Simulate API call
    toast({
      title: "Proposition Envoyée !",
      description: "Merci pour votre intérêt. Nous vous contacterons bientôt.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise/organisation</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tech Solutions SARL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personne de contact</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Mme. Diallo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Ex: contact@techsolutions.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone (Optionnel)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Ex: +243 812 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="proposal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre proposition de partenariat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez comment vous souhaitez collaborer avec Talents Bantudemy..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Max 1000 caractères.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Envoyer la Proposition
        </Button>
      </form>
    </Form>
  );
}
