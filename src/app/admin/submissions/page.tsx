// src/app/admin/submissions/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ListFilter, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Submission {
  id: string;
  title: string;
  userName: string;
  category: string;
  fileType: string;
  status: 'pending_review' | 'validated' | 'rejected';
  createdAt: Timestamp;
  // Add other fields as necessary
}

const statusMapping: { [key: string]: { text: string; variant: "default" | "secondary" | "destructive"; className?: string } } = {
  pending_review: { text: "En attente", variant: "secondary" },
  validated: { text: "Validé", variant: "default", className: "bg-green-600" },
  rejected: { text: "Rejeté", variant: "destructive" },
};

const categoryNames: { [key: string]: string } = {
  danse: "Danse",
  slam_poesie: "Slam/Poésie",
  musique: "Musique",
  comedie: "Comédie",
};


export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) {
      toast({ title: "Erreur", description: "Firestore n'est pas disponible.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const submissionsCollection = collection(firestore, "submissions");
    const unsubscribe = onSnapshot(submissionsCollection, (snapshot) => {
      const submissionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Submission));
      setSubmissions(submissionsList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching submissions:", error);
      toast({ title: "Erreur", description: "Impossible de charger les soumissions.", variant: "destructive" });
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firestore, toast]);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('fr-FR');
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="validated">Validées</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtrer par catégorie
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Catégories</DropdownMenuLabel>
                 {Object.entries(categoryNames).map(([id, name]) => (
                  <DropdownMenuCheckboxItem key={id}>{name}</DropdownMenuCheckboxItem>
                 ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Soumissions</CardTitle>
            <CardDescription>
              Gérez et modérez tous les projets soumis par les participants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : submissions.length === 0 ? (
               <div className="text-center py-10 text-muted-foreground">
                  Aucune soumission trouvée.
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du projet</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type Fichier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(submission => {
                  const statusInfo = statusMapping[submission.status] || { text: 'Inconnu', variant: 'secondary' };
                  return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{submission.title}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                          par {submission.userName}
                      </div>
                    </TableCell>
                    <TableCell>{categoryNames[submission.category] || submission.category}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{submission.fileType}</Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={statusInfo.variant} className={statusInfo.className}>
                        {statusInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/submission-details/${submission.id}`}>Voir les détails</Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem>Valider</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Rejeter</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
