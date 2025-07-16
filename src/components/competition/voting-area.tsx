"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseServices } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

interface Battle extends DocumentData {
  id: string;
  title: string;
  participantA: { userName: string };
  participantB: { userName: string };
  votesA: number;
  votesB: number;
}
interface VotingAreaProps {
  battle: Battle;
}

export default function VotingArea({ battle }: VotingAreaProps) {
  const [votes, setVotes] = useState({ A: battle.votesA, B: battle.votesB });
  const [totalVotes, setTotalVotes] = useState(battle.votesA + battle.votesB);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check local storage if user has already voted
    const voted = localStorage.getItem(`voted_battle_${battle.id}`);
    if (voted) {
        setHasVoted(true);
    }

    const { firestore } = getFirebaseServices();
    if (!firestore) return;

    const battleRef = doc(firestore, 'battles', battle.id);
    const unsubscribe = onSnapshot(battleRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setVotes({ A: data.votesA, B: data.votesB });
        setTotalVotes(data.votesA + data.votesB);
      }
    });

    return () => unsubscribe();
  }, [battle.id]);

  const handleVote = async (participant: 'A' | 'B') => {
    if (hasVoted) {
      toast({
        title: "Vote déjà enregistré",
        description: "Vous ne pouvez voter qu'une seule fois par battle.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVoting(participant);

    try {
      const response = await fetch('/api/vote-battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId: battle.id, participant }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue.');
      }
      
      setHasVoted(true);
      localStorage.setItem(`voted_battle_${battle.id}`, 'true');
      toast({
        title: "Vote enregistré!",
        description: `Merci d'avoir voté pour ${participant === 'A' ? battle.participantA.userName : battle.participantB.userName}.`,
      });

    } catch (error: any) {
      toast({ title: "Erreur de vote", description: error.message, variant: "destructive" });
    } finally {
      setIsVoting(null);
    }
  };
  
  const getPercentage = (participantVotes: number) => {
    return totalVotes > 0 ? Math.round((participantVotes / totalVotes) * 100) : 0;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-headline text-center">Votez pour votre projet préféré !</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
            { id: 'A', name: battle.participantA.userName, voteCount: votes.A },
            { id: 'B', name: battle.participantB.userName, voteCount: votes.B },
        ].map(option => (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">{option.name}</h4>
                <span className="text-sm text-muted-foreground">{option.voteCount} votes ({getPercentage(option.voteCount)}%)</span>
              </div>
              <Progress value={getPercentage(option.voteCount)} className="h-3 [&>div]:bg-primary" />
              <Button
                onClick={() => handleVote(option.id as 'A' | 'B')}
                disabled={hasVoted || !!isVoting}
                className="w-full mt-2 transition-all duration-300 ease-in-out"
              >
                {isVoting === option.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                {isVoting === option.id ? "Vote en cours..." : `Voter pour ${option.name}`}
              </Button>
            </div>
          ))}
        {hasVoted && <p className="text-sm text-center text-green-600 font-medium">Merci pour votre vote !</p>}
         {!hasVoted && <p className="text-sm text-center text-muted-foreground">Un seul vote par utilisateur et par battle.</p>}
      </CardContent>
    </Card>
  );
}
