// src/app/admin/battles/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, ListVideo, Calendar, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFirebaseServices } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  title: string;
  userName: string;
  fileUrl: string;
  userId: string;
}

interface Battle {
  id: string;
  title: string;
  scheduledAt: { toDate: () => Date };
  participantA: { userName: string };
  participantB: { userName: string };
  status: 'scheduled' | 'live' | 'finished';
}

export default function AdminBattlesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formState, setFormState] = useState({
    title: '',
    scheduledAt: '',
    participantAId: '',
    participantBId: '',
  });

  useEffect(() => {
    const { firestore } = getFirebaseServices();
    if (!firestore) return;

    // Fetch validated music submissions
    const q = query(collection(firestore, "submissions"), where("category", "==", "musique"), where("status", "==", "validated"));
    getDocs(q).then(snapshot => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(subs);
      setLoadingSubmissions(false);
    });

    // Listen for real-time updates on battles
    const battlesQuery = query(collection(firestore, "battles"));
    const unsubscribe = onSnapshot(battlesQuery, (snapshot) => {
      const battleList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Battle));
      setBattles(battleList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'participantAId' | 'participantBId', value: string) => {
    setFormState(prev => ({ ...prev, [id]: value }));
  };
  
  const handleDeleteBattle = async (battleId: string) => {
    const { firestore } = getFirebaseServices();
    if (!firestore) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer cette battle ?")) {
        try {
            await deleteDoc(doc(firestore, "battles", battleId));
            toast({ title: "Succès", description: "La battle a été supprimée." });
        } catch (error) {
            console.error("Error deleting battle:", error);
            toast({ title: "Erreur", description: "Impossible de supprimer la battle.", variant: "destructive" });
        }
    }
  };

  const handleCreateBattle = async () => {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      toast({ title: "Erreur", description: "Firestore n'est pas disponible.", variant: "destructive" });
      return;
    }

    if (formState.participantAId === formState.participantBId) {
        toast({ title: "Erreur", description: "Les deux participants doivent être différents.", variant: "destructive" });
        return;
    }

    const participantA = submissions.find(s => s.id === formState.participantAId);
    const participantB = submissions.find(s => s.id === formState.participantBId);

    if (!participantA || !participantB || !formState.title || !formState.scheduledAt) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(firestore, "battles"), {
        title: formState.title,
        scheduledAt: new Date(formState.scheduledAt),
        status: 'scheduled',
        participantA: {
          submissionId: participantA.id,
          userId: participantA.userId,
          userName: participantA.userName,
          title: participantA.title,
          fileUrl: participantA.fileUrl,
        },
        participantB: {
          submissionId: participantB.id,
          userId: participantB.userId,
          userName: participantB.userName,
          title: participantB.title,
          fileUrl: participantB.fileUrl,
        },
        votesA: 0,
        votesB: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Succès", description: "La battle a été créée." });
      setIsDialogOpen(false);
      setFormState({ title: '', scheduledAt: '', participantAId: '', participantBId: '' });
    } catch (error) {
      console.error("Error creating battle:", error);
      toast({ title: "Erreur", description: "Impossible de créer la battle.", variant: "destructive" });
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Battles</h1>
          <p className="text-muted-foreground">Créez et programmez les battles en direct.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une Battle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Battle</DialogTitle>
            </DialogHeader>
            {loadingSubmissions ? <Loader2 className="mx-auto h-8 w-8 animate-spin" /> : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Titre</Label>
                <Input id="title" value={formState.title} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduledAt" className="text-right">Date</Label>
                <Input id="scheduledAt" type="datetime-local" value={formState.scheduledAt} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="participantAId" className="text-right">Participant 1</Label>
                 <Select onValueChange={(value) => handleSelectChange('participantAId', value)} value={formState.participantAId}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un participant" />
                    </SelectTrigger>
                    <SelectContent>
                        {submissions.map(sub => <SelectItem key={sub.id} value={sub.id}>{sub.userName} - "{sub.title}"</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="participantBId" className="text-right">Participant 2</Label>
                 <Select onValueChange={(value) => handleSelectChange('participantBId', value)} value={formState.participantBId}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un participant" />
                    </SelectTrigger>
                    <SelectContent>
                        {submissions.map(sub => <SelectItem key={sub.id} value={sub.id}>{sub.userName} - "{sub.title}"</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleCreateBattle}>Créer la Battle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Battles Programmées</CardTitle>
          <CardDescription>Liste des battles à venir et passées.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" /> :
           battles.length === 0 ? <p className="text-muted-foreground text-center py-8">Aucune battle programmée.</p> :
           <div className="space-y-4">
              {battles.map(battle => (
                <div key={battle.id} className="border p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{battle.title}</p>
                        <p className="text-sm text-muted-foreground">{battle.participantA.userName} vs {battle.participantB.userName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {battle.scheduledAt.toDate().toLocaleString('fr-FR')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Badge>{battle.status}</Badge>
                         <Button variant="destructive" size="icon" onClick={() => handleDeleteBattle(battle.id)}>
                            <Trash2 className="h-4 w-4"/>
                         </Button>
                    </div>
                </div>
              ))}
           </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
