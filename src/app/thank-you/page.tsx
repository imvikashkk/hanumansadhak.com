import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell, { AuthCard } from '@/components/auth/AuthShell';
import Icon from '@/components/Icon';
import { whatsappLink } from '@/data/site';
import { isValidPlan, PLANS } from '@/lib/sadhana';

export const metadata: Metadata = {
  title: 'धन्यवाद',
  robots: { index: false },
};

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ txn?: string; plan?: string }> }) {
  const { txn, plan } = await searchParams;

  return (
    <AuthShell
      ribbon="साधना आरंभ"
      ribbonIcon="sparkle"
      title={
        <>
          आप अब <span className="text-[var(--sindoor)]">हनुमान साधक</span> हैं
        </>
      }
      sub="आपकी साधना सक्रिय हो गई है। हनुमान जी की कृपा आप पर सदा बनी रहे।"
    >
      <AuthCard>
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember text-3xl text-[var(--primary-foreground)] shadow-glow">
            <Icon name="check" />
          </span>
          <p className="mt-4 font-display text-2xl text-[var(--sindoor)]">॥ जय श्री राम ॥</p>
          {isValidPlan(plan) && (
            <p className="mt-2 text-base">
              प्लान: <strong>{PLANS[plan].label}</strong>
            </p>
          )}
          {txn && <p className="mt-1 text-sm text-[var(--maroon)]/60">Payment ID: {txn}</p>}
          <Link
            href="/sadhana"
            className="cta-shine mt-6 flex h-14 items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow"
          >
            <Icon name="play" /> साधना शुरू करें
          </Link>
          <p className="mt-5 text-base text-[var(--maroon)]/80">किसी भी सवाल के लिए हमसे WhatsApp पर जुड़ें।</p>
          <a
            href={whatsappLink(`नमस्ते, मैंने हनुमान साधना जॉइन की है${txn ? ` (Payment ID: ${txn})` : ''}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 font-bold text-white"
          >
            <Icon name="whatsapp" /> WhatsApp पर जुड़ें
          </a>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
