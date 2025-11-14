import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container py-8 md:py-12">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Termes et Conditions d'Utilisation</CardTitle>
          <CardDescription>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          <p>Bienvenue sur Talents Bantudemy ! En utilisant notre plateforme, vous acceptez de vous conformer aux présents termes et conditions.</p>
          
          <h2 className="text-xl font-semibold font-headline">1. Inscription et Compte Utilisateur</h2>
          <p>Vous devez fournir des informations exactes lors de votre inscription. Vous êtes responsable de la sécurité de votre compte et de votre mot de passe.</p>
          <p>Les comptes de groupe sont limités à 5 membres. Le responsable du groupe est garant des actions de son équipe.</p>

          <h2 className="text-xl font-semibold font-headline">2. Soumission de Contenu</h2>
          <p>En soumettant du contenu, vous garantissez que vous détenez tous les droits nécessaires sur ce contenu et qu'il ne viole aucune loi ni aucun droit de tiers.</p>
          <p>Talents Bantudemy se réserve le droit de refuser ou de retirer tout contenu jugé inapproprié ou non conforme aux règles de la compétition.</p>
          
          <h2 className="text-xl font-semibold font-headline">3. Votes et Évaluation</h2>
          <p>Le vote public est limité à un vote par compte et par épreuve. Toute tentative de fraude entraînera la disqualification.</p>
          <p>Les décisions du jury sont finales et sans appel.</p>

          <h2 className="text-xl font-semibold font-headline">4. Propriété Intellectuelle</h2>
          <p>Vous conservez les droits de propriété intellectuelle sur votre contenu soumis. Cependant, vous accordez à Talents Bantudemy une licence non exclusive pour utiliser, reproduire, et afficher votre contenu dans le cadre de la compétition et de sa promotion.</p>

          <h2 className="text-xl font-semibold font-headline">5. Conduite des Utilisateurs</h2>
          <p>Toute forme de harcèlement, de discours haineux ou de comportement inapproprié est strictement interdite sur la plateforme.</p>

          <h2 className="text-xl font-semibold font-headline">6. Modification des Termes</h2>
          <p>Talents Bantudemy se réserve le droit de modifier ces termes à tout moment. Les modifications seront effectives dès leur publication sur le site.</p>

          <h2 className="text-xl font-semibold font-headline">7. Contact</h2>
          <p>Pour toute question concernant ces termes, veuillez nous contacter à [adresse e-mail de contact].</p>
        </CardContent>
      </Card>
    </div>
  );
}
