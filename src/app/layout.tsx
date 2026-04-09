import { Metadata } from "next";
import { headers } from "next/headers";
import "../styles/globals.css";
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Raleway } from 'next/font/google';
import GoogleAnalytics from "@/components/utils/GoogleAnalytics";
import SegmentAnalytics from "@/components/utils/SegmentAnalytics";
import { Toaster } from "sonner";

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

// Domain to popup metadata mapping
const popupMetadata: Record<string, {
  title: string;
  description: string;
  image: string;
  icon?: string;
}> = {
  'volunteers.icelandeclipse.com': {
    title: 'Iceland Eclipse Volunteers',
    description: 'Welcome, Iceland Eclipse Volunteers. Log in or sign up to access your volunteer portal.',
    image: 'https://storage.googleapis.com/icelandeclipse/iceland-eclipse__social-preview.jpg',
  },
  'ripple.egypt-eclipse.com': {
    title: 'Ripple on the Nile',
    description: 'Welcome to Ripple on the Nile. Log in or sign up to access your Egypt adventure.',
    image: 'https://storage.googleapis.com/egypt-eclipse/ripple-on-nile-icon.png',
  },
  'default': {
    title: 'The Portal at Iceland Eclipse',
    description: 'Welcome to the Portal at Iceland Eclipse. Log in or sign up to access Portal events.',
    image: 'https://storage.googleapis.com/icelandeclipse/the-portal-at-iceland-eclipse-logo__square.png',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const hostname = host.split(':')[0];
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${hostname}`;
  
  const meta = popupMetadata[hostname] || popupMetadata['default'];
  
  return {
    metadataBase: new URL(baseUrl),
    title: meta.title,
    description: meta.description,
    icons: {
      icon: '/icon.png',
    },
    openGraph: {
      type: 'website',
      url: baseUrl,
      title: meta.title,
      description: meta.description,
      images: [{
        url: meta.image,
        width: 1200,
        height: 630,
        alt: meta.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  };
}

export default function RootLayout({children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <SegmentAnalytics />
        <MiniKitProvider>
          <div className={`${raleway.className} antialiased w-[100%]`}>
            {children}
          </div>
        </MiniKitProvider>
        <Toaster position="bottom-center" richColors  />
      </body>
    </html>
  );
}
