import type { ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image 
            src="/logo-cts.png" 
            alt="Talents Bantudemy CTS Logo" 
            width={170} // Adjusted width for auth page, maintaining aspect ratio (approx 113/40 * 1.5)
            height={60} // Adjusted height for auth page
            className="mx-auto mb-6 shadow-sm" 
            data-ai-hint="company logo"
            priority
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-headline">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <Card className="shadow-xl">
          <CardContent className="p-6 sm:p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
