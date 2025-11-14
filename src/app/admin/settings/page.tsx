// src/app/admin/settings/page.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function AdminSettingsPage() {
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would handle form submission, e.g., to a backend API
        toast({
            title: "Paramètres sauvegardés",
            description: "Les paramètres de la compétition ont été mis à jour.",
        });
    };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">Paramètres de la Compétition</h1>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Configuration Générale</CardTitle>
                <CardDescription>Paramètres principaux de l'événement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3">
                    <Label htmlFor="competition-name">Nom de la Compétition</Label>
                    <Input id="competition-name" type="text" className="w-full" defaultValue="Talents Bantudemy" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" defaultValue="Révélez votre potentiel dans la plus grande compétition en ligne pour étudiants." className="min-h-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="start-date">Date de Début</Label>
                        <Input id="start-date" type="date" defaultValue="2024-08-04" />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="end-date">Date de Fin</Label>
                        <Input id="end-date" type="date" defaultValue="2024-09-30" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Phases de la Compétition</CardTitle>
                <CardDescription>Gérez l'état et les dates des différentes phases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="registration-phase" className="text-base font-medium">Inscriptions</Label>
                        <p className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire.</p>
                    </div>
                    <Switch id="registration-phase" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="submission-phase" className="text-base font-medium">Soumissions</Label>
                        <p className="text-sm text-muted-foreground">Autoriser les participants à soumettre des projets.</p>
                    </div>
                    <Switch id="submission-phase" />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="voting-phase" className="text-base font-medium">Phase de Vote</Label>
                        <p className="text-sm text-muted-foreground">Ouvrir le vote au public et au jury.</p>
                    </div>
                    <Switch id="voting-phase" />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit">Sauvegarder les modifications</Button>
        </div>
      </form>
    </div>
  )
}
