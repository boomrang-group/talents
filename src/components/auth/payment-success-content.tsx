
'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getFirebaseServices } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Vérification du paiement, veuillez patienter...");
  const [errorOccurred, setErrorOccurred] = useState(false);
  
  const userProfileId = searchParams.get('ref');
  const amountInCents = parseInt(searchParams.get('amount') || '200', 10);
  const amountInUSD = amountInCents / 100;

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (!userProfileId) {
        setStatusMessage("Impossible de vérifier la transaction. Référence de paiement manquante.");
        setErrorOccurred(true);
        setIsProcessing(false);
        return;
    }

    // Immediately try to confirm payment
    fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfileId }),
    }).catch(err => console.error("Could not optimistically update payment status:", err));


    const { firestore } = getFirebaseServices();
    if (!firestore) {
        setStatusMessage("Erreur de configuration du serveur. Veuillez contacter le support.");
        setErrorOccurred(true);
        setIsProcessing(false);
        return;
    }

    const userDocRef = doc(firestore, 'users', userProfileId);
    
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (hasProcessed.current) {
            unsubscribe();
            return;
        }

        if (docSnap.exists()) {
            const userData = docSnap.data();
            
            if (userData.paymentStatus === 'completed') {
                unsubscribe();
                hasProcessed.current = true;
                setStatusMessage("Paiement confirmé ! Votre inscription est maintenant complète.");
                 toast({
                    title: "Paiement Réussi!",
                    description: "Bienvenue ! Votre compte est maintenant pleinement actif.",
                });
                setIsProcessing(false);
            } else if (userData.paymentStatus === 'failed') {
                unsubscribe();
                hasProcessed.current = true;
                setStatusMessage("Votre paiement a échoué. Veuillez réessayer depuis la page d'inscription.");
                setErrorOccurred(true);
                setIsProcessing(false);
            }
        }
    }, (error) => {
        console.error("Firestore listener error:", error);
        unsubscribe();
        setStatusMessage("Erreur lors de la vérification du paiement. Veuillez contacter le support.");
        setErrorOccurred(true);
        setIsProcessing(false);
    });

    const timeoutId = setTimeout(() => {
        if (!hasProcessed.current) {
            unsubscribe();
            setStatusMessage("La vérification du paiement a pris trop de temps. Si vous avez été débité, veuillez contacter le support. Votre statut sera mis à jour automatiquement.");
            setErrorOccurred(true);
            setIsProcessing(false);
        }
    }, 45000); // 45-second timeout

    return () => {
        clearTimeout(timeoutId);
        unsubscribe();
    };
  }, [userProfileId, router, toast]);

  if (isProcessing) {
    return (
      <div className="space-y-6 text-center">
        <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
        <p className="text-muted-foreground">{statusMessage}</p>
      </div>
    );
  }

  if (errorOccurred) {
    return (
      <div className="space-y-6 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        <p className="text-destructive font-semibold">Une erreur est survenue</p>
        <p className="text-muted-foreground">{statusMessage}</p>
        {userProfileId && <p className="text-xs text-muted-foreground">Référence de transaction : {userProfileId}</p>}
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            Retour à l'Accueil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <p className="text-muted-foreground">
        {statusMessage} Votre paiement de <strong>${amountInUSD}</strong> a bien été reçu.
      </p>
      {userProfileId && (
        <p className="text-xs text-muted-foreground">
          Référence de transaction : {userProfileId}
        </p>
      )}
      <div className="p-4 bg-secondary/50 rounded-md">
        <p className="text-foreground font-semibold">
          La compétition officielle démarrera le 4 Août.
        </p>
        <p className="text-muted-foreground mt-1">
         Vous pouvez maintenant soumettre vos projets depuis votre tableau de bord.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link href="/dashboard" className="w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <ExternalLink className="mr-2 h-4 w-4" />
            Aller au Tableau de Bord
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            Retour à l'Accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
