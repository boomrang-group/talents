
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Eye, 
  Trophy, 
  Star, 
  Award,
  Feather,
  PersonStanding,
  Music,
  MessageSquare,
  Drama,
  ChefHat,
  Palette,
  Paintbrush,
  Loader2,
  Info
} from "lucide-react";
import Image from "next/image";
import { getFirebaseServices } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "esthetique_mode", name: "Esthétique et Mode", icon: <Palette className="mr-2 h-4 w-4"/> },
  { id: "peinture", name: "Peinture", icon: <Paintbrush className="mr-2 h-4 w-4"/> },
  { id: "cuisine", name: "Cuisine", icon: <ChefHat className="mr-2 h-4 w-4"/> },
  { id: "poesie", name: "Poésie", icon: <Feather className="mr-2 h-4 w-4"/> },
  { id: "art_oratoire", name: "Art Oratoire", icon: <MessageSquare className="mr-2 h-4 w-4"/> },
  { id: "theatre", name: "Théâtre", icon: <Drama className="mr-2 h-4 w-4"/> },
  { id: "musique", name: "Musique", icon: <Music className="mr-2 h-4 w-4"/> },
  { id: "danse", name: "Danse", icon: <PersonStanding className="mr-2 h-4 w-4"/> },
];

interface RankedSubmission extends DocumentData {
  rank: number;
}

export default function ResultsDisplay() {
  const [rankingsData, setRankingsData] = useState<{ [key: string]: RankedSubmission[] }>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAndProcessRankings = async () => {
      setLoading(true);
      const { firestore } = getFirebaseServices();
      if (!firestore) {
        toast({ title: "Erreur", description: "Firestore n'est pas disponible.", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        const submissionsCol = collection(firestore, "submissions");
        const q = query(submissionsCol, where("status", "==", "validated"), orderBy("votes", "desc"));
        const querySnapshot = await getDocs(q);

        const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const groupedByCategory: { [key: string]: DocumentData[] } = {};
        submissions.forEach(sub => {
          if (!groupedByCategory[sub.category]) {
            groupedByCategory[sub.category] = [];
          }
          groupedByCategory[sub.category].push(sub);
        });
        
        const finalRankings: { [key: string]: RankedSubmission[] } = {};
        for (const categoryId in groupedByCategory) {
          finalRankings[categoryId] = groupedByCategory[categoryId]
            // The query already sorts by votes desc, but we do it again just in case
            .sort((a, b) => (b.votes || 0) - (a.votes || 0))
            .map((sub, index) => ({
              ...sub,
              rank: index + 1
            }));
        }

        setRankingsData(finalRankings);

      } catch (error) {
        console.error("Error fetching rankings:", error);
        toast({ title: "Erreur", description: "Impossible de charger les classements.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessRankings();
  }, [toast]);

  const hasAnyResults = Object.values(rankingsData).some(arr => arr.length > 0);

  if (loading) {
     return (
        <div className="flex justify-center items-center py-20 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center md:text-left">Classement par Catégorie</CardTitle>
        <CardDescription className="text-center md:text-left">
          {hasAnyResults ? "Félicitations à tous les participants et aux lauréats !" : "Les résultats pour chaque catégorie seront affichés ici une fois disponibles."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasAnyResults ? (
          <Tabs defaultValue={categories.find(c => rankingsData[c.id]?.length > 0)?.id || categories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 mb-6">
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center text-xs sm:text-sm py-1.5 px-2" disabled={!rankingsData[cat.id] || rankingsData[cat.id].length === 0}>
                  {cat.icon}{cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id}>
                {rankingsData[cat.id] && rankingsData[cat.id].length > 0 ? (
                  <div className="overflow-x-auto pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Rang</TableHead>
                          <TableHead>Projet / Participant</TableHead>
                          <TableHead className="hidden md:table-cell">Votes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rankingsData[cat.id].map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-bold text-lg">
                              {item.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500 inline-block mr-1" />}
                              {item.rank === 2 && <Award className="h-6 w-6 text-gray-400 inline-block mr-1" />}
                              {item.rank === 3 && <Star className="h-6 w-6 text-orange-400 inline-block mr-1" />}
                              {item.rank > 3 ? item.rank : ''}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                  <Image src="https://placehold.co/40x40.png" alt={item.userName} width={32} height={32} className="rounded-full hidden sm:block" data-ai-hint="person face" />
                                  <div>
                                      <p className="font-semibold">{item.title}</p>
                                      <p className="text-xs text-muted-foreground">par {item.userName}</p>
                                  </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className="text-sm">{item.votes || 0}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" title="Voir le projet">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {item.rank <=3 && (
                              <Button variant="ghost" size="icon" title="Télécharger le certificat">
                                <Download className="h-4 w-4" />
                              </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Info className="mx-auto h-12 w-12" />
                    <p className="mt-4">Aucun résultat disponible pour la catégorie "{cat.name}".</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
           <div className="text-center text-muted-foreground py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p>Les classements finaux apparaîtront ici à la fin de la compétition.</p>
            <p className="text-sm">Restez à l'écoute !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    