import { hasSrc, TESTIMONIAL_VIDEOS } from '@/data/media';
import CreamDecor from './CreamDecor';
import Icon from './Icon';
import { Reveal } from './Reveal';
import StoriesPlayer from './StoriesPlayer';

// "हमारे साधकों की सच्ची कहानियाँ" — a full-width chandan-cream band: one big video with its
// quote, and a rail of the other stories. Server-rendered so CreamDecor's petals don't hydrate
// (their Math.sin positions can differ in the last digit between Node and the browser).
export default function VideoTestimonials() {
  const stories = hasSrc(TESTIMONIAL_VIDEOS);
  if (stories.length === 0) return null;

  return (
    <section
      id="anubhav"
      className="theme-cream relative isolate scroll-mt-16 overflow-hidden text-[var(--maroon)]"
      aria-labelledby="stories-heading"
    >
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[var(--cream)] to-[var(--cream-deep)]" aria-hidden="true" />
      <CreamDecor />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-ember" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
        {/* heading — maroon ribbon, two-tone title, lotus divider */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
            <Icon name="play" className="text-[#f7d77a]" /> भक्तों के अनुभव
          </span>
          <h2 id="stories-heading" className="mt-4 font-display text-[2.3rem] leading-tight text-[var(--maroon)] [text-shadow:0_2px_16px_rgb(255_250_240/0.9)] sm:text-6xl">
            हमारे साधकों की <span className="text-[var(--sindoor)]">सच्ची कहानियाँ</span>
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-[var(--primary)]" aria-hidden="true">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
            <Icon name="lotus" className="text-xl" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-[var(--maroon)]/85 sm:text-lg">
            देखिए कैसे इस साधना ने हज़ारों लोगों के जीवन में सकारात्मक बदलाव लाया
          </p>
        </Reveal>

        <StoriesPlayer stories={stories} />
      </div>
    </section>
  );
}
