import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Image 
        src="/logo-cts.png"
        alt="Talents Bantudemy CTS Logo" 
        width={113} 
        height={40} 
        priority 
        data-ai-hint="company logo"
      />
    </Link>
  );
};

export default Logo;
