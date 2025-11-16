import SponsorLogos from "@/components/partners/sponsor-logos";
import PartnershipContactForm from "@/components/partners/partnership-contact-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Users, BarChart3 } from "lucide-react";
import Image from "next/image";

export default function PartnersPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <Handshake className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nos Partenaires & Sponsors</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ensemble, nous construisons l'avenir des talents congolais. Découvrez comment vous pouvez nous rejoindre.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10 font-headline">Ils Nous Font Confiance</h2>
        <SponsorLogos />
      </section>

      <section className="mb-16 bg-secondary/30 py-12 rounded-lg">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-10 font-headline">Pourquoi Devenir Partenaire ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="mx-auto h-10 w-10 text-primary mb-3" />
                <CardTitle className="font-headline">Visibilité Accrue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Associez votre marque à l'innovation et à la jeunesse talentueuse du Congo.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="mx-auto h-10 w-10 text-primary mb-3" />
                <CardTitle className="font-headline">Impact Positif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Contribuez directement au développement des compétences et à l'émergence de futurs leaders.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto h-10 w-10 text-primary mb-3"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <CardTitle className="font-headline">Réseautage Stratégique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Connectez-vous avec un écosystème de talents et d'entreprises.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Proposer un Partenariat</CardTitle>
            <CardDescription>
              Vous souhaitez soutenir Talents Bantudemy ? Remplissez ce formulaire et notre équipe vous contactera.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PartnershipContactForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
