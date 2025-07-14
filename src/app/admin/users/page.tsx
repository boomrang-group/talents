// src/app/admin/users/page.tsx
'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, File } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for users
const mockUsers = [
  { id: "u001", name: "Alice Dupont", email: "alice.d@example.com", type: "Individuel", status: "Actif", payment: "Complété", date: "2024-08-01" },
  { id: "u002", name: "Groupe Innovatech", email: "chef.innovatech@example.com", type: "Groupe (4)", status: "Actif", payment: "Complété", date: "2024-08-02" },
  { id: "u003", name: "Bob Martin", email: "bob.m@example.com", type: "Individuel", status: "En attente", payment: "Requis", date: "2024-08-03" },
  { id: "u004", name: "Céline Moreau", email: "celine.m@example.com", type: "Individuel", status: "Bloqué", payment: "Échoué", date: "2024-08-01" },
];

export default function AdminUsersPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="blocked">Bloqués</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exporter
            </span>
          </Button>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Ajouter un utilisateur
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>
              Gérez les participants et les groupes inscrits à la compétition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut du compte</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="font-medium">{user.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                            {user.email}
                        </div>
                    </TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Actif' ? 'default' : user.status === 'En attente' ? 'secondary' : 'destructive'}
                             className={user.status === 'Actif' ? 'bg-green-600' : ''}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.payment === 'Complété' ? 'default' : 'outline'}
                            className={user.payment === 'Complété' ? 'bg-blue-600' : ''}>
                          {user.payment}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.date}</TableCell>
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
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Bloquer</DropdownMenuItem>
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
