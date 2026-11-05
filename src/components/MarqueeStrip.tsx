import { MARQUEE } from '@/data/content';
import Icon from './Icon';

export default function MarqueeStrip() {
  const line = (
    <span className="flex shrink-0 items-center">
      {MARQUEE.map((t) => (
        <span key={t} className="flex items-center gap-6 px-6 font-display text-lg sm:text-xl">
          <Icon name="flame" className="text-[var(--primary-foreground)]/60" />
          {t}
        </span>
      ))}
    </span>
  );
  return (
    <div className="overflow-hidden bg-ember py-3 text-[var(--primary-foreground)] shadow-glow" aria-hidden="true">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {line}
        {line}
      </div>
    </div>
  );
}
