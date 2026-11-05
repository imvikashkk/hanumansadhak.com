import type { Metadata, Viewport } from 'next';
import { Hind, Rozha_One } from 'next/font/google';
import { MandalaDefs } from '@/components/CreamDecor';
import MetaPixel from '@/components/MetaPixel';
import NavigationProgress from '@/components/NavigationProgress';
import { SITE } from '@/data/site';
import { TEXT_SIZE_KEY, TEXT_SIZES } from '@/lib/text-size';
import './globals.css';

const rozha = Rozha_One({ variable: '--font-rozha', weight: '400', subsets: ['devanagari', 'latin'] });
const hind = Hind({ variable: '--font-hind', weight: ['400', '500', '600', '700'], subsets: ['devanagari', 'latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: '40 दिन हनुमान स्तुति साधना — रोज़ 10 मिनट | हनुमान साधक',
  description:
    'रोज़ सिर्फ 10 मिनट हनुमान जी की guided स्तुति सुनें। 40 दिन की साधना पूरी करें, सर्टिफिकेट पाएं — नौकरी, विवाह, धन, स्वास्थ्य की मनोकामना के लिए। 50,000+ भक्त जुड़ चुके हैं।',
  keywords: 'hanuman stuti, hanuman chalisa, 40 din sadhana, hanuman sadhana, manokamna, hanuman sadhak',
  openGraph: {
    title: '40 दिन की हनुमान स्तुति साधना — रोज़ सिर्फ 10 मिनट',
    description: `${SITE.devotees} भक्त जुड़ चुके हैं। आज ही साधना शुरू करें।`,
    images: ['/images/hanuman-ram-darbar.jpg'],
    locale: 'hi_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2b0b06',
  viewportFit: 'cover',
};

// Applies the saved text-size choice before first paint (no flash of small text).
const textSizeScript = `try{var m=${JSON.stringify(Object.fromEntries(TEXT_SIZES.map((t) => [t.id, t.scale])))};var v=m[localStorage.getItem(${JSON.stringify(TEXT_SIZE_KEY)})];if(v)document.documentElement.style.fontSize=v}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${rozha.variable} ${hind.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: textSizeScript }} />
      </head>
      <body className="min-h-full">
        <MandalaDefs />
        <MetaPixel />
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}
