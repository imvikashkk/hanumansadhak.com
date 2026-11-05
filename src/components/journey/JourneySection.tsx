import { HERO_BG } from '@/data/media';
import CreamDecor from '../CreamDecor';
import ParallaxImage from '../ParallaxImage';
import Icon, { type IconName } from '../Icon';
import { Reveal } from '../Reveal';
import DayExplorer from './DayExplorer';
import MilestoneStrip from './MilestoneStrip';
import PhaseTimeline from './PhaseTimeline';

const QUICK: { icon: IconName; value: string; label: string }[] = [
  { icon: 'calendar', value: '40', label: 'दिन का संकल्प' },
  { icon: 'headphones', value: '40', label: 'दिन नया मार्गदर्शन' },
  { icon: 'book', value: '3', label: 'विशेष पाठ' },
  { icon: 'pray', value: '108', label: 'राम नाम जप' },
];

export default function JourneySection() {
  return (
    <section id="yatra" className="theme-cream relative isolate scroll-mt-16 overflow-hidden" aria-labelledby="journey-heading">
      {/* Hanuman ji fixed behind the whole section, washed into chandan-cream */}
      <div className="absolute inset-0 -z-20 bg-[var(--cream)]" aria-hidden="true">
        <ParallaxImage src={HERO_BG.src} className="object-[50%_30%] opacity-[0.18] saturate-[0.75]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--cream)]/55 via-[var(--cream)]/40 to-[var(--cream-deep)]/70" />
      </div>
      <CreamDecor fixedMandalas />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-ember" aria-hidden="true" />
      {/* opening */}
      <div className="relative pb-4 pt-20 sm:pt-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          {/* heading — maroon ribbon, two-tone title, lotus divider */}
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
              <Icon name="flame" className="text-[#f7d77a]" /> 40 दिन की यात्रा
            </span>
            <h2 id="journey-heading" className="mt-4 font-display text-[2.3rem] leading-tight text-[var(--maroon)] [text-shadow:0_2px_16px_rgb(255_250_240/0.9)] sm:text-6xl">
              पूरी यात्रा, <span className="text-[var(--sindoor)]">दिन-ब-दिन</span>
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-[var(--primary)]" aria-hidden="true">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--gold)]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
              <Icon name="lotus" className="text-xl" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--gold)]" />
            </div>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium text-[var(--maroon)]/85 [text-shadow:0_1px_10px_rgb(255_250_240/0.9)] sm:text-lg">
              संकल्प से सर्टिफिकेट तक — हर पड़ाव पर क्या होगा और आप क्या महसूस करेंगे।
            </p>
          </Reveal>

          {/* quick facts — gold-framed tiles with a maroon medallion */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4 sm:gap-5">
            {QUICK.map((q, i) => (
              <Reveal key={q.label} delay={i * 90} className="h-full">
                <div className="group h-full rounded-[1.4rem] bg-gradient-to-b from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_22px_45px_-30px_var(--maroon)] transition-transform duration-500 hover:-translate-y-1">
                  <div className="relative flex h-full flex-col items-center rounded-[calc(1.4rem-2px)] bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_60%,#f8e9d2)] px-2 pb-5 pt-10 text-center">
                    <div className="pointer-events-none absolute inset-1 rounded-[1.2rem] border border-[var(--gold)]/40" aria-hidden="true" />
                    {/* medallion half outside the top edge */}
                    <span className="absolute left-1/2 top-0 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-b from-[#f7d77a] to-[#b8781c] p-[3px] shadow-[0_8px_18px_-6px_var(--maroon)]">
                      <span className="grid h-full w-full place-items-center rounded-full border-2 border-[var(--cream)] bg-[radial-gradient(circle_at_35%_30%,#9b2c1c,var(--maroon))] text-2xl text-[#f7d77a] transition-transform duration-700 group-hover:rotate-[360deg]">
                        <Icon name={q.icon} />
                      </span>
                    </span>
                    <p className="bg-gradient-to-b from-[var(--sindoor)] to-[var(--maroon)] bg-clip-text font-display text-4xl leading-none text-transparent sm:text-5xl">
                      {q.value}
                    </p>
                    <span className="mt-2 flex items-center gap-1.5 text-[var(--gold)]" aria-hidden="true">
                      <span className="h-px w-5 bg-[var(--gold)]/70" />
                      <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" />
                      <span className="h-px w-5 bg-[var(--gold)]/70" />
                    </span>
                    <p className="mt-2 text-sm font-semibold leading-tight text-[var(--maroon)] sm:text-base">{q.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-2 sm:px-6">
        <PhaseTimeline />
        <DayExplorer />
        <MilestoneStrip />
      </div>
    </section>
  );
}
