
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Lightbulb, Users, Star, UserPlus, Trophy, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-br from-primary to-sky-400 text-primary-foreground">
        <div className="container text-center px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-6 tracking-tight">
            Talents Bantudemy
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Découvrez et soutenez les plus incroyables talents panafricains. Votre vote compte !
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 shadow-lg transition-transform hover:scale-105">
                Inscrivez-vous Maintenant
              </Button>
            </Link>
            <Link href="/competition">
              <Button size="lg" variant="outline" className="bg-black border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg transition-transform hover:scale-105">
                Découvrir la Compétition
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="w-full py-16 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">Pourquoi Participer ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                  Révélez Votre Talent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Une plateforme unique pour mettre en avant vos compétences, votre créativité et vos projets innovants.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  Rencontrez et Collaborez
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connectez-vous avec d'autres étudiants passionnés, formez des équipes et élargissez votre réseau.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <Star className="h-6 w-6 mr-2 text-primary" />
                  Gagnez en Visibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Soyez reconnu par des professionnels, des entreprises et des partenaires potentiels.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-16 lg:py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">Comment ça Marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: UserPlus, title: "Inscription Facile", description: "Créez votre compte en solo ou en équipe." },
              { icon: CheckCircle, title: "Soumission de Projet", description: "Partagez vos idées via vidéo, audio, image ou document." },
              { icon: Trophy, title: "Phases de Compétition", description: "Participez aux éliminatoires et aux votes du public." },
              { icon: Award, title: "Résultats & Récompenses", description: "Découvrez les gagnants et célébrez lors de la cérémonie finale." },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-background rounded-lg shadow-md">
                <step.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 font-headline">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section Placeholder */}
      <section className="w-full py-16 lg:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">Nos Prestigieux Partenaires</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="grayscale hover:grayscale-0 transition-all duration-300">
                <Image 
                  src={`https://placehold.co/150x80.png`} 
                  alt={`Sponsor ${i}`} 
                  width={150} 
                  height={80} 
                  className="object-contain"
                  data-ai-hint="company logo" />
              </div>
            ))}
          </div>
           <div className="text-center mt-12">
            <Link href="/partners">
              <Button variant="outline" size="lg" className="text-primary border-primary hover:bg-primary/10">
                Devenir Partenaire
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
