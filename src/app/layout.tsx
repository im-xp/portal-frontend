import { Metadata } from "next";
import "../styles/globals.css";
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Raleway } from 'next/font/google';
import GoogleAnalytics from "@/components/utils/GoogleAnalytics";
import { Toaster } from "sonner";
import { config } from "@/constants/config";

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: config.metadata.title,
  description: config.metadata.description,
  icons: {
    icon: config.metadata.icon,
  },
  openGraph: {
    title: config.metadata.openGraph.title,
    description: config.metadata.openGraph.description,
    images: [{
      url: config.metadata.openGraph.images[0].url,
      width: config.metadata.openGraph.images[0].width,
      height: config.metadata.openGraph.images[0].height,
      alt: config.metadata.openGraph.images[0].alt,
    }]
  }
};

export default function RootLayout({children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning>
        <GoogleAnalytics />
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
