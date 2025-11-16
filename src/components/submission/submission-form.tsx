
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
import { useAuth } from "@/context/auth-context";
import { getFirebaseServices } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/avi", "video/quicktime", "video/webm"];


const submissionFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères."),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères.").max(500, "La description ne peut pas dépasser 500 caractères."),
  category: z.string({ required_error: "Veuillez sélectionner une catégorie." }),
  file: z.any()
         .refine(files => files?.length > 0, "Un fichier est requis.")
         .refine(files => files?.[0]?.size <= 10 * 1024 * 1024, `La taille maximale du fichier est 10MB.`)
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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

    const { firestore } = getFirebaseServices();
    const storage = getStorage();
    if (!firestore || !storage) {
        toast({ title: "Erreur de configuration", description: "Services Firebase non disponibles.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        const file = values.file[0];
        const storageRef = ref(storage, `submissions/${user.uid}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const submissionData: any = {
            userId: user.uid,
            userName: user.displayName || user.email,
            title: values.title,
            description: values.description,
            category: values.category,
            fileUrl: downloadURL,
            fileName: file.name,
            fileType: file.type,
            teamMembers: values.teamMembers,
            status: "pending_review",
            createdAt: serverTimestamp(),
            votes: 0,
        };

        await addDoc(collection(firestore, "submissions"), submissionData);

        toast({
            title: "Soumission Réussie!",
            description: `Votre projet "${values.title}" a été soumis avec succès.`,
            variant: "default",
        });
        form.reset();
        router.push("/dashboard");

    } catch (error) {
        console.error("Submission error:", error);
        toast({
            title: "Erreur de soumission",
            description: "Une erreur est survenue lors du téléversement de votre projet. Veuillez réessayer.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
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
          render={({ field: { onChange, value, ...rest } }) => ( // `value` is handled by the file input itself
            <FormItem>
              <FormLabel>Fichier vidéo du projet</FormLabel>
              <FormControl>
                 <Input 
                    type="file" 
                    accept="video/mp4,video/mov,video/avi,video/quicktime,video/webm" 
                    onChange={(e) => onChange(e.target.files)}
                    {...rest}
                    ref={null} // react-hook-form doesn't need ref for file inputs if onChange is used
                  />
              </FormControl>
              <FormDescription>
                Seuls les fichiers vidéo sont acceptés. Taille max: 10MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
