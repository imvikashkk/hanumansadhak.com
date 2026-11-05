import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/auth/AuthShell';
import Certificate from '@/components/Certificate';
import Icon from '@/components/Icon';
import AppShell, { emberButton, GoldCard } from '@/components/sadhana/AppShell';
import CertificateActions from '@/components/sadhana/CertificateActions';
import { SITE } from '@/data/site';
import { issueCertificate } from '@/lib/certificate';
import { SADHANA_DAYS } from '@/lib/sadhana';
import { loadSadhana, planExpired } from '@/lib/sadhana-state';

export const metadata: Metadata = {
  title: 'प्रमाणपत्र',
  robots: { index: false },
};

export default async function CertificatePage() {
  const state = await loadSadhana('/sadhana/certificate');
  const { user, progress, status } = state;
  const expired = planExpired(state);
  // Plan over and the 40 days not finished: a new plan comes first.
  if (expired && !status.fullyComplete) redirect('/payment');

  if (!status.fullyComplete) {
    const left = SADHANA_DAYS - status.totalCompleted;
    return (
      <AppShell>
        <PageHeading ribbon="साधना पूर्णता प्रमाणपत्र" ribbonIcon="medal" title={<>अभी <span className="text-[var(--sindoor)]">{left} दिन</span> बाकी हैं</>} />
        <GoldCard className="mt-8">
          <div className="text-center">
            <p className="font-display text-5xl text-[var(--sindoor)]">{status.totalCompleted} / {SADHANA_DAYS}</p>
            <div className="mx-auto mt-3 h-3 max-w-sm overflow-hidden rounded-full bg-[var(--maroon)]/15">
              <div className="h-full rounded-full bg-ember" style={{ width: `${(status.totalCompleted / SADHANA_DAYS) * 100}%` }} />
            </div>
            <p className="mt-4 text-[var(--maroon)]/80">{SADHANA_DAYS} दिन पूरे होने पर आपके नाम का प्रमाणपत्र यहीं मिलेगा।</p>
            <Link href="/sadhana" className={`${emberButton} mt-5`}>
              <Icon name="play" /> साधना पर वापस जाएं
            </Link>
          </div>
        </GoldCard>
      </AppShell>
    );
  }

  const name = user.name || `+91 ${user.phone}`;
  const lastDone = Math.max(...progress.map((p) => new Date(p.completed_at).getTime()));
  const sadhakCode = await issueCertificate(user.id, new Date(lastDone));
  const completedOn = new Date(lastDone).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

  return (
    <AppShell expired={expired ? 'finished' : undefined}>
      <div className="print:hidden">
        <PageHeading ribbon="साधना सम्पन्न" ribbonIcon="medal" title={<>बधाई हो, <span className="text-[var(--sindoor)]">{name}</span></>} sub={`आपने ${SADHANA_DAYS} दिन की साधना पूरी की। यह रहा आपका प्रमाणपत्र।`} />
      </div>
      <div id="certificate" className="mt-8 print:mt-0">
        <Certificate
          name={name}
          completedOn={completedOn}
          qrValue={`https://${SITE.domain}/sadhak/${sadhakCode}`}
        />
      </div>
      <CertificateActions />
      {expired && (
        <p className="mt-4 rounded-2xl border border-[var(--maroon)]/15 bg-white/60 px-4 py-3 text-center text-sm print:hidden">
          आपका प्लान समाप्त हो गया है, पर यह प्रमाणपत्र हमेशा आपका है। साधना दोबारा करनी हो तो{' '}
          <Link href="/payment" className="font-bold text-[var(--sindoor)] underline">प्लान नवीनीकरण करें</Link>।
        </p>
      )}
      <p className="mt-4 text-center text-sm text-[var(--maroon)]/70 print:hidden">
        डाउनलोड में “Save as PDF” चुनें। नाम बदलना हो तो <Link href="/profile" className="font-bold underline">प्रोफ़ाइल</Link> में जाएं।
      </p>
    </AppShell>
  );
}
