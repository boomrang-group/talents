import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const whatsappNumber = "243818120214";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact & Support</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter via l'un des canaux ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Phone Numbers Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              <Phone className="mr-3 h-6 w-6 text-primary" />
              Par Téléphone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">RDC</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><a href="tel:+243982720000" className="hover:text-primary">+243 982 720 000</a></li>
                <li><a href="tel:+243982730000" className="hover:text-primary">+243 982 730 000</a></li>
                <li><a href="tel:+243818120214" className="hover:text-primary">+243 818 120 214</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">International</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><a href="tel:+15146602815" className="hover:text-primary">+1 (514) 660-2815 (Canada)</a></li>
                <li><a href="tel:+33649804629" className="hover:text-primary">+33 6 49 80 46 29 (France)</a></li>
                <li><a href="tel:+27843800090" className="hover:text-primary">+27 84 380 0090 (Afrique du Sud)</a></li>
                <li><a href="tel:+32476782126" className="hover:text-primary">+32 476 78 21 26 (Belgique)</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Email and Address Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              <MapPin className="mr-3 h-6 w-6 text-primary" />
              Email & Adresse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center"><Mail className="mr-2 h-5 w-5"/>Email</h3>
              <a href="mailto:contact@boomrang-group.com" className="text-muted-foreground hover:text-primary">
                contact@boomrang-group.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center"><MapPin className="mr-2 h-5 w-5"/>Adresse Physique</h3>
              <p className="text-muted-foreground">
                19, avenue Cabana, Pullman Hôtel, Kinshasa/Gombe
              </p>
              <Link href="https://maps.app.goo.gl/9RxoqKLPH32XSN979" target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0 h-auto mt-2">Voir sur Google Maps</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Card */}
        <Card className="shadow-lg md:col-span-2 lg:col-span-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-950/50 border-green-500/50">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline text-green-800 dark:text-green-300">
              <MessageCircle className="mr-3 h-6 w-6" />
              Support WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center flex flex-col items-center justify-center h-full pb-10">
            <p className="text-green-700 dark:text-green-300/90 mb-6">
              Pour une réponse rapide, contactez-nous directement sur WhatsApp.
            </p>
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
              <Button size="lg" className="w-full bg-[#25D366] text-white hover:bg-[#1DA851]">
                <MessageCircle className="mr-2" /> Démarrer la conversation
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">{`+${whatsappNumber}`}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
