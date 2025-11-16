// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Vote, BarChart3, Loader2 } from "lucide-react";
import { getFirebaseServices } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    totalVotes: 8765, // Placeholder, can be implemented later
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      toast({ title: "Erreur", description: "Firestore n'est pas disponible.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const unsubscribers = [
      onSnapshot(collection(firestore, "users"), snapshot => {
        setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
      }, (error) => console.error("Error fetching users count:", error)),
      
      onSnapshot(collection(firestore, "submissions"), snapshot => {
        setStats(prev => ({ ...prev, totalSubmissions: snapshot.size }));
        setLoading(false); // Set loading to false after the last listener is set up
      }, (error) => {
        console.error("Error fetching submissions count:", error);
        setLoading(false);
      }),
    ];

    // Cleanup listeners on unmount
    return () => unsubscribers.forEach(unsub => unsub());
  }, [toast]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">Vue d'ensemble et statistiques de la compétition.</p>
      </div>
      
      {loading ? <Loader2 className="mx-auto my-12 h-10 w-10 animate-spin" /> : (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs Inscrits
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total des participants et groupes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Soumissions Totales
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Toutes catégories confondues.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes Enregistrés</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Vote du public (donnée statique).
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Soumissions Récentes</CardTitle>
              <CardDescription>
                Les dernières soumissions reçues apparaîtront ici.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-4">Les données réelles des soumissions sont maintenant affichées dans la section "Soumissions".</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Activité des Votes</CardTitle>
              <CardDescription>
                Un graphique en temps réel des votes sera affiché ici.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12" />
                  <p className="mt-4">Le module de suivi des votes est en cours de développement.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
      )}
    </div>
  );
}