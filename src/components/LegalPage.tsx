import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/data/site';
import Footer from './Footer';
import { Logo } from './Navbar';

const LEGAL_LINKS = [
  { href: '/terms', label: 'नियम एवं शर्तें' },
  { href: '/privacy-policy', label: 'गोपनीयता नीति' },
  { href: '/refund-policy', label: 'रिफंड नीति' },
];

export default function LegalPage({ title, updatedOn, children }: { title: string; updatedOn: string; children: ReactNode }) {
  return (
    <>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          ← होम
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h1 className="text-center font-display text-4xl">{title}</h1>
        <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">अंतिम अपडेट: {updatedOn}</p>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${l.label === title ? 'border-transparent bg-ember text-[var(--primary-foreground)]' : 'border-[var(--border)] bg-[var(--card)]'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <article className="mt-6 space-y-7 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-base leading-relaxed text-[var(--foreground)]/85 sm:p-10 [&_a]:text-[var(--primary)] [&_a]:underline [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-[var(--border)] [&_h2]:pb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[var(--gold)] [&_li]:marker:text-[var(--primary)] [&_strong]:text-[var(--foreground)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
          <section>
            <h2>संपर्क</h2>
            <p>
              WhatsApp: {SITE.whatsappDisplay} · ईमेल: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
