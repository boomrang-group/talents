
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Video, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';

interface Media {
  type: "video" | "image" | "document";
  url: string; // Placeholder for actual media or link
  title: string;
  dataAiHint?: string;
}

interface Winner {
  id: number;
  name: string;
  category: string;
  projectName: string;
  avatarUrl: string;
  dataAiHint?: string;
  media: Media;
  bio: string;
}

interface WinnerProfileCardProps {
  winner: Winner;
}

const MediaIcon = ({ type }: { type: Media['type'] }) => {
  if (type === 'video') return <Video className="h-5 w-5 mr-2" />;
  if (type === 'image') return <ImageIcon className="h-5 w-5 mr-2" />;
  if (type === 'document') return <FileText className="h-5 w-5 mr-2" />;
  return null;
};

export default function WinnerProfileCard({ winner }: WinnerProfileCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center text-center">
        <div className="relative mb-4">
          <Image
            src={winner.avatarUrl}
            alt={winner.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-primary shadow-md"
            data-ai-hint={winner.dataAiHint}
          />
          <Award className="absolute bottom-0 right-0 h-8 w-8 text-yellow-500 bg-background rounded-full p-1 shadow-md" />
        </div>
        <CardTitle className="font-headline text-xl">{winner.name}</CardTitle>
        <CardDescription className="text-primary font-medium">{winner.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow text-center space-y-3">
        <h4 className="font-semibold text-lg">Vidéo: {winner.projectName}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{winner.bio}</p>
        
        {winner.media && (
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-sm font-semibold mb-2 text-left">Média de la Vidéo:</h5>
            <a href={winner.media.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
              <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted">
                <Image src={winner.media.url} alt={winner.media.title} fill className="object-cover" data-ai-hint={winner.media.dataAiHint}/>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <ExternalLink className="h-8 w-8 text-white"/>
                </div>
              </div>
              <p className="text-sm mt-2 text-primary font-medium flex items-center justify-center">
                <MediaIcon type={winner.media.type} /> {winner.media.title}
              </p>
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
          Voir plus de détails
        </Button>
      </CardFooter>
    </Card>
  );
}
