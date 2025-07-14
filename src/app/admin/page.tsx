// src/app/admin/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Vote, BarChart3, Users2 } from "lucide-react";

export default function AdminDashboardPage() {
  // Mock data for overview stats
  const stats = {
    totalUsers: 1250,
    totalSubmissions: 342,
    totalVotes: 8765,
    juryMembers: 15
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">Vue d'ensemble et statistiques de la compétition.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              Vote du public et du jury.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres du Jury</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.juryMembers}</div>
             <p className="text-xs text-muted-foreground">
              Jury actif pour cette édition.
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Soumissions Récentes</CardTitle>
             <CardDescription>
              Les 5 dernières soumissions reçues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Here you would map over real data */}
            <p className="text-muted-foreground">Composant à développer (liste des soumissions).</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité des Votes</CardTitle>
            <CardDescription>
              Distribution des votes par catégorie.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Composant à développer (graphique des votes).</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
