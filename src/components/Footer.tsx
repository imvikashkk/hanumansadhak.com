import Link from 'next/link';
import { SITE, whatsappLink } from '@/data/site';
import Icon from './Icon';
import { Logo } from './Navbar';

// `stickyBar`: leave room on phones for the homepage's fixed bottom bar.
export default function Footer({ stickyBar = true }: { stickyBar?: boolean }) {
  return (
    <footer className={`bg-mandala relative border-t border-[var(--gold)]/20 bg-[var(--card)]/40 ${stickyBar ? 'pb-24 sm:pb-0' : ''}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <Logo />
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              घर बैठे 40 दिन की guided हनुमान स्तुति साधना — रोज़ सिर्फ 10 मिनट। सबका मंगल हो।
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm text-[var(--muted-foreground)]">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 transition hover:text-[var(--foreground)]">
              <Icon name="whatsapp" className="text-base" /> {SITE.whatsappDisplay} (WhatsApp)
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-3 transition hover:text-[var(--foreground)]">
              <Icon name="mail" className="text-base" /> {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)] sm:flex-row">
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-[var(--foreground)]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">Terms</Link>
            <Link href="/refund-policy" className="hover:text-[var(--foreground)]">Refund Policy</Link>
          </div>
          <p>
            © {new Date().getFullYear()} {SITE.domain} · सर्वे भवन्तु सुखिनः
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--muted-foreground)]/70">
          यह एक श्रद्धा-आधारित आध्यात्मिक कार्यक्रम है। अनुभव भक्तों के व्यक्तिगत हैं; परिणाम श्रद्धा, नियमितता और परिस्थितियों पर निर्भर करते हैं।
        </p>
      </div>
    </footer>
  );
}
