'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  CheckSquare, 
  LogIn,
  Eye,
  Info,
  Mic,
  Music,
  PersonStanding,
  Smile
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const competitionCategories = [
  { id: "danse", name: "Danse", imageUrl: "/icons/categories/danse.jpg", dataAiHint: "dance silhouette" },
  { id: "slam_poesie", name: "Slam/Poésie", imageUrl: "/icons/categories/poesie.jpg", dataAiHint: "poetry book" },
  { id: "musique", name: "Musique", imageUrl: "/icons/categories/bantu-music.jpg", dataAiHint: "music notes" },
  { id: "comedie", name: "Comédie", imageUrl: "/icons/categories/comedie.jpg", dataAiHint: "comedy mask" },
];


export default function CompetitionPage() {

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <Trophy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">La Compétition</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          La compétition débutera le 4 Août. Préparez-vous à participer !
        </p>
      </div>

      <Alert className="mb-8 border-primary/50 bg-primary/10 text-primary">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">La compétition n'a pas encore commencé !</AlertTitle>
          <AlertDescription>
            Le coup d'envoi sera donné le 4 Août. Revenez pour soumettre vos projets et assister aux battles.
          </AlertDescription>
      </Alert>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold font-headline">Choisissez une catégorie pour participer ou voter</h2>
        <p className="text-muted-foreground">Explorez les différentes catégories de la compétition.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {competitionCategories.map(category => (
          <Card key={category.id} className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col items-center text-center h-full group">
            <div className="relative w-full h-40 overflow-hidden rounded-t-md">
              <Image 
                src={category.imageUrl} 
                alt={category.name}
                fill
                className="object-contain"
                data-ai-hint={category.dataAiHint}
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Optional: Add a short description for each category if needed later */}
            </CardContent>
            <CardFooter className="w-full pt-3 flex flex-col gap-2">
              <Link href="/auth/login" passHref className="w-full">
                <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <LogIn className="mr-2 h-4 w-4" /> Soumettre
                </Button>
              </Link>
              <Link href={`/competition/${category.id}/vote-challenge`} passHref className="w-full">
                 <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                  <Eye className="mr-2 h-4 w-4" /> Voir & Voter
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
         {competitionCategories.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune catégorie pour le moment.</h3>
            <p className="text-muted-foreground">Revenez bientôt pour découvrir les catégories de compétition !</p>
          </div>
        )}
      </div>
    </div>
  );
}
