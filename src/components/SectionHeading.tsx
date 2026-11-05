import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export default function SectionHeading({
  id,
  eyebrow,
  children,
  sub,
}: {
  id: string;
  eyebrow: string;
  children: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]/70" aria-hidden="true" />
        <span className="text-[var(--gold)]" aria-hidden="true">✦</span>
        {eyebrow}
        <span className="text-[var(--gold)]" aria-hidden="true">✦</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]/70" aria-hidden="true" />
      </p>
      <h2 id={id} className="mt-2 font-display text-[2rem] sm:text-5xl">
        {children}
      </h2>
      {sub && <p className="mt-3 text-base text-[var(--muted-foreground)] sm:text-lg">{sub}</p>}
    </Reveal>
  );
}
