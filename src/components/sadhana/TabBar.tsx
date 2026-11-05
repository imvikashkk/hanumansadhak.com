'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { whatsappLink } from '@/data/site';
import Icon from '../Icon';
import { HELP_TEXT, TABS, type PlanOver } from './tabs';

const itemClass = 'flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[12px] leading-none';

// Phones only (desktop has the same links in the header), with "today's practice" one thumb away.
export default function TabBar({ expired }: { expired?: PlanOver }) {
  const pathname = usePathname();
  const [sadhana, certificate, profile] = TABS;

  function tab({ href, label, icon }: (typeof TABS)[number]) {
    const active = pathname === href;
    return (
      <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`${itemClass} ${active ? 'font-bold text-[var(--gold)]' : 'font-medium text-[#fff1cf]/70'}`}>
        <Icon name={icon} className="text-[1.5rem]" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <nav aria-label="मुख्य मेनू" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--gold)]/30 bg-[#2b0b06]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(43_11_6/0.3)] backdrop-blur md:hidden print:hidden">
      <div className="mx-auto flex h-[4.25rem] max-w-lg items-stretch">
        {!expired && tab(sadhana)}
        {expired !== 'unfinished' && tab(certificate)}
        {!expired && (
          <div className="relative flex-[1.25]">
            <Link href="/sadhana/today" className={`${itemClass} justify-end pb-2.5 font-bold text-[var(--gold)]`}>
              <span className="absolute -top-6 grid h-[3.75rem] w-[3.75rem] place-items-center rounded-full bg-ember text-2xl text-[var(--primary-foreground)] shadow-glow ring-4 ring-[#2b0b06]">
                <Icon name="play" />
              </span>
              <span className="whitespace-nowrap">आज की साधना</span>
            </Link>
          </div>
        )}
        {tab(profile)}
        <a href={whatsappLink(HELP_TEXT)} target="_blank" rel="noopener noreferrer" className={`${itemClass} font-medium text-[#fff1cf]/70`}>
          <Icon name="whatsapp" className="text-[1.5rem] text-[#25d366]" />
          <span>मदद</span>
        </a>
      </div>
    </nav>
  );
}
