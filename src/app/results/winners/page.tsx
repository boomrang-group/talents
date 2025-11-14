import WinnerProfileCard from "@/components/results/winner-profile-card";
import { Users, Award } from "lucide-react";

// Mock data reset for pre-competition state
const winners: any[] = [];

export default function WinnersPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <Award className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nos Brillants Gagnants</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Félicitations aux talents exceptionnels de cette édition de Talents Bantudemy !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {winners.map(winner => (
          <WinnerProfileCard key={winner.id} winner={winner} />
        ))}
      </div>
       {winners.length === 0 && (
        <div className="text-center col-span-full py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Les profils des gagnants seront bientôt affichés.</h3>
            <p className="text-muted-foreground">Restez connectés pour découvrir les lauréats !</p>
        </div>
      )}
    </div>
  );
}
