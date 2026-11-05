import Image, { type StaticImageData } from 'next/image';
import childrenFamily from '@/assets/Children-and-Family-Blessings.png';
import education from '@/assets/Education-and-Examinations.png';
import familyPeace from '@/assets/Family-Peace.png';
import health from '@/assets/Health-and-Wellness.png';
import homeProperty from '@/assets/Home-and-Property.png';
import jobCareer from '@/assets/Job-and-Career.png';
import marriage from '@/assets/Marriage-and-Marital-Life.png';
import protection from '@/assets/Protection-from-Fear-and-Dangers.png';
import wealthBusiness from '@/assets/Wealth-and-Business.png';
import { Corner, Mandala, Toran } from './CreamDecor';
import CheckoutButton from './CheckoutButton';
import Icon, { type IconName } from './Icon';
import ParallaxImage from './ParallaxImage';
import diye from '../../public/images/bg/diye.jpg';
import { Reveal } from './Reveal';

// "साधना का फल" — the wishes devotees bring to this sadhana, each paired with the
// Hanuman Chalisa line it rests on. No numbers or promises: faith and regularity, in the Chalisa's own words.
const WISHES: { icon: IconName; title: string; text: string; chaupai: string; image: StaticImageData }[] = [
  {
    icon: 'briefcase',
    title: 'नौकरी व करियर',
    image: jobCareer,
    text: 'अटके काम, रुकी तरक्की, नई नौकरी की तलाश — कठिन राह भी सरल होने लगती है।',
    chaupai: 'दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥',
  },
  {
    icon: 'coins',
    title: 'धन व व्यापार',
    image: wealthBusiness,
    text: 'आर्थिक तंगी, कर्ज़ और व्यापार की चिंता — घर में बरकत और स्थिरता का भाव।',
    chaupai: 'अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥',
  },
  {
    icon: 'heart',
    title: 'विवाह व दांपत्य',
    image: marriage,
    text: 'विवाह में देरी या रिश्तों में दूरी — मन की इस इच्छा को भी प्रभु के चरणों में रखिए।',
    chaupai: 'और मनोरथ जो कोई लावै। सोइ अमित जीवन फल पावै॥',
  },
  {
    icon: 'baby',
    title: 'संतान सुख',
    image: childrenFamily,
    text: 'संतान की कामना और बच्चों का उज्ज्वल भविष्य — श्रद्धा से माँगी गई हर प्रार्थना।',
    chaupai: 'सब सुख लहै तुम्हारी सरना। तुम रच्छक काहू को डरना॥',
  },
  {
    icon: 'health',
    title: 'स्वास्थ्य व आरोग्य',
    image: health,
    text: 'अपनी या परिवार की सेहत की चिंता — मन को बल और हिम्मत मिलती है।',
    chaupai: 'नासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥',
  },
  {
    icon: 'graduation',
    title: 'विद्या व परीक्षा',
    image: education,
    text: 'पढ़ाई में एकाग्रता, परीक्षा का डर, प्रतियोगिता की तैयारी — बुद्धि और धैर्य का आशीर्वाद।',
    chaupai: 'बल बुधि बिद्या देहु मोहिं। हरहु कलेस बिकार॥',
  },
  {
    icon: 'family',
    title: 'पारिवारिक शांति',
    image: familyPeace,
    text: 'घर के झगड़े, मनमुटाव और तनाव — परिवार में प्रेम और सामंजस्य लौटता है।',
    chaupai: 'संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥',
  },
  {
    icon: 'shield',
    title: 'भय व संकट से रक्षा',
    image: protection,
    text: 'अनजाना डर, बुरे सपने, नकारात्मकता — संकटमोचन की शरण में निर्भयता।',
    chaupai: 'भूत पिसाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥',
  },
  {
    icon: 'house',
    title: 'घर व संपत्ति',
    image: homeProperty,
    text: 'अपने घर का सपना, ज़मीन-जायदाद के विवाद — घर पर प्रभु की छत्रछाया।',
    chaupai: 'राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥',
  },
];

// Card outline in a 100×100 box (stretched to the card): pointed temple arch with a
// scalloped shoulder each side, rounded foot. Used for the clip and the gold hairlines.
const ARCH =
  'M0 98 L0 20 C0 15 3 13 7 13 C9 9 13 8 16 9 C26 9 36 6 44 2 Q50 -1 56 2 C64 6 74 9 84 9 C87 8 91 9 93 13 C97 13 100 15 100 20 L100 98 Q100 100 97 100 L3 100 Q0 100 0 98 Z';

function ArchDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <clipPath id="phal-arch" clipPathUnits="objectBoundingBox">
          <path d={ARCH} transform="scale(0.01)" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Small gold kalash crowning the arch's point.
function Kalash() {
  return (
    <svg viewBox="0 0 40 46" className="h-11 w-10 drop-shadow-[0_3px_6px_rgb(0_0_0/0.45)]" aria-hidden="true">
      <defs>
        <linearGradient id="phal-kalash" x1="0" x2="1">
          <stop offset="0" stopColor="#b77a14" />
          <stop offset="0.45" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b77a14" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="4.5" r="3.5" fill="url(#phal-kalash)" />
      <path d="M20 8c-3 3-4 5-4 7h8c0-2-1-4-4-7z" fill="url(#phal-kalash)" />
      <rect x="13" y="15" width="14" height="3" rx="1.5" fill="#c8901e" />
      <path d="M12 18h16c4 4 6 9 6 13 0 6-6 10-14 10S6 37 6 31c0-4 2-9 6-13z" fill="url(#phal-kalash)" stroke="#8a5a12" strokeWidth="0.6" />
      <path d="M9 28h22" stroke="#8a5a12" strokeWidth="0.8" strokeDasharray="2 1.6" />
      <rect x="11" y="41" width="18" height="3.5" rx="1.7" fill="#c8901e" />
    </svg>
  );
}

export default function PhalSection() {
  return (
    <section
      id="phal"
      className="relative isolate scroll-mt-16 overflow-hidden bg-[radial-gradient(ellipse_at_top,oklch(0.36_0.13_32),oklch(0.24_0.09_28)_55%,oklch(0.17_0.06_28))] pb-20 pt-28 sm:pb-24 sm:pt-32"
      aria-labelledby="phal-heading"
    >
      {/* backdrop: gold lattice at the edges, two great mandalas, warm glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* rows of lit diyas, fixed behind the section and steeped in maroon */}
        <ParallaxImage src={diye} className="opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.12_32/0.55),oklch(0.2_0.08_28/0.62)_55%,oklch(0.14_0.05_28/0.85))]" />
        <div className="bg-mandala absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_30%,black)]" />
        <div className="absolute left-1/2 top-0 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-[var(--gold)]/15 blur-[110px]" />
        <Mandala
          className="animate-spin-slow absolute -left-60 top-1/4 w-[32rem] text-[var(--gold)] opacity-[0.12]"
          style={{ animationDuration: '150s' }}
        />
        <Mandala
          className="animate-spin-slow absolute -right-60 bottom-0 w-[32rem] text-[var(--gold)] opacity-[0.12]"
          style={{ animationDuration: '180s', animationDirection: 'reverse' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0" aria-hidden="true">
        <Toran />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-[var(--gold)]/80" />
        <span className="grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)]/70 bg-[oklch(0.17_0.06_28)] text-[var(--gold)]">
          <Icon name="lotus" />
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--gold)]/60 to-[var(--gold)]/80" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* heading */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_0_24px_-6px_var(--gold)]">
            <Icon name="lotus" className="text-[#f7d77a]" /> साधना का फल
          </span>
          <h2 id="phal-heading" className="mt-5 font-display leading-[1.05] [text-shadow:0_4px_24px_rgb(0_0_0/0.55)]">
            <span className="block text-2xl text-[#fff1cf]/90 sm:text-3xl">आपकी कौन-सी</span>
            {/* the key word in burnished gold, glowing like a diya */}
            <span className="relative mt-1 block">
              <span className="absolute inset-x-[15%] top-1/2 h-1/2 -translate-y-1/2 rounded-full bg-[#f7d77a]/25 blur-3xl" aria-hidden="true" />
              <span className="relative bg-gradient-to-b from-[#fffbe8] via-[#f7d77a] to-[#c98a1f] bg-clip-text text-[3.4rem] text-transparent [filter:drop-shadow(0_3px_0_#7a3410)_drop-shadow(0_10px_24px_rgb(0_0_0/0.5))] sm:text-7xl xl:text-[5.5rem]">
                मनोकामनाएं
              </span>
            </span>
            <span className="mt-1 flex items-center justify-center gap-3 text-2xl text-[#fff1cf] sm:text-4xl">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#f7d77a] sm:w-16" aria-hidden="true" />
              होंगी पूर्ण?
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#f7d77a] sm:w-16" aria-hidden="true" />
            </span>
          </h2>

          {/* the promise, framed: the chaupai on its own, then a line of context */}
          <div className="mx-auto mt-8 max-w-2xl rounded-[1.6rem] bg-gradient-to-r from-[#b8781c] via-[#f7d77a] to-[#b8781c] p-px shadow-[0_24px_50px_-30px_black]">
            <div className="relative overflow-hidden rounded-[calc(1.6rem-1px)] bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.11_32/0.92),oklch(0.18_0.06_28/0.92))] px-5 py-5 backdrop-blur-sm sm:px-9 sm:py-6">
              <div className="bg-mandala pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
              <Icon name="quote" className="relative mx-auto text-2xl text-[#f7d77a]/70" />
              <p className="relative mt-2 font-display text-xl leading-snug text-[#f7d77a] sm:text-[1.7rem]">
                और मनोरथ जो कोई लावै।
                <br />
                सोइ अमित जीवन फल पावै॥
              </p>
              <div className="relative mt-3 flex items-center justify-center gap-2 text-[var(--gold)]" aria-hidden="true">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
                <Icon name="lotus" className="text-lg" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]" />
              </div>
              <p className="relative mt-3 text-base leading-relaxed text-[#fff1cf]/85 sm:text-lg">
                जो भी मनोरथ लेकर भक्त प्रभु के पास आता है, वह जीवन का अमित फल पाता है। 40 दिन की इस साधना में आप अपनी मनोकामना{' '}
                <strong className="font-semibold text-[#f7d77a]">संकल्प के साथ प्रभु के चरणों</strong> में रखते हैं।
              </p>
            </div>
          </div>
        </Reveal>

        <ArchDefs />
        {/* nine wishes — a swipeable row on phones, a grid from tablets up */}
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-4 [scrollbar-width:none] sm:mx-auto sm:mt-14 sm:grid sm:max-w-6xl sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 sm:overflow-visible sm:p-0 lg:grid-cols-3">
          {WISHES.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 90} className="h-full w-[82%] shrink-0 snap-center sm:w-auto">
              {/* temple shikhar-arch in a gold frame; drop-shadow (not box-shadow) so the glow follows the shape */}
              <div className="group relative h-full pt-6 transition-all duration-500 [filter:drop-shadow(0_24px_30px_rgb(0_0_0/0.45))] hover:-translate-y-1.5 hover:[filter:drop-shadow(0_24px_30px_rgb(0_0_0/0.45))_drop-shadow(0_0_18px_rgb(247_215_122/0.45))]">
                <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                  <Kalash />
                </span>
                <div className="h-full bg-gradient-to-b from-[#ffe9a8] via-[#d9a43a] to-[#b8781c] p-[3px] [clip-path:url(#phal-arch)]">
                <div className="relative flex h-full flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#fdf0da_0%,#f9dfb8_55%,#f1c48f_100%)] px-6 pb-7 pt-7 text-center [clip-path:url(#phal-arch)]">
                  {/* gold hairlines tracing the same outline, inset */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
                    <path d={ARCH} transform="translate(2.5 1.8) scale(0.95 0.966)" fill="none" stroke="#d9a43a" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                    <path d={ARCH} transform="translate(4.5 3.4) scale(0.91 0.934)" fill="none" stroke="#f7d77a" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="bg-mandala pointer-events-none absolute inset-0 opacity-90 [mask-image:linear-gradient(to_bottom,transparent_40%,black)]" aria-hidden="true" />
                  <Corner className="bottom-1.5 left-1.5" />
                  <Corner className="bottom-1.5 right-1.5 -scale-x-100" />

                  {/* photo filling the arch's crown, masked so it melts into the card (a colour overlay left a seam on hover-zoom) */}
                  <div className="relative -mx-6 -mt-7 aspect-[1/0.85] w-[calc(100%+3rem)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
                    <Image src={w.image} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 80vw" className="photo-zoom object-cover object-[50%_20%]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--maroon)]/10 to-transparent" />
                    {/* number on a small gold seal */}
                    <span className="absolute left-1/2 top-[22%] grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-[#f7d77a] bg-[var(--maroon)]/85 font-display text-xs text-[#f7d77a] backdrop-blur-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* medallion over the photo's lower edge, a slow mandala halo behind it */}
                  <div className="relative -mt-16 grid h-28 w-28 place-items-center">
                    <Mandala
                      className="animate-spin-slow absolute inset-0 w-full text-[var(--sindoor)] opacity-30"
                      style={{ animationDuration: '60s' }}
                    />
                    <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-gradient-to-b from-[#f7d77a] to-[#b8781c] p-[3px] shadow-[0_12px_26px_-10px_var(--maroon)]">
                      <span className="grid h-full w-full place-items-center rounded-full border-2 border-[#fbe8c8] bg-[radial-gradient(circle_at_35%_30%,#a8321f,var(--maroon))] text-3xl text-[#f7d77a] transition-transform duration-700 group-hover:rotate-[360deg]">
                        <Icon name={w.icon} />
                      </span>
                    </span>
                  </div>

                  <h3 className="font-display text-[1.7rem] leading-tight text-[var(--maroon)]">{w.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-[var(--primary)]" aria-hidden="true">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                    <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" />
                    <Icon name="lotus" className="text-base" />
                    <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" />
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]" />
                  </div>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-[var(--maroon)]/80">{w.text}</p>

                  {/* the Chalisa line this wish rests on — a maroon ribbon with lotus end-caps */}
                  <div className="relative mt-5 w-full px-3">
                    <p className="rounded-2xl border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-5 py-2.5 font-display text-[0.95rem] leading-snug text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_22px_-14px_var(--maroon)]">
                      {/* two half-lines of the chaupai */}
                      {w.chaupai.split('। ').map((half, j, all) => (
                        <span key={j} className="block">
                          {half}
                          {j < all.length - 1 ? '।' : ''}
                        </span>
                      ))}
                    </p>
                    {['-left-0.5', '-right-0.5'].map((pos) => (
                      <span
                        key={pos}
                        className={`absolute ${pos} top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)] bg-[#fbe3bd] text-base text-[var(--sindoor)]`}
                        aria-hidden="true"
                      >
                        <Icon name="lotus" />
                      </span>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-2 flex items-center justify-center gap-2 text-xs text-[#fff1cf]/60 sm:hidden">
          <Icon name="arrowRight" className="rotate-180" /> स्वाइप करके सभी 9 मनोकामनाएं देखें <Icon name="arrowRight" />
        </p>

        {/* honest note + CTA */}
        <Reveal className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm leading-relaxed text-[#fff1cf]/65">
            यह साधना श्रद्धा, भक्ति और नियम का मार्ग है। फल प्रभु की कृपा, आपके भाव और कर्म पर निर्भर करता है — हम किसी परिणाम की गारंटी
            नहीं देते, बस आपको हर दिन सही विधि से साधना कराते हैं।
          </p>
          <CheckoutButton placement="phal" tone="red" className="mt-7 w-full max-w-sm whitespace-nowrap max-sm:!px-5 max-sm:!text-base">
            अपनी मनोकामना का संकल्प लें
          </CheckoutButton>
        </Reveal>
      </div>
    </section>
  );
}
