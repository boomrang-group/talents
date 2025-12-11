
'use client';

import AuthLayout from '@/components/auth/auth-layout';
import { Suspense, useState, useEffect } from 'react'; 
import PaymentSuccessContent from '@/components/auth/payment-success-content';
import { Skeleton } from '@/components/ui/skeleton'; 

export default function PaymentSuccessPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
      <AuthLayout
        title="Inscription Réussie et Paiement Confirmé !"
        description="Bienvenue à Talents Bantudemy !"
      >
        {isClient ? (
          <Suspense fallback={<PaymentSuccessPageSkeleton />}>
            <PaymentSuccessContent />
          </Suspense>
        ) : (
          <PaymentSuccessPageSkeleton /> 
        )}
      </AuthLayout>
  );
}

function PaymentSuccessPageSkeleton() {
  return (
    <div className="space-y-6 text-center">
      <Skeleton className="mx-auto h-16 w-16 rounded-full bg-muted" />
      <Skeleton className="h-6 w-3/4 mx-auto bg-muted" />
      <Skeleton className="h-4 w-1/2 mx-auto bg-muted" />
      <div className="p-4 bg-secondary/30 rounded-md space-y-2">
        <Skeleton className="h-5 w-full bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-2/3 mx-auto bg-muted" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Skeleton className="h-10 w-full bg-muted rounded-md" />
        <Skeleton className="h-10 w-full bg-muted rounded-md" />
      </div>
    </div>
  );
}
