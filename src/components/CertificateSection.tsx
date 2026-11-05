import { HERO_BG } from '@/data/media';
import CertificateShowcase from './CertificateShowcase';
import { Mandala } from './CreamDecor';
import Embers from './Embers';
import ParallaxImage from './ParallaxImage';

// "40 दिन पूरे — अब आप हनुमान साधक". The backdrop is server-rendered: Embers' Math.sin
// positions could differ in the last digit between Node and the browser if hydrated.
export default function CertificateSection() {
  return (
    <section id="certificate" className="relative isolate scroll-mt-16 overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-24" aria-labelledby="certificate-heading">
      {/* the whole backdrop fades out at the bottom so it melts into the page */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" aria-hidden="true">
        {/* Hanuman ji fixed behind the section, steeped in maroon */}
        <ParallaxImage src={HERO_BG.src} className="object-[50%_30%] opacity-30 saturate-[0.8]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.11_32/0.72),oklch(0.18_0.07_28/0.88)_55%,oklch(0.13_0.05_28/0.97))]" />
        <div className="bg-mandala absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,transparent_35%,black)]" />

        {/* divine rays turning slowly behind the certificate */}
        <div className="absolute left-1/2 top-[38%] aspect-square w-[64rem] -translate-x-1/2 -translate-y-1/2 lg:left-[31%] lg:top-[58%]">
          <div
            className="animate-spin-slow absolute inset-0 rounded-full bg-[repeating-conic-gradient(from_0deg,rgb(247_215_122/0.16)_0deg_5deg,transparent_5deg_15deg)] [mask-image:radial-gradient(circle,black_8%,transparent_62%)]"
            style={{ animationDuration: '140s' }}
          />
          <div className="absolute inset-[30%] rounded-full bg-[var(--gold)]/25 blur-[90px]" />
        </div>

        <Mandala className="animate-spin-slow absolute -right-52 -top-24 w-[30rem] text-[var(--gold)] opacity-[0.1]" style={{ animationDuration: '170s' }} />
        <Mandala
          className="animate-spin-slow absolute -bottom-40 -left-52 w-[28rem] text-[var(--gold)] opacity-[0.08]"
          style={{ animationDuration: '200s', animationDirection: 'reverse' }}
        />
        <Embers className="absolute inset-0 [mask-image:linear-gradient(to_top,black_35%,transparent)]" />
        {/* thin gold rule where the cream journey band ends */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />
      </div>

      <CertificateShowcase />
    </section>
  );
}
