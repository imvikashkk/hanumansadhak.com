import Image from 'next/image';
import { HERO_BG, HERO_VIDEOS } from '@/data/media';
import { SITE } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import CreamDecor from './CreamDecor';
import Icon, { type IconName } from './Icon';
import { Reveal } from './Reveal';
import Embers from './Embers';
import HeroVideos from './video/HeroVideos';

// `text` only shows on desktop, where the benefits become cards.
const BENEFITS: { icon: IconName; label: string; text: string }[] = [
  { icon: 'pray', label: 'मन की शांति', text: 'चिंता और बेचैनी से मुक्ति' },
  { icon: 'bolt', label: 'आत्मविश्वास', text: 'हर काम में नया साहस' },
  { icon: 'shield', label: 'संकटों से रक्षा', text: 'संकटमोचन का आशीर्वाद' },
  { icon: 'sparkle', label: 'आध्यात्मिक विकास', text: 'भक्ति में रोज़ नई गहराई' },
];

const TRUST: { icon: IconName; label: string }[] = [
  { icon: 'clock', label: 'रोज़ सिर्फ 10 मिनट' },
  { icon: 'headphones', label: 'Guided audio' },
  { icon: 'certificate', label: 'साधना प्रमाण-पत्र' },
];

// Initials of devotees from the testimonials, shown as a little avatar stack.
const AVATARS = [
  { initial: 'रा', bg: 'from-amber-500 to-orange-700' },
  { initial: 'सु', bg: 'from-rose-500 to-red-800' },
  { initial: 'अ', bg: 'from-yellow-500 to-amber-700' },
  { initial: 'प्र', bg: 'from-orange-500 to-red-700' },
];

const DAILY_POINTS: { icon: IconName; label: string }[] = [
  { icon: 'clock', label: 'सुबह हो या शाम — जब आपको सुविधा हो' },
  { icon: 'headphones', label: 'Guided audio के साथ चालीसा पाठ और जप' },
  { icon: 'certificate', label: '40 दिन पूरे होने पर साधना प्रमाण-पत्र' },
];

const WISHES = ['नौकरी', 'व्यापार', 'विवाह', 'संतान', 'धन', 'स्वास्थ्य', 'घर-जमीन', 'परीक्षा', 'विदेश'];

const STATS = [
  { value: SITE.devotees, label: 'भक्त जुड़े' },
  { value: '40', label: 'दिन की साधना' },
  { value: '9', label: 'तरह की मनोकामनाएं' },
  { value: '10 मिनट', label: 'रोज़ का समय' },
];

export default function HeroSection() {
  return (
    <section className="relative isolate">
      {/* ── Banner: Hanuman ji on the right (on top for phones), headline + CTA beside ── */}
      <div className="relative isolate overflow-hidden border-b border-[var(--gold)]/10">
        {/* same scene, blurred, so the whole banner glows in sunset colours */}
        <div className="absolute inset-0 -z-20 hidden lg:block" aria-hidden="true">
          <Image src={HERO_BG.src} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-35 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent" />
        </div>
        <div className="hero-zoom relative aspect-square w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[60%] lg:[mask-image:linear-gradient(to_right,transparent,black_30%),linear-gradient(to_bottom,black_80%,transparent)] lg:[mask-composite:intersect]">
          <Image src={HERO_BG.src} alt={HERO_BG.alt} fill priority placeholder="blur" sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[52%_30%]" />
        </div>
        <Embers className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_top,black_40%,transparent)]" />

        {/* desktop: fills the screen below the banner + navbar (-2px = navbar's and this banner's borders) */}
        <div className="relative mx-auto -mt-14 grid max-w-7xl gap-y-6 px-4 pb-10 text-center sm:-mt-32 sm:px-6 lg:mt-0 lg:min-h-[calc(100svh-var(--banner-h)-var(--nav-h)-2px)] lg:grid-cols-[1fr_1fr] lg:gap-x-10 lg:py-12 lg:text-left lg:[@media(max-height:820px)]:py-6 2xl:max-w-[90rem]">
          {/* very short desktop screens drop the extras so everything fits in one screen */}
          <div className="lg:self-center">
            <p
              className="hero-in mb-5 hidden items-center gap-2 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1.5 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_0_24px_-6px_var(--gold)] sm:inline-flex lg:[@media(max-height:820px)]:hidden"
              style={{ animationDelay: '50ms' }}
            >
              <Icon name="lotus" className="text-[#f7d77a]" />
              जय श्री राम · जय हनुमान
              <Icon name="lotus" className="text-[#f7d77a]" />
            </p>
            <h1 className="font-display leading-[1.12]">
              <span className="hero-in block" style={{ animationDelay: '150ms' }}>
                {/* "40 दिनों का" between two gold rules */}
                <span className="flex items-center justify-center gap-3 text-[1.35rem] text-[#f7d77a] sm:text-[1.8rem] lg:justify-start xl:text-[2rem] 2xl:text-[2.3rem]">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#f7d77a] sm:w-14 lg:hidden" aria-hidden="true" />
                  40 दिनों का
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#f7d77a] sm:w-14 lg:w-20 lg:bg-gradient-to-r lg:from-[#f7d77a] lg:to-transparent" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-[2.1rem] text-[#fff8e7] [text-shadow:0_3px_18px_rgb(0_0_0/0.8)] sm:text-[2.9rem] xl:text-[3.4rem] 2xl:text-[3.9rem]">
                  हनुमान चालीसा साधना
                </span>
              </span>
              <span className="hero-in mt-3 block sm:mt-4" style={{ animationDelay: '300ms' }}>
                <span className="block text-[1.5rem] text-[#fff1cf]/85 [text-shadow:0_2px_14px_rgb(0_0_0/0.8)] sm:text-[2rem] xl:text-[2.3rem] 2xl:text-[2.6rem]">बनिए एक सच्चे</span>
                {/* the key words in burnished gold, glowing like a diya */}
                <span className="relative block">
                  <span className="absolute inset-x-[10%] top-1/2 h-2/3 -translate-y-1/2 rounded-full bg-[#f7d77a]/25 blur-3xl lg:inset-x-0 lg:right-1/4" aria-hidden="true" />
                  <span className="relative bg-gradient-to-b from-[#fffbe8] via-[#f7d77a] to-[#c98a1f] bg-clip-text text-[3rem] leading-[1.15] text-transparent [filter:drop-shadow(0_3px_0_#7a3410)_drop-shadow(0_10px_24px_rgb(0_0_0/0.6))] sm:text-[4rem] xl:text-[4.7rem] 2xl:text-[5.5rem]">
                    हनुमान साधक
                  </span>
                </span>
              </span>
            </h1>
            {/* lotus divider */}
            <div className="hero-in mt-3 flex items-center justify-center gap-2 text-[#f7d77a] lg:justify-start" style={{ animationDelay: '350ms' }} aria-hidden="true">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#f7d77a] lg:from-[#f7d77a]/40" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#f7d77a]" />
              <Icon name="lotus" className="text-xl" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#f7d77a]" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#f7d77a]" />
            </div>
            <p
              className="hero-in mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#fff1cf]/85 [text-shadow:0_1px_10px_rgb(0_0_0/0.8)] sm:text-lg lg:mx-0 2xl:text-xl lg:[@media(max-height:820px)]:hidden"
              style={{ animationDelay: '400ms' }}
            >
              <strong className="font-semibold text-[#f7d77a]">Guided audio</strong> के साथ रोज़ चालीसा पाठ, संकल्प और जप —{' '}
              <strong className="font-semibold text-[#f7d77a]">घर बैठे</strong>।
            </p>

            <ul className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2 lg:mx-0 lg:mt-8 lg:max-w-xl lg:grid-cols-2 lg:gap-3 2xl:max-w-2xl">
              {BENEFITS.map(({ icon, label, text }, i) => (
                <li
                  key={label}
                  className="hero-in flex flex-col items-center gap-1.5 text-center text-xs font-medium leading-tight sm:text-sm lg:flex-row lg:gap-3 lg:rounded-2xl lg:border lg:border-[var(--gold)]/20 lg:bg-black/35 lg:p-3 lg:text-left lg:backdrop-blur-sm lg:transition-colors lg:hover:border-[var(--gold)]/50"
                  style={{ animationDelay: `${450 + i * 100}ms` }}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-[var(--gold)]/70 bg-black/50 text-xl text-[var(--gold)] shadow-[0_0_18px_-4px_var(--gold)] lg:h-11 lg:w-11">
                    <Icon name={icon} />
                  </span>
                  <span>
                    <span className="block lg:text-lg lg:font-semibold">{label}</span>
                    <span className="hidden text-sm font-normal text-[var(--muted-foreground)] lg:block lg:[@media(max-height:820px)]:hidden">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <ul className="hero-in mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--foreground)]/80 lg:flex lg:[@media(max-height:820px)]:hidden" style={{ animationDelay: '900ms' }}>
              {TRUST.map(({ icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon name={icon} className="text-base text-[var(--primary)]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* chaupai up top, CTA + social proof at the bottom — under Hanuman ji on desktop */}
          <div className="flex flex-col items-center lg:justify-between">
            <figure
              className="animate-float mt-2 hidden max-w-xs self-end rounded-2xl border border-[var(--gold)]/40 bg-[#1a0604]/75 px-5 py-4 text-center shadow-card backdrop-blur-md lg:block 2xl:max-w-sm">
              <blockquote className="font-display text-lg leading-snug text-[var(--gold)] 2xl:text-xl">
                संकट कटै मिटै सब पीरा।
                <br />
                जो सुमिरै हनुमत बलबीरा॥
              </blockquote>
              <figcaption className="mt-1.5 text-xs text-[var(--muted-foreground)]">— श्री हनुमान चालीसा</figcaption>
            </figure>

            <div className="hero-in flex w-full flex-col items-center" style={{ animationDelay: '800ms' }}>
              <CheckoutButton placement="hero" tone="red" className="w-full max-w-md">
                अपनी साधना यात्रा शुरू करें
              </CheckoutButton>
              <div className="mt-4 flex items-center gap-3 text-left">
                <div className="flex -space-x-3">
                  {AVATARS.map(({ initial, bg }) => (
                    <span
                      key={initial}
                      className={`grid h-10 w-10 place-items-center rounded-full border-2 border-white/90 bg-gradient-to-br text-sm font-bold text-white ${bg} max-sm:h-9 max-sm:w-9 max-sm:text-xs sm:h-11 sm:w-11`}
                      aria-hidden="true"
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] sm:text-base">
                    <strong className="text-[var(--gold)]">{SITE.devotees}</strong> साधक पहले ही जुड़ चुके हैं
                  </p>
                  <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                    <span className="flex text-[var(--gold)]" aria-label={`${SITE.rating} में से 5 स्टार`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Icon key={i} name="star" />
                      ))}
                    </span>
                    <span className="text-[var(--foreground)]/85">
                      {SITE.rating}/5 ({SITE.reviews} Reviews)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Light band: video, wishes, highlights, stats on warm chandan-cream ── */}
      <div className="relative isolate bg-gradient-to-b from-[var(--cream)] to-[var(--cream-deep)] text-[var(--maroon)]">
        <CreamDecor />
        <div className="absolute inset-x-0 top-0 h-1 bg-ember" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:pt-24 2xl:max-w-[90rem]">
          {/* Phones: the videos first, then the copy. Desktop: videos on the left, the "what happens daily" copy + wishes on the right */}
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-6">
            {HERO_VIDEOS.length > 0 && (
              <Reveal className="order-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
                <HeroVideos videos={HERO_VIDEOS} />

                {/* caption + a doha under the video */}
                <div className="mt-5 flex items-center gap-3 text-left">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[var(--sindoor)]/40 bg-white/70 text-[var(--sindoor)]">
                    <Icon name="play" className="translate-x-px" />
                  </span>
                  <div className="leading-snug">
                    <p className="font-semibold">हनुमान स्तुति साधना — एक झलक</p>
                    <p className="text-sm text-[var(--maroon)]/70">एक बार देखिए, फिर मन से तय कीजिए — आवाज़ के लिए वीडियो पर टैप करें।</p>
                  </div>
                </div>
                <figure className="mt-5 rounded-2xl border border-[var(--maroon)]/10 border-l-4 border-l-[var(--sindoor)] bg-white/55 px-5 py-4 text-center shadow-sm backdrop-blur-sm sm:text-left">
                  <blockquote className="font-display text-lg leading-relaxed sm:text-xl">
                    बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
                    <br />
                    बल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥
                  </blockquote>
                  <figcaption className="mt-1 text-sm text-[var(--sindoor)]">— श्री हनुमान चालीसा</figcaption>
                </figure>
              </Reveal>
            )}

            <Reveal className="order-2 text-center lg:col-start-2 lg:row-start-1 lg:self-end lg:text-left">
              <p className="font-display text-xl text-[var(--sindoor)] sm:text-2xl">॥ साधना की एक झलक ॥</p>
              <h2 className="mt-2 text-[1.9rem] leading-tight text-[var(--maroon)] sm:text-4xl xl:text-[2.6rem]">
                आख़िर क्या है <span className="text-[var(--sindoor)]">40 दिन की हनुमान साधना?</span>
              </h2>
              <p className="mt-2 font-semibold text-[var(--sindoor)] sm:text-lg">
                जिससे अब तक {SITE.devotees} साधक जुड़ चुके हैं
              </p>
              <p className="mx-auto mt-3 max-w-xl text-[var(--maroon)]/80 sm:text-lg lg:mx-0">
                40 दिनों तक नियमित <strong className="text-[var(--maroon)]">हनुमान चालीसा पाठ, ध्यान, संकल्प और आत्म-चिंतन</strong> की एक
                सुनियोजित साधना — जो आपके जीवन में सकारात्मक बदलाव लाने के लिए विशेष रूप से तैयार की गई है। रोज़ बस 10 मिनट, मोबाइल पर
                मार्गदर्शन के साथ।
              </p>
            </Reveal>

            <Reveal delay={120} className="order-3 text-center lg:col-start-2 lg:row-start-2 lg:self-start lg:text-left">
              <ul className="mx-auto inline-flex flex-col gap-2.5 text-left lg:mx-0">
                {DAILY_POINTS.map(({ icon, label }) => (
                  <li key={label} className="flex items-center gap-3 font-medium">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember text-lg text-[var(--primary-foreground)] shadow-glow">
                      <Icon name={icon} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              {/* Wishes */}
              <div className="mt-7 rounded-2xl border border-[var(--maroon)]/10 bg-white/50 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-[var(--sindoor)]">आपकी मनोकामना कोई भी हो —</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {WISHES.map((w, i) => (
                    <span
                      key={w}
                      className="wish-glow rounded-full border border-[var(--maroon)]/20 bg-white/80 px-3 py-1 text-sm font-semibold text-[var(--maroon)] shadow-sm"
                      style={{ animationDelay: `${i}s` }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <CheckoutButton placement="video-section" size="md" className="mt-7 w-full max-w-sm">
                <Icon name="flame" /> आज ही साधना शुरू करें
              </CheckoutButton>
            </Reveal>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Stats */}
            <div className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat, idx) => (
                <Reveal key={stat.label} delay={idx * 100} className="text-center">
                  <div className="bg-gradient-to-br from-[var(--sindoor)] to-[var(--maroon)] bg-clip-text font-display text-3xl text-transparent sm:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-[var(--maroon)]/75">{stat.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
