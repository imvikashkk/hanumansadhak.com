import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeading } from '@/components/auth/AuthShell';
import Icon from '@/components/Icon';
import AppShell, { DarkCard, emberButton, GoldCard } from '@/components/sadhana/AppShell';
import RestartButton from '@/components/sadhana/RestartButton';
import SankalpPlayer from '@/components/sadhana/SankalpPlayer';
import UnlockCountdown from '@/components/sadhana/UnlockCountdown';
import { canPurchase, COOLDOWN_HOURS, PLAN_ORDER, PLANS, SADHANA_DAYS } from '@/lib/sadhana';
import { getSankalpTrack } from '@/lib/sadhana-content';
import { requireSadhana, type SadhanaState } from '@/lib/sadhana-state';

export const metadata: Metadata = {
  title: 'मेरी साधना',
  robots: { index: false },
};

const SHLOKA = '॥ राम काज कीन्हे बिनु, मोहि कहाँ बिश्राम ॥';

function ProgressRing({ done }: { done: number }) {
  const circumference = 2 * Math.PI * 52;
  const shown = Math.min(done, SADHANA_DAYS);
  return (
    <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="9" />
        <circle
          cx="60" cy="60" r="52" fill="none" stroke="#f7d77a" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / SADHANA_DAYS)}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="font-display text-5xl leading-none text-[#f7d77a]">{shown}</span>
        <span className="mt-1 text-sm">/ {SADHANA_DAYS} दिन</span>
      </div>
    </div>
  );
}

function TodayPanel({ state }: { state: SadhanaState }) {
  const { status, sub, tester, now } = state;
  const canRestart = tester || (!!sub && PLANS[sub.plan]?.canRestart);

  if (status.fullyComplete) {
    return (
      <>
        <p className="font-bold text-[#f7d77a]">जय बजरंगबली</p>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl">{SADHANA_DAYS} दिन पूरे!</h2>
        <p className="mt-2 text-[#fff1cf]/85">हनुमान जी की कृपा आप पर सदा बनी रहे। अपना प्रमाणपत्र देखें।</p>
        <div className="mt-4 space-y-3">
          <Link href="/sadhana/certificate" className={emberButton}>
            <Icon name="certificate" /> प्रमाणपत्र देखें
          </Link>
          {canRestart && <RestartButton />}
        </div>
      </>
    );
  }

  if (status.planComplete) {
    return (
      <>
        <h2 className="font-display text-3xl sm:text-4xl">आपके {status.dayLimit} दिन पूरे हुए!</h2>
        <p className="mt-2 text-[#fff1cf]/85">साधना जारी रखने के लिए अपना प्लान अपग्रेड करें।</p>
        <Link href="/payment" className={`${emberButton} mt-4`}>
          <Icon name="star" /> प्लान अपग्रेड करें
        </Link>
      </>
    );
  }

  const left = status.dayLimit - status.totalCompleted;
  return (
    <>
      <p className="font-bold text-[#f7d77a]">आज की स्तुति</p>
      <h2 className="mt-1 font-display text-4xl sm:text-5xl">दिन {status.nextDay}</h2>
      {status.nextLocked ? (
        <UnlockCountdown unlockAt={status.unlockAt} now={now} hours={COOLDOWN_HOURS} />
      ) : (
        <Link href={`/sadhana/day/${status.nextDay}`} className={`${emberButton} cta-pulse mt-4`}>
          <Icon name="play" /> आज की स्तुति शुरू करें
        </Link>
      )}
      <p className="mt-3 text-sm text-[#fff1cf]/75">{left} दिन और बाकी — हर दिन ज़रूर करें।</p>
    </>
  );
}

function DayChart({ state }: { state: SadhanaState }) {
  const { status, tester } = state;

  return (
    <GoldCard>
      <h2 className="flex items-center gap-2 font-display text-2xl sm:text-3xl">
        <Icon name="calendar" className="text-[var(--sindoor)]" /> {SADHANA_DAYS} दिन का चार्ट
      </h2>
      <ul className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 sm:gap-2.5">
        {Array.from({ length: SADHANA_DAYS }, (_, i) => i + 1).map((day) => {
          const done = status.completedDays.has(day);
          const isNext = day === status.nextDay && !status.nextLocked;
          const beyondPlan = !tester && day > status.dayLimit;
          const cell = 'grid h-14 place-items-center rounded-xl text-lg font-bold';
          let content;
          if (beyondPlan && !done) {
            content = (
              <Link href="/payment" aria-label={`दिन ${day} — अपग्रेड करें`} className={`${cell} day-locked`}>
                <Icon name="star" />
              </Link>
            );
          } else if (status.canOpen(day)) {
            content = (
              <Link href={`/sadhana/day/${day}`} aria-label={`दिन ${day}${done ? ' — पूरा हुआ' : ''}`} className={`${cell} ${done ? 'day-done' : isNext ? 'day-next' : 'day-locked'}`}>
                {done ? (
                  <span className="grid place-items-center leading-none">
                    <Icon name="check" className="text-base" />
                    <span className="mt-0.5 text-xs">{day}</span>
                  </span>
                ) : (
                  day
                )}
              </Link>
            );
          } else {
            content = (
              <span aria-label={`दिन ${day} — लॉक है`} className={`${cell} day-locked`}>
                <span className="grid place-items-center leading-none">
                  <Icon name="lock" className="text-sm" />
                  <span className="mt-0.5 text-xs font-semibold">{day}</span>
                </span>
              </span>
            );
          }
          return <li key={day}>{content}</li>;
        })}
      </ul>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-[var(--maroon)]/80">
        <span className="flex items-center gap-1.5"><span className="day-done h-4 w-4 rounded" /> पूरा हुआ</span>
        <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded border-2 border-[var(--sindoor)] bg-[#fff8e6]" /> आज का दिन</span>
        <span className="flex items-center gap-1.5"><span className="day-locked h-4 w-4 rounded" /> लॉक है</span>
        {status.dayLimit < SADHANA_DAYS && !tester && (
          <span className="flex items-center gap-1.5"><Icon name="star" /> अपग्रेड करें</span>
        )}
      </div>
    </GoldCard>
  );
}

function PlanCard({ state }: { state: SadhanaState }) {
  const { sub, tester } = state;
  if (tester || !sub) {
    return <p className="text-center text-sm font-bold text-[var(--maroon)]/70">Tester खाता — सभी दिन खुले हैं</p>;
  }
  const expires = sub.expires_at
    ? new Date(sub.expires_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : null;
  const canUpgrade = PLAN_ORDER.some((p) => canPurchase(p, sub));
  return (
    <GoldCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--maroon)]/70">आपका प्लान</p>
          <p className="font-display text-2xl leading-tight">{PLANS[sub.plan]?.label ?? sub.plan}</p>
          <p className="text-sm text-[var(--maroon)]/70">{expires ? `${expires} तक` : 'कोई समय सीमा नहीं'}</p>
        </div>
        {canUpgrade && (
          <Link href="/payment" className="flex min-h-12 items-center gap-1.5 rounded-xl border-2 border-[var(--sindoor)] px-4 font-bold text-[var(--sindoor)]">
            <Icon name="star" /> अपग्रेड करें
          </Link>
        )}
      </div>
    </GoldCard>
  );
}

export default async function SadhanaPage() {
  const state = await requireSadhana('/sadhana');
  const { user, status } = state;

  return (
    <AppShell>
      <PageHeading
        ribbon={SHLOKA}
        ribbonIcon="lotus"
        title={
          <>
            जय श्री राम, <span className="text-[var(--sindoor)]">{user.name || 'साधक'}</span>
          </>
        }
      />

      <div className="mt-8 space-y-5">
        <DarkCard>
          <div className="flex flex-col items-center gap-5 p-5 text-center sm:flex-row sm:gap-8 sm:p-8 sm:text-left">
            <ProgressRing done={status.totalCompleted} />
            <div className="w-full min-w-0">
              <TodayPanel state={state} />
            </div>
          </div>
        </DarkCard>

        <SankalpPlayer track={getSankalpTrack()} urgent={status.totalCompleted === 0} />
        <DayChart state={state} />
        <PlanCard state={state} />
      </div>
    </AppShell>
  );
}
