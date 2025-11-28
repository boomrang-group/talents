"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useUser, useAuth as useFirebaseAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, Home, UserPlus, Trophy, Award, Users, LogIn, LayoutDashboard, LogOut, X, Mail } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/competition', label: 'Compétition', icon: Trophy },
  { href: '/results', label: 'Résultats', icon: Award },
  { href: '/partners', label: 'Partenaires', icon: Users },
  { href: '/contact', label: 'Contact', icon: Mail },
];

const NavLink = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("justify-start w-full text-base", isActive && "text-primary font-semibold")}
        onClick={onClick}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
};

const Header = () => {
  const { data: user } = useUser();
  const auth = useFirebaseAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleLogout = async () => {
    if(!auth) return; // Silently fail if firebase is not configured
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo/>
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button variant="ghost" className={cn("text-foreground/70 hover:text-primary", usePathname() === link.href && "text-primary font-semibold")}>
                {link.label}
                </Button>
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" passHref>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="ghost" className="hover:text-primary">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/signup" passHref>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6"/>
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="flex flex-row items-center justify-between p-4 border-b space-y-0">
                  <Logo/>
                  <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                  <SheetDescription className="sr-only">Navigation principale du site</SheetDescription>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Fermer le menu</span>
                      </Button>
                  </SheetClose>
                </SheetHeader>
                <nav className="flex-grow p-4 space-y-2">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} onClick={closeSheet} />
                  ))}
                   <hr className="my-4" />
                  {isLoggedIn ? (
                    <>
                      <NavLink href="/dashboard" label="Tableau de bord" icon={LayoutDashboard} onClick={closeSheet} />
                      <Button variant="ghost" onClick={() => { handleLogout(); closeSheet(); }} className="justify-start w-full text-base hover:text-destructive">
                        <LogOut className="mr-2 h-5 w-5" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink href="/auth/login" label="Connexion" icon={LogIn} onClick={closeSheet}/>
                      <NavLink href="/auth/signup" label="Inscription" icon={UserPlus} onClick={closeSheet}/>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
