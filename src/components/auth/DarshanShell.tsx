import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { MANOKAMNA, PERKS, SWAROOP, type DarshanImage } from '@/data/darshan';
import Embers from '../Embers';
import Footer from '../Footer';
import Icon, { type IconName } from '../Icon';
import Navbar from '../Navbar';

// Signup, login and payment, in the homepage's dark sindoor-and-gold. The rule for this layout: the form is
// on the first screen. Desktop: darshan beside the form, both exactly one screen tall and scrolling
// together. Phones: a slim darshan banner with the title on it, and the form straight after.
export default function DarshanShell({
  page,
  hero,
  heroAlt,
  heroPosition,
  chaupai,
  ribbon,
  ribbonIcon,
  title,
  sub,
  children,
}: {
  page: 'signup' | 'login' | 'payment' | 'sadhak';
  hero: StaticImageData;
  heroAlt: string;
  // object-position, e.g. "50% 20%": which part of the picture stays in view.
  heroPosition: string;
  chaupai: [string, string];
  ribbon: string;
  ribbonIcon: IconName;
  title: ReactNode;
  sub: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar page={page} />
      <main className="relative isolate overflow-clip bg-[radial-gradient(ellipse_at_top,oklch(0.36_0.12_34),var(--background)_70%)] [--background:oklch(0.25_0.085_30)] [--card:oklch(0.31_0.09_30)]">
        <div className="bg-mandala absolute inset-0 -z-20 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
        <Embers className="absolute inset-0 -z-10" />

        <div className="lg:grid lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* the darshan */}
          <aside className="relative h-44 sm:h-60 lg:h-auto">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent)] lg:[mask-image:linear-gradient(to_right,black_55%,transparent_97%)]">
              <Image src={hero} alt={heroAlt} fill priority placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: heroPosition }} />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-[var(--background)] from-5% via-[var(--background)]/60 via-35% to-transparent to-65% lg:block" />
            </div>

            <div className="absolute inset-x-0 bottom-0 hidden px-8 pb-8 pr-16 lg:block xl:px-12 xl:pr-24">
              <p className="font-display text-3xl leading-snug text-[#f7d77a] [text-shadow:0_2px_14px_black] xl:text-4xl">
                ॥ {chaupai[0]} ॥
                <span className="mt-1 block text-lg text-[#fff1cf]/90 xl:text-xl">{chaupai[1]}</span>
              </p>
              <Medallions className="mt-5 justify-start" />
            </div>
          </aside>

          {/* the form */}
          <div className="relative mx-auto -mt-12 w-full max-w-xl px-4 lg:max-w-2xl xl:max-w-3xl pb-10 sm:-mt-14 sm:px-6 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:py-4">
            <div className="text-center">
              <span className="hidden items-center gap-1.5 rounded-full border border-[var(--gold)] lg:inline-flex lg:[@media(max-height:820px)]:hidden bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
                <Icon name={ribbonIcon} className="text-[#f7d77a]" /> {ribbon}
              </span>
              <h1 className="font-display text-[2.25rem] leading-[1.15] [text-shadow:0_3px_18px_black] sm:text-5xl lg:mt-2">{title}</h1>
              <div className="mt-1 hidden items-center justify-center gap-2 text-[var(--gold)] lg:flex lg:[@media(max-height:790px)]:hidden" aria-hidden="true">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
                <Icon name="lotus" className="text-xl" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
              </div>
              <p className="mx-auto mt-1 hidden max-w-md text-base text-[var(--muted-foreground)] lg:block lg:[@media(max-height:820px)]:hidden">{sub}</p>
            </div>

            <div className="mt-3 lg:mt-4">{children}</div>
          </div>
        </div>

        <section aria-labelledby="darshan-perks" className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:pt-14">
          <h2 id="darshan-perks" className="flex items-center gap-3 text-center font-display text-3xl text-[#f7d77a] sm:text-4xl">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#f7d77a]/70" aria-hidden="true" />
            साधना में आपको मिलेगा
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f7d77a]/70" aria-hidden="true" />
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {PERKS.map((p) => (
              <li key={p.title} className="group overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] shadow-card transition-colors hover:border-[var(--gold)]/70">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="photo-zoom object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent to-50%" />
                </div>
                <div className="px-3 pb-4 sm:px-4">
                  <h3 className="font-display text-lg leading-snug sm:text-xl">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="darshan-gallery" className="pt-14">
          <h2 id="darshan-gallery" className="px-4 text-center font-display text-3xl text-ember sm:text-4xl">
            बजरंगबली के दर्शन
          </h2>
          <p className="mt-2 px-4 text-center text-[var(--muted-foreground)]">हर मनोकामना में, हर संकट में — हनुमान जी साथ हैं</p>
          <div className="mt-6 space-y-3 sm:space-y-4">
            <Ribbon images={SWAROOP} seconds={38} />
            <Ribbon images={MANOKAMNA} seconds={75} reverse />
          </div>
        </section>

        <div className="mt-14">
          <Footer stickyBar={false} />
        </div>
      </main>
    </>
  );
}

// Gold-ringed coins of Hanuman ji's forms, overlapping like the homepage's avatar stack.
function Medallions({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex -space-x-2.5 ${className}`} aria-hidden="true">
      {SWAROOP.slice(0, 4).map((m) => (
        <li key={m.label} className="rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#8a5a12] p-[2px] shadow-[0_6px_18px_-6px_black]">
          <Image src={m.src} alt="" width={64} height={64} className="h-14 w-14 rounded-full object-cover object-top sm:h-16 sm:w-16" />
        </li>
      ))}
    </ul>
  );
}

// An endless strip of pictures. The second copy is only there to close the loop.
function Ribbon({ images, seconds, reverse = false }: { images: DarshanImage[]; seconds: number; reverse?: boolean }) {
  const strip = (copy: boolean) => (
    <ul className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4" aria-hidden={copy || undefined}>
      {images.map((img) => (
        <li key={img.label} className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-2xl border border-[var(--gold)]/40 shadow-card sm:w-48">
          <Image src={img.src} alt={copy ? '' : img.label} fill sizes="(min-width: 640px) 192px, 144px" className="object-cover" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-8 text-center font-display text-sm leading-tight text-[#f7d77a] sm:text-base">
            {img.label}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]" style={{ animationDuration: `${seconds}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
