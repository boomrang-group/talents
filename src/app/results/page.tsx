import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResultsDisplay from "@/components/results/results-display";
import { Award, Info, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FirebaseProvider, initializeFirebase } from '@/firebase';
import { Suspense } from 'react';

function ResultsPageContent() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <Award className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Résultats de la Compétition</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Les résultats seront affichés ici après la fin des phases de compétition.
        </p>
      </div>

      <Alert className="mb-12 border-primary/50 bg-primary/10 text-primary">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">La compétition n'a pas encore commencé !</AlertTitle>
          <AlertDescription>
            Le coup d'envoi sera donné le 4 Août. Revenez après les phases de vote pour découvrir les gagnants !
          </AlertDescription>
      </Alert>
      
      <ResultsDisplay />

      <section className="mt-16 text-center border-t pt-10">
        <h2 className="text-3xl font-bold mb-4 font-headline">Découvrez les futurs gagnants !</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
         Les profils des lauréats seront mis en avant ici.
        </p>
        <Link href="/results/winners">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled>
            <Users className="mr-2 h-5 w-5" /> Voir les Profils des Gagnants (Bientôt disponible)
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default function ResultsPage() {
  const { firebaseApp, firestore, auth } = initializeFirebase();
  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      <Suspense>
        <ResultsPageContent />
      </Suspense>
    </FirebaseProvider>
  )
}
