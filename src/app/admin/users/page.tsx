// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, File, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFirebaseServices } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: string;
    name: string;
    email: string;
    accountType: 'individual' | 'group';
    paymentStatus: 'unpaid' | 'completed' | 'failed';
    createdAt: { seconds: number; nanoseconds: number; } | Date;
    groupMembers?: any[];
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            const { firestore } = getFirebaseServices();
            if (!firestore) {
                toast({
                    title: "Erreur de configuration",
                    description: "Firestore n'est pas disponible.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            try {
                const usersCollection = collection(firestore, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersList);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les utilisateurs.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);

    const getAccountStatus = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'completed': return { text: 'Actif', variant: 'default', className: 'bg-green-600' };
            case 'unpaid': return { text: 'En attente', variant: 'secondary', className: '' };
            case 'failed': return { text: 'Bloqué', variant: 'destructive', className: '' };
            default: return { text: 'Inconnu', variant: 'outline', className: '' };
        }
    };

    const getPaymentStatus = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'completed': return { text: 'Complété', variant: 'default', className: 'bg-blue-600' };
            case 'unpaid': return { text: 'Requis', variant: 'outline', className: '' };
            case 'failed': return { text: 'Échoué', variant: 'destructive', className: '' };
            default: return { text: 'N/A', variant: 'outline', className: '' };
        }
    };
    
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('fr-FR');
    };

    const getType = (user: User) => {
        if (user.accountType === 'group') {
            const memberCount = user.groupMembers?.length || 1;
            return `Groupe (${memberCount})`;
        }
        return 'Individuel';
    };


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
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
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
                    {users.map(user => {
                        const accountStatus = getAccountStatus(user.paymentStatus);
                        const paymentStatus = getPaymentStatus(user.paymentStatus);
                        return (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>{getType(user)}</TableCell>
                                <TableCell>
                                <Badge variant={accountStatus.variant as any} className={accountStatus.className}>
                                    {accountStatus.text}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                <Badge variant={paymentStatus.variant as any} className={paymentStatus.className}>
                                    {paymentStatus.text}
                                </Badge>
                                </TableCell>
                                <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                        );
                    })}
                </TableBody>
                </Table>
            )}
            { !loading && users.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Aucun utilisateur trouvé.
                </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
