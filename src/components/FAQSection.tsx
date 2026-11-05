import { FAQS } from '@/data/content';
import { whatsappLink } from '@/data/site';
import Icon from './Icon';
import { Reveal } from './Reveal';
import SectionHeading from './SectionHeading';

export default function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-16 px-4 pb-20 sm:px-6" aria-labelledby="faq-heading">
      <SectionHeading id="faq-heading" eyebrow="सवाल & जवाब">
        आपके मन में <span className="text-ember">सवाल हैं?</span>
      </SectionHeading>

      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 50}>
            <details className="group rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 open:border-[var(--primary)]/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="chevronDown" className="text-[var(--primary)] transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-base leading-relaxed text-[var(--muted-foreground)]">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center">
        <a
          href={whatsappLink('नमस्ते, हनुमान साधना के बारे में मेरा एक सवाल है')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[#25D366]/50 px-5 py-3 font-semibold text-[#25D366] transition hover:bg-[#25D366]/10"
        >
          <Icon name="whatsapp" className="text-xl" /> और सवाल? WhatsApp पर पूछें
        </a>
      </Reveal>
    </section>
  );
}
