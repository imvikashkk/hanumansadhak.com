import Image from 'next/image';
import { INCLUDES } from '@/data/content';
import { HERO_BG } from '@/data/media';
import CheckoutButton from './CheckoutButton';
import Icon from './Icon';
import { Reveal } from './Reveal';

export default function OfferSection() {
  return (
    <section id="offer" className="mx-auto max-w-5xl scroll-mt-16 px-4 pb-20 sm:px-6" aria-labelledby="offer-heading">
      <Reveal className="overflow-hidden rounded-3xl border-2 border-[var(--gold)]/60 bg-[var(--card)] shadow-glow">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-72 lg:min-h-full">
            <Image
              src={HERO_BG.src}
              alt={HERO_BG.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 440px, 100vw"
              className="object-cover object-[55%_25%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--card)]" />
            <span className="absolute left-4 top-4 rounded-full bg-ember px-3 py-1 text-sm font-bold text-[var(--primary-foreground)]">
              40 दिन का संकल्प
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-sm font-semibold text-[var(--primary)]">॥ साधना में क्या-क्या मिलेगा ॥</p>
            <h2 id="offer-heading" className="mt-2 font-display text-3xl sm:text-4xl">
              40 दिन हनुमान स्तुति साधना
            </h2>

            <ul className="mt-6 space-y-3">
              {INCLUDES.map((f) => (
                <li key={f.text} className="flex items-start gap-3 text-base">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-500/15 text-sm text-green-400">
                    <Icon name="check" />
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>

            <CheckoutButton placement="offer" className="cta-pulse mt-8 w-full" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
