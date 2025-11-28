
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Progress } from "@/components/ui/progress";


const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/avi", "video/quicktime", "video/webm"];


const submissionFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères."),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères.").max(500, "La description ne peut pas dépasser 500 caractères."),
  category: z.string({ required_error: "Veuillez sélectionner une catégorie." }),
  file: z.any()
         .refine(files => files?.length > 0, "Un fichier est requis.")
         .refine(files => files?.[0]?.size <= 100 * 1024 * 1024, `La taille maximale du fichier est 100MB.`)
         .refine(
            files => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
            "Seuls les formats vidéo (.mp4, .mov, .avi, etc.) sont acceptés."
         ),
  teamMembers: z.array(z.object({ email: z.string().email("Email de coéquipier invalide.") })).optional(),
  confirmSubmission: z.boolean().refine(val => val === true, {
    message: "Veuillez confirmer votre soumission.",
  }),

});

const categories = [
    { id: "danse", name: "Danse" },
    { id: "slam_poesie", name: "Slam/Poésie" },
    { id: "musique", name: "Musique" },
    { id: "comedie", name: "Comédie" },
];

export default function SubmissionForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof submissionFormSchema>>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "", // Initialize category as empty or handle undefined better
      teamMembers: [],
      confirmSubmission: false,
    },
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.some(c => c.id === categoryFromUrl)) {
      form.setValue('category', categoryFromUrl);
    }
  }, [searchParams, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });


  async function onSubmit(values: z.infer<typeof submissionFormSchema>) {
    setIsLoading(true);
    if (!user) {
      toast({
        title: "Non authentifié",
        description: "Vous devez être connecté pour soumettre un projet.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!firestore) {
        toast({ title: "Erreur de configuration", description: "Services Firebase non disponibles.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        // Step 1: Get an upload URL from our server
        const uploadUrlResponse = await fetch('/api/mux/upload', {
            method: 'POST',
        });
        if (!uploadUrlResponse.ok) {
            throw new Error("Impossible d'obtenir une URL de téléversement.");
        }
        const { upload_url, asset_id } = await uploadUrlResponse.json();

        // Step 2: Upload the file directly to Mux
        const file = values.file[0];
        
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", upload_url, true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(percentComplete);
                }
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Échec du téléversement: ${xhr.statusText}`));
                }
            };
            xhr.onerror = () => reject(new Error("Erreur réseau lors du téléversement."));
            xhr.send(file);
        });

        setUploadProgress(100); // Mark as complete before DB write

        // Step 3: Save submission data to Firestore with Mux Asset ID
        const submissionData: any = {
            userId: user.uid,
            userName: user.displayName || user.email,
            title: values.title,
            description: values.description,
            category: values.category,
            muxAssetId: asset_id,
            muxPlaybackId: null, // This will be updated by the webhook
            fileType: file.type,
            teamMembers: values.teamMembers,
            status: "processing", // The video is being processed by Mux
            createdAt: serverTimestamp(),
            votes: 0,
        };

        await addDoc(collection(firestore, "submissions"), submissionData);

        toast({
            title: "Téléversement Réussi !",
            description: `Votre projet "${values.title}" est en cours de traitement.`,
            variant: "default",
        });
        form.reset();
        router.push("/dashboard");

    } catch (error: any) {
        console.error("Submission error:", error);
        toast({
            title: "Erreur de soumission",
            description: error.message || "Une erreur est survenue lors du téléversement de votre projet. Veuillez réessayer.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
        setUploadProgress(null);
    }
  }

  const isGroupAccount = true; 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du projet/de l'œuvre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mon voyage poétique" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description générale du projet/de l'œuvre</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre projet en quelques mots (max 500 caractères)..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...rest } }) => ( 
            <FormItem>
              <FormLabel>Fichier vidéo du projet</FormLabel>
              <FormControl>
                 <Input 
                    type="file" 
                    accept="video/mp4,video/mov,video/avi,video/quicktime,video/webm" 
                    onChange={(e) => onChange(e.target.files)}
                    {...rest}
                    ref={null}
                  />
              </FormControl>
              <FormDescription>
                Seuls les fichiers vidéo sont acceptés. Taille max: 100MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         {uploadProgress !== null && (
          <div className="space-y-2">
            <Label>Progression du téléversement</Label>
            <Progress value={uploadProgress} />
            <p className="text-sm text-muted-foreground text-center">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        {isGroupAccount && (
          <div>
            <FormLabel>Membres de l'équipe (Optionnel)</FormLabel>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`teamMembers.${index}.email`}
                render={({ field: memberField }) => (
                  <FormItem className="flex items-center space-x-2 mt-2">
                    <FormControl>
                      <Input placeholder="email@coequipier.com" {...memberField} />
                    </FormControl>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ email: "" })}
              disabled={fields.length >= 4} 
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un coéquipier
            </Button>
             <FormDescription className="mt-1">
                Ajoutez les adresses e-mail de vos coéquipiers (max 4 en plus du chef d'équipe).
              </FormDescription>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="confirmSubmission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Je confirme que les informations sont correctes et que cette soumission respecte les règles de la compétition.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Soumission en cours..." : "Soumettre mon Projet"}
        </Button>
      </form>
    </Form>
  );
}
