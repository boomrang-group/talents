
'use client';

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentDeclineContent() {
  const searchParams = useSearchParams();
  const userProfileId = searchParams.get('ref');

  return (
    <div className="space-y-6 text-center">
      <XCircle className="mx-auto h-16 w-16 text-destructive" />
 <p className="text-muted-foreground">
 Votre paiement pour l'inscription à Talents Bantudemy n'a pas abouti.
 </p>
 {userProfileId && (
        <p className="text-xs text-muted-foreground">
          Référence de transaction concernée : {userProfileId}
        </p>
      )}
      <p className="text-muted-foreground">
        Veuillez vérifier les informations de paiement ou essayer une autre méthode. Si le problème persiste, contactez le support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/auth/signup" className="w-full">
          <Button variant="outline" className="w-full">
            Retourner à l'inscription
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Aller à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
