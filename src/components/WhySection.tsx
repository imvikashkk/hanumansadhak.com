import Image from 'next/image';
import { WHY } from '@/data/content';
import { SECTION_BG } from '@/data/media';
import Icon from './Icon';
import { Reveal } from './Reveal';

export default function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24" aria-labelledby="why-heading">
      <Reveal className="relative overflow-hidden rounded-3xl border border-[var(--primary)]/25 bg-[var(--card)] p-6 shadow-card sm:p-12">
        <Image src={SECTION_BG.why} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] via-[var(--card)]/90 to-[var(--card)]/75" />
        <div className="bg-mandala absolute inset-0 opacity-60" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold text-[var(--primary)]">आध्यात्मिक महत्व</p>
            <h2 id="why-heading" className="mt-2 font-display text-[2rem] sm:text-5xl">
              क्यों काम करती है <span className="text-ember">ये साधना?</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              हनुमान जी को कलियुग का सबसे जाग्रत देवता माना जाता है।
            </p>
            <blockquote className="mt-6 rounded-2xl border border-[var(--gold)]/30 bg-black/20 p-5">
              <p className="font-display text-xl text-[var(--gold)]">॥ भूत पिशाच निकट नहिं आवैं। महावीर जब नाम सुनावैं ॥</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">— हनुमान चालीसा, गोस्वामी तुलसीदास जी</p>
            </blockquote>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="ring-gold-hover group relative flex h-full min-h-60 flex-col justify-end overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <Image src={w.image} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="photo-zoom object-cover object-top opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent" />
                  <div className="relative">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)]/50 bg-black/40 text-2xl text-[var(--gold)] backdrop-blur-sm">
                      <Icon name={w.icon} />
                    </span>
                    <h3 className="mt-3 font-display text-xl">{w.title}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-[var(--foreground)]/80">{w.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
