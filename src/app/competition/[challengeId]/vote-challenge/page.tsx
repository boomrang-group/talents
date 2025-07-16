// src/app/competition/[challengeId]/vote-challenge/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { ThumbsUp, ArrowLeft, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFirebaseServices } from "@/lib/firebase";
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const categoryNames: { [key: string]: string } = {
  esthetique_mode: "Esthétique et Mode",
  peinture: "Peinture",
  cuisine: "Cuisine",
  poesie: "Poésie",
  art_oratoire: "Art Oratoire",
  theatre: "Théâtre",
  musique: "Musique",
  danse: "Danse",
};

interface Submission {
  id: string;
  title: string;
  userName: string;
  fileUrl: string;
  fileType: string;
  votes: number;
}

export default function VoteChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const challengeId = params.challengeId as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingSubmissionId, setVotingSubmissionId] = useState<string | null>(null);

  const challengeTitle = categoryNames[challengeId] || "Défi";
  const challengeDescription = `Votez pour votre projet préféré dans la catégorie ${challengeTitle}.`;
  
  useEffect(() => {
    if (!challengeId) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      const { firestore } = getFirebaseServices();
      if (!firestore) {
        toast({ title: "Erreur", description: "Firestore n'est pas disponible.", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        const submissionsCol = collection(firestore, "submissions");
        const q = query(submissionsCol, where("category", "==", challengeId), where("status", "==", "validated"));
        const querySnapshot = await getDocs(q);

        const submissionsList: Submission[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          votes: doc.data().votes || 0,
          ...doc.data()
        } as Submission));
        
        setSubmissions(submissionsList);
      } catch (error) {
        console.error("Error fetching submissions for voting:", error);
        toast({ title: "Erreur", description: "Impossible de charger les projets pour le vote.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [challengeId, toast]);

  const handleVote = async (submissionId: string) => {
    setVotingSubmissionId(submissionId);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId, challengeId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Une erreur est survenue lors du vote.");
      }
      
      // Optimistic UI update
      setSubmissions(prev => prev.map(s => s.id === submissionId ? {...s, votes: (s.votes || 0) + 1} : s));

      toast({
        title: "Vote enregistré !",
        description: "Merci pour votre participation.",
        variant: "default",
      });

    } catch (error: any) {
      toast({
        title: "Erreur de vote",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setVotingSubmissionId(null);
    }
  };
  
  const SubmissionPreview = ({ submission }: { submission: Submission }) => {
    if (submission.fileType.startsWith('image/')) {
      return <Image src={submission.fileUrl} alt={submission.title} fill className="object-cover" data-ai-hint="project preview" />;
    }
    // Add more preview types if needed (video, audio)
    return <div className="bg-muted flex items-center justify-center h-full"><p className="text-sm text-muted-foreground">Aperçu non disponible</p></div>;
  };


  if (loading) {
    return (
      <div className="container py-8 md:py-12 text-center">
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement des soumissions...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux défis
      </Button>
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">{challengeTitle}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">{challengeDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                     <SubmissionPreview submission={submission} />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xl font-semibold font-headline">{submission.title}</h3>
                  <p className="text-sm text-muted-foreground">par {submission.userName}</p>
                  <p className="text-sm text-muted-foreground">Votes actuels: {submission.votes}</p>
                  <Button 
                    onClick={() => handleVote(submission.id)} 
                    disabled={votingSubmissionId === submission.id}
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {votingSubmissionId === submission.id ? 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                      <ThumbsUp className="mr-2 h-4 w-4" />
                    }
                    {votingSubmissionId === submission.id ? "Vote en cours..." : "Voter pour ce projet"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
           {submissions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <Info className="mx-auto h-12 w-12" />
                <p className="mt-4">Aucune soumission disponible pour le vote dans cette catégorie pour le moment.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
