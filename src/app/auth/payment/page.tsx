
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Users, AlertTriangle, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [pricePerMember, setPricePerMember] = useState<number>(2); // Default to local price, $2
  const [userCountry, setUserCountry] = useState<string | null>(null);
  
  const userProfileId = searchParams.get('userProfileId');
  const userEmail = searchParams.get('email') || '';
  const userPhone = searchParams.get('phone') || '';
  const membersCount = parseInt(searchParams.get('members') || '1', 10);
  
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if(typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Switched to a different geolocation API for better reliability
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.country_code) {
          setUserCountry(data.country_name);
          if (data.country_code !== 'CD') { // Check for Congo DRC
            setPricePerMember(10); // $10 for international users
          }
          // If country_code is 'CD', price remains the default $2
        } else {
          // Handle cases where the API response is not in the expected format
          throw new Error('Unexpected API response format');
        }
      } catch (error) {
        console.error("Failed to fetch location, defaulting to local price:", error);
        // On error, the price remains the default $2 to not block users, which is the desired fallback.
      } finally {
        setIsLocationLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handlePayment = () => {
    setIsLoading(true);
  };

  if (!origin || isLocationLoading) {
    return (
      <div className="space-y-4 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
        <p className="text-muted-foreground">Détermination des frais de participation...</p>
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full mx-auto" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!userProfileId) {
     return (
        <div className="space-y-4 text-center text-destructive">
            <AlertTriangle className="h-12 w-12 mx-auto" />
            <h3 className="text-lg font-semibold">Erreur Critique</h3>
            <p className="text-sm">L'identifiant de profil utilisateur est manquant. Impossible de continuer le processus de paiement.</p>
             <p className="text-xs text-muted-foreground">Veuillez retourner à la page d'inscription et réessayer.</p>
        </div>
     );
  }

  const amountInCents = pricePerMember * membersCount * 100;
  const amountInUSD = pricePerMember * membersCount;
  
  const successUrl = `${origin}/auth/payment-success?amount=${amountInCents}&ref=${userProfileId}`;
  const cancelUrl = `${origin}/auth/payment-cancel?ref=${userProfileId}`;
  const declineUrl = `${origin}/auth/payment-decline?ref=${userProfileId}`;
  const notifyUrl = `${origin}/api/maxicash-notify`;
  
  return (
    <div className="space-y-6 text-center">
       {membersCount > 1 && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-secondary/30 p-3 rounded-md">
            <Users className="h-5 w-5" />
            <p>Inscription de groupe pour <strong>{membersCount} membres</strong>.</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
        <Globe className="h-5 w-5" />
        <p>Pays détecté : <strong>{userCountry || 'Inconnu'}</strong>. Frais : <strong>${pricePerMember}/participant</strong>.</p>
      </div>

      <p className="text-muted-foreground">
        Pour finaliser votre inscription, veuillez procéder au paiement sécurisé des frais de participation de <strong>${amountInUSD}</strong> ({membersCount > 1 ? `$${pricePerMember} x ${membersCount} membres` : `$${pricePerMember}`}).
      </p>

      <form 
        action="https://api.maxicashapp.com/PayEntryPost" 
        method="POST" 
        onSubmit={handlePayment}
      >
        <input type="hidden" name="PayType" value="MaxiCash" />
        <input type="hidden" name="Amount" value={amountInCents} />
        <input type="hidden" name="Currency" value="USD" />
        <input type="hidden" name="Telephone" value={userPhone} />
        <input type="hidden" name="Email" value={userEmail} />
        <input type="hidden" name="MerchantID" value="93b10243a03e4536832aa5c9473fd0ae" />
        <input type="hidden" name="MerchantPassword" value="fdf00a6ff0c94b048aa3162677b8a0ef" />
        <input type="hidden" name="Language" value="En" />
        <input type="hidden" name="Reference" value={userProfileId} />
        <input type="hidden" name="accepturl" value={successUrl} />
        <input type="hidden" name="cancelurl" value={cancelUrl} />
        <input type="hidden" name="declineurl" value={declineUrl} />
        <input type="hidden" name="notifyurl" value={notifyUrl} />
     
        <Button 
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Veuillez patienter...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Payer ${amountInUSD} Maintenant
            </>
          )}
        </Button>
      </form>
    </div>
  );
}


function PaymentPageSkeleton() {
  return (
    <div className="space-y-6 text-center">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}


export default function PaymentPage() {
    return (
        <AuthLayout
            title="Finaliser votre Inscription"
            description="Une dernière étape pour rejoindre l'aventure Talents Bantudemy."
        >
            <Suspense fallback={<PaymentPageSkeleton />}>
              <PaymentPageContent />
            </Suspense>
        </AuthLayout>
    );
}
