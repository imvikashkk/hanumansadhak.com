import Image from 'next/image';
import logo from '@/assets/hanuman_sadhak_logo.png';
import { SECTION_BG } from '@/data/media';
import { SITE } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import Icon from './Icon';
import { Reveal } from './Reveal';

export default function CTASection() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-[var(--card)] p-8 text-center shadow-glow sm:p-16">
        <Image src={SECTION_BG.cta} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.14_0.04_30/0.75),oklch(0.14_0.04_30/0.95))]" />
        <div className="relative">
          {/* the logo carries its own gold ring */}
          <span className="relative mx-auto block h-28 w-28 animate-float sm:h-32 sm:w-32">
            <span className="absolute -inset-3 rounded-full bg-[var(--primary)]/40 blur-xl" />
            <Image src={logo} alt={SITE.nameEn} sizes="128px" className="relative h-full w-full drop-shadow-[0_0_18px_rgb(247_215_122/0.45)]" />
          </span>
          <h2 className="mt-4 font-display text-[2rem] sm:text-5xl">
            देर मत करें — <span className="text-ember">आज से शुरू करें</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted-foreground)]">
            हर दिन सिर्फ 10 मिनट। 40 दिन की साधना। हनुमान जी की कृपा आप पर सदा बनी रहे।
          </p>
          <p className="mt-4 font-display text-xl text-[var(--gold)]">॥ संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा ॥</p>
          <CheckoutButton placement="final" className="cta-pulse mt-8">
            <Icon name="flame" /> आज ही साधना शुरू करें
          </CheckoutButton>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">घर बैठे · रोज़ 10 मिनट · 40वें दिन सर्टिफिकेट</p>
        </div>
      </Reveal>
    </section>
  );
}
