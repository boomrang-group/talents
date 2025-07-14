// src/app/admin/submissions/page.tsx
'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ListFilter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for submissions
const mockSubmissions = [
  { id: "s001", title: "Composition 'Harmonie Nouvelle'", user: "Mélodie Pure", category: "Musique", type: "Audio", status: "Évalué", score: 96, date: "2024-08-05" },
  { id: "s002", title: "Projet Alpha", user: "Groupe Innovatech", category: "Technologie", type: "Document", status: "En attente", score: null, date: "2024-08-06" },
  { id: "s003", title: "Recette 'Saka Saka revisité'", user: "Chef Antoine", category: "Cuisine", type: "Vidéo", status: "Validé", score: 88, date: "2024-08-04" },
  { id: "s004", title: "Tableau 'Lumière de Kinshasa'", user: "Artiste Visionnaire", category: "Peinture", type: "Image", status: "Rejeté", score: null, date: "2024-08-05" },
];

export default function AdminSubmissionsPage() {
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
                <DropdownMenuCheckboxItem checked>Musique</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Technologie</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Cuisine</DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem>Peinture</DropdownMenuCheckboxItem>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du projet</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Score Jury</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{submission.title}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                          par {submission.user}
                      </div>
                    </TableCell>
                    <TableCell>{submission.category}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{submission.type}</Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={submission.status === 'Évalué' || submission.status === 'Validé' ? 'default' : submission.status === 'En attente' ? 'secondary' : 'destructive'}
                              className={submission.status === 'Validé' ? 'bg-green-600' : ''}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                     <TableCell>{submission.score ? `${submission.score}/100` : 'N/A'}</TableCell>
                    <TableCell>{submission.date}</TableCell>
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
                          <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                           <DropdownMenuItem>Valider</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Rejeter</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
