'use client';

import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
});


export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    if (!auth) {
      toast({
        title: "Configuration Firebase manquante",
        description: "La réinitialisation de mot de passe ne peut pas fonctionner. Veuillez configurer vos clés API Firebase.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "E-mail envoyé !",
        description: "Vérifiez votre boîte de réception pour le lien de réinitialisation du mot de passe.",
        variant: "default",
      });
      form.reset();
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'e-mail de réinitialisation. Veuillez vérifier l'adresse e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Mot de passe oublié ?"
      description="Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse e-mail
                </Label>
                <FormControl>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="nom@example.com"
                      {...field}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
           />

          <div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Se souvenir de votre mot de passe ?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}
