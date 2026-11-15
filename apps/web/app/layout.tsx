import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joicerosa.com.br'),
  title: {
    default: 'Joice Rosa Cosméticos | Perfumaria autoral brasileira',
    template: '%s | Joice Rosa Cosméticos',
  },
  description:
    'Perfumes autorais brasileiros criados com matérias-primas nobres, curadoria olfativa e uma experiência de compra pensada para durar.',
  openGraph: {
    title: 'Joice Rosa Cosméticos',
    description:
      'Perfumaria autoral brasileira. Composições que traduzem memória, pele e presença.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
