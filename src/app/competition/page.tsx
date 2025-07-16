'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveBattlePlayer from "@/components/competition/live-battle-player";
import VotingArea from "@/components/competition/voting-area";
import { 
  Trophy, 
  PlayCircle, 
  CheckSquare, 
  ArrowLeft, 
  Music,
  ArrowRight,
  LogIn,
  Eye,
  Users,
  Info
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LiveBattle {
  id: number;
  title: string;
  time: string;
  playerA: string;
  playerB: string;
  image: string;
  dataAiHint: string;
  description?: string;
}

const liveBattles: LiveBattle[] = [];

const competitionCategories = [
  { id: "esthetique_mode", name: "Esthétique et Mode", imageUrl: "/icons/categories/esthe.jpg", dataAiHint: "fashion runway" },
  { id: "peinture", name: "Peinture", imageUrl: "/icons/categories/peinture.jpg", dataAiHint: "artist painting" },
  { id: "cuisine", name: "Cuisine", imageUrl: "/icons/categories/cuisine.jpg", dataAiHint: "gourmet food" },
  { id: "poesie", name: "Poésie", imageUrl: "/icons/categories/poesie.jpg", dataAiHint: "poetry book" },
  { id: "art_oratoire", name: "Art Oratoire", imageUrl: "/icons/categories/oratoire.jpg", dataAiHint: "public speaking" },
  { id: "theatre", name: "Théâtre", imageUrl: "/icons/categories/theatre.jpg", dataAiHint: "theater stage" },
  { id: "musique", name: "Musique", imageUrl: "/icons/categories/bantu-music.jpg", dataAiHint: "music notes" },
  { id: "danse", name: "Danse", imageUrl: "/icons/categories/danse.jpg", dataAiHint: "dance silhouette" },
];


export default function CompetitionPage() {
  const [selectedBattle, setSelectedBattle] = useState<LiveBattle | null>(null);

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

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="challenges"><CheckSquare className="mr-2 h-4 w-4"/>Catégories & Soumissions</TabsTrigger>
          <TabsTrigger value="live-battles" onClick={() => setSelectedBattle(null)}><PlayCircle className="mr-2 h-4 w-4"/>Battles en Direct</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
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
        </TabsContent>

        <TabsContent value="live-battles">
          {selectedBattle ? (
            <Card className="shadow-xl mb-8">
              <CardHeader>
                <Button variant="outline" onClick={() => setSelectedBattle(null)} className="mb-4 self-start">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des battles
                </Button>
                <CardTitle className="font-headline text-2xl">{selectedBattle.title}</CardTitle>
                <CardDescription>{selectedBattle.time} - {selectedBattle.playerA} vs {selectedBattle.playerB}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <LiveBattlePlayer videoSrc={selectedBattle.image} videoTitle={selectedBattle.title} dataAiHint={selectedBattle.dataAiHint} />
                <VotingArea battleId={selectedBattle.id} />
              </CardContent>
            </Card>
          ) : (
            liveBattles.length > 0 ? (
              <div className="space-y-6">
                 <h2 className="text-2xl font-semibold text-center font-headline mb-6">Choisissez une Battle en Direct</h2>
                {liveBattles.map(battle => (
                  <Card key={battle.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative h-48 md:h-full w-full md:col-span-1 rounded-l-md overflow-hidden">
                             <Image src={battle.image} alt={battle.title} fill className="object-cover" data-ai-hint={battle.dataAiHint} />
                        </div>
                        <div className="md:col-span-2 p-6 flex flex-col justify-between">
                            <div>
                                <CardTitle className="font-headline text-xl mb-1">{battle.title}</CardTitle>
                                <CardDescription className="text-sm mb-1">{battle.time}</CardDescription>
                                <CardDescription className="text-sm font-medium mb-2">{battle.playerA} vs {battle.playerB}</CardDescription>
                                <p className="text-xs text-muted-foreground mb-3">{battle.description}</p>
                            </div>
                            <Button onClick={() => setSelectedBattle(battle)} className="w-full md:w-auto self-end bg-primary text-primary-foreground hover:bg-primary/90">
                                <PlayCircle className="mr-2 h-4 w-4" /> Regarder et Voter
                            </Button>
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
            <div className="text-center py-12">
              <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune battle en direct pour le moment.</h3>
              <p className="text-muted-foreground">Revenez bientôt pour assister aux prochains duels !</p>
            </div>
            )
          )}
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
