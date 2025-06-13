import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProofPack - Blockchain Transaction Compression & ZK Proofs',
  description: 'Advanced transaction compression and zero-knowledge proof generation for blockchain applications.',
  keywords: ['blockchain', 'compression', 'zero-knowledge', 'zk-proofs', 'ethereum', 'crypto'],
  authors: [{ name: 'ProofPack Team' }],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://proofpack.xyz',
    title: 'ProofPack - Blockchain Transaction Compression & ZK Proofs',
    description: 'Advanced transaction compression and zero-knowledge proof generation for blockchain applications.',
    siteName: 'ProofPack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofPack - Blockchain Transaction Compression & ZK Proofs',
    description: 'Advanced transaction compression and zero-knowledge proof generation for blockchain applications.',
    creator: '@proofpack',
  },
};\n
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
