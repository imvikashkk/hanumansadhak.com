import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DarshanShell from '@/components/auth/DarshanShell';
import { AuthCard } from '@/components/auth/AuthShell';
import CheckoutButton from '@/components/CheckoutButton';
import Icon from '@/components/Icon';
import { SIGNUP_HERO } from '@/data/darshan';
import { findVerifiedSadhak } from '@/lib/certificate';
import { migrate } from '@/lib/migrate';
import { PRODUCT_NAME, SADHANA_DAYS } from '@/lib/sadhana';

// Public: where the QR code on a certificate leads. Kept out of search engines, since it names a person.
export const metadata: Metadata = {
  title: 'प्रमाणपत्र सत्यापन',
  robots: { index: false, follow: false },
};

export default async function SadhakPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await migrate();
  const sadhak = await findVerifiedSadhak(id);
  if (!sadhak) notFound();

  const completedOn = sadhak.completedAt.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const rows: [string, string][] = [
    ['मोबाइल', `+91 ${sadhak.phone}`],
    ['साधना', `${SADHANA_DAYS} दिवसीय ${PRODUCT_NAME}`],
    ['सम्पन्न तिथि', completedOn],
    ['प्रमाणपत्र ID', id],
  ];

  return (
    <DarshanShell
      page="sadhak"
      hero={SIGNUP_HERO}
      heroAlt="राम भक्त हनुमान जी"
      heroPosition="50% 18%"
      chaupai={['जय जय जय हनुमान गोसाईं', 'कृपा करहु गुरुदेव की नाईं']}
      ribbon="प्रमाणपत्र सत्यापन"
      ribbonIcon="shield"
      title={<span className="text-ember-flow">सत्यापित साधक</span>}
      sub={`इन्होंने ${SADHANA_DAYS} दिन की साधना पूर्ण की है।`}
    >
      <AuthCard>
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] text-3xl text-[var(--maroon)] shadow-[0_0_30px_-8px_var(--gold)]">
            <Icon name="check" />
          </span>
          <p className="mt-3 text-sm font-bold text-[var(--sindoor)]">यह प्रमाणपत्र मान्य है</p>
          <h2 className="mt-1 break-words font-display text-4xl leading-tight">{sadhak.name || 'हनुमान साधक'}</h2>
        </div>
        <dl className="mt-5 divide-y divide-[var(--maroon)]/10 border-y border-[var(--maroon)]/10">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-sm text-[var(--maroon)]/70">{label}</dt>
              <dd className="min-w-0 break-words text-right font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-center font-display text-lg text-[var(--sindoor)]">॥ मैं हूँ हनुमान साधक ॥</p>
      </AuthCard>

      <div className="mt-5 flex justify-center">
        <CheckoutButton placement="sadhak-verify" size="md" className="w-full">
          <Icon name="flame" /> आप भी अपनी साधना शुरू करें
        </CheckoutButton>
      </div>
    </DarshanShell>
  );
}
