'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import sankatmochan from '@/assets/Sankatmochan-Hanuman-Ji.png';
import { GENDERS, MAX_AGE, MIN_AGE, PHONE_RE, SANKALP_QUESTIONS, type GenderId } from '@/data/signup';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import Icon from '../Icon';
import { AuthCard, FormError, inputClass, labelClass } from './AuthShell';

// Warm chandan-saffron surface shared by both signup steps.
const CHANDAN = 'bg-[radial-gradient(ellipse_at_top,#fdeccb,#f8d9a4_60%,#efc184)]';

export default function SignupForm({
  draft,
}: {
  // What they filled in last time, when they come back before paying.
  draft?: { phone: string; name: string | null; age: number | null; gender: string | null; city: string | null };
}) {
  const router = useRouter();
  const [phone, setPhone] = useState(draft?.phone ?? '');
  const [name, setName] = useState(draft?.name ?? '');
  const [age, setAge] = useState(draft?.age ? String(draft.age) : '');
  const [gender, setGender] = useState<GenderId | ''>(GENDERS.find((g) => g.id === draft?.gender)?.id ?? '');
  const [city, setCity] = useState(draft?.city ?? '');
  const [sankalp, setSankalp] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loginHint, setLoginHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 1 = परिचय, 2 = संकल्प — split so the page stays short on phones.
  const [step, setStep] = useState<1 | 2>(1);

  const allTaken = SANKALP_QUESTIONS.every((q) => sankalp[q.id]);

  const ageNum = Number(age);

  function goTo(next: 1 | 2) {
    setError('');
    setLoginHint(false);
    setStep(next);
    // Only as far as needed to show the form: a screen that already fits it stays put.
    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoginHint(false);

    if (step === 1) {
      if (!PHONE_RE.test(phone)) return setError('कृपया सही 10 अंकों का मोबाइल नंबर डालें');
      if (!name.trim()) return setError('कृपया अपना नाम डालें');
      if (!Number.isInteger(ageNum) || ageNum < MIN_AGE || ageNum > MAX_AGE) return setError(`उम्र ${MIN_AGE} से ${MAX_AGE} के बीच होनी चाहिए`);
      if (!gender) return setError('कृपया लिंग चुनें');
      if (!city.trim()) return setError('कृपया अपना शहर डालें');
      return goTo(2);
    }
    if (!allTaken) return setError('साधक बनने के लिए सभी संकल्प स्वीकार करें');

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, age: ageNum, gender, city, sankalp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
        setLoginHint(!!data.login);
        setSubmitting(false);
        return;
      }
      track('CompleteRegistration', PRODUCT_PARAMS);
      router.replace('/payment');
    } catch {
      setError('नेटवर्क में समस्या है, कृपया फिर कोशिश करें');
      setSubmitting(false);
    }
  }

  return (
    <form id="signup-form" onSubmit={submit} noValidate className="scroll-mt-4 space-y-3 lg:space-y-4">
      <Steps step={step} onBack={() => goTo(1)} />

      {step === 1 ? (
        <AuthCard surface={CHANDAN} padding="p-4 lg:p-5">
          <h2 className="font-display text-xl text-[var(--maroon)] lg:text-2xl">आपका परिचय</h2>
          {/* soft ivory fields, so the chandan card doesn't end in bright white boxes */}
          <div className="mt-3 space-y-3 [&_input]:border-[var(--maroon)]/25 [&_input]:bg-[#fff8e8]">
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              <div>
                <label htmlFor="phone" className={labelClass}>मोबाइल नंबर</label>
                <div className="flex">
                  <span className="grid h-12 place-items-center rounded-l-xl border border-r-0 border-[var(--maroon)]/20 bg-[var(--cream-deep)] px-3 text-base font-semibold">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="10 अंकों का नंबर"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`${inputClass} rounded-l-none`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className={labelClass}>नाम</label>
                <input id="name" autoComplete="name" maxLength={100} placeholder="आपका पूरा नाम" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
              <div>
                <label htmlFor="age" className={labelClass}>उम्र</label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={MIN_AGE}
                  max={MAX_AGE}
                  placeholder="वर्ष"
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>शहर</label>
                <input id="city" autoComplete="address-level2" maxLength={100} placeholder="जैसे: वाराणसी" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>लिंग</legend>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <label
                    key={g.id}
                    className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border text-base font-semibold transition ${
                      gender === g.id
                        ? 'border-[var(--sindoor)] bg-[var(--sindoor)] text-white shadow-[0_10px_20px_-12px_var(--sindoor)]'
                        : 'border-[var(--maroon)]/25 bg-[#fff8e8] hover:border-[var(--sindoor)]/60'
                    }`}
                  >
                    <input type="radio" name="gender" value={g.id} checked={gender === g.id} onChange={() => setGender(g.id)} className="sr-only" />
                    {g.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </AuthCard>
      ) : (
        <SankalpCard sankalp={sankalp} onToggle={(id, on) => setSankalp((s) => ({ ...s, [id]: on }))} />
      )}

      {error && (
        <FormError>
          {error}
          {loginHint && (
            <Link href="/login" className="ml-1 underline">
              Login करें →
            </Link>
          )}
        </FormError>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cta-shine flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {submitting ? (
          'कृपया प्रतीक्षा करें…'
        ) : step === 1 ? (
          <>
            आगे बढ़ें — संकल्प लें <Icon name="arrowRight" />
          </>
        ) : (
          <>
            <Icon name="flame" /> साधक बनें और आगे बढ़ें <Icon name="arrowRight" />
          </>
        )}
      </button>
      {step === 2 && (
        <button type="button" onClick={() => goTo(1)} className="block min-h-11 w-full text-center text-sm font-semibold text-[#fff1cf]/80 underline">
          ← परिचय बदलें
        </button>
      )}

      {step === 1 && (
        <p className="flex min-h-11 items-center justify-center gap-1.5 text-center text-base text-[var(--muted-foreground)]">
          पहले से साधक हैं?
          <Link href="/login" className="font-bold text-[var(--gold)] underline underline-offset-4">Login करें</Link>
        </p>
      )}
    </form>
  );
}

function Steps({ step, onBack }: { step: 1 | 2; onBack: () => void }) {
  const items = ['आपका परिचय', 'साधक का संकल्प'];
  return (
    <ol className="flex items-center gap-2" aria-label={`चरण ${step} / 2`}>
      {items.map((label, i) => {
        const n = (i + 1) as 1 | 2;
        const done = n < step;
        const current = n === step;
        return (
          <li key={label} className="contents">
            {i > 0 && <span className={`h-0.5 flex-1 rounded-full ${step > 1 ? 'bg-[var(--gold)]' : 'bg-white/20'}`} aria-hidden="true" />}
            <button
              type="button"
              onClick={done ? onBack : undefined}
              disabled={!done}
              aria-current={current ? 'step' : undefined}
              className={`flex items-center gap-2 text-sm font-bold ${current || done ? 'text-[#fff1cf]' : 'text-[#fff1cf]/50'} ${done ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-sm ${
                  current ? 'border-[var(--gold)] bg-ember text-[var(--primary-foreground)] shadow-glow' : done ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--maroon)]' : 'border-white/30 bg-white text-[var(--maroon)]'
                }`}
              >
                {done ? <Icon name="check" /> : n}
              </span>
              {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';
const toDevanagari = (n: number) => String(n).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);

// Step 2 — a chandan "mandir" panel, kept short: each sankalp is one row (question beside its
// button from sm up), and one diya per sankalp lights up as it is taken.
function SankalpCard({ sankalp, onToggle }: { sankalp: Record<string, boolean>; onToggle: (id: string, on: boolean) => void }) {
  const taken = SANKALP_QUESTIONS.filter((q) => sankalp[q.id]).length;
  // The first sankalp not yet taken gets a soft pulse, so it's clear what to tap next.
  const nextId = SANKALP_QUESTIONS.find((q) => !sankalp[q.id])?.id;
  return (
    <div className="rounded-[1.6rem] bg-gradient-to-b from-[#fbe7a1] via-[#d9a43a] to-[#8a5a12] p-[2px] shadow-[0_30px_60px_-35px_var(--maroon)]">
      <div className={`relative overflow-hidden rounded-[calc(1.6rem-2px)] ${CHANDAN} p-3.5 text-[var(--maroon)] sm:p-5`}>
        <div className="bg-mandala pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        {/* heading: Hanuman ji beside the title */}
        <div className="relative flex items-center gap-3 sm:gap-4">
          <span className="block shrink-0 rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] p-[2px] shadow-[0_0_20px_-4px_#b8781c]">
            <Image src={sankatmochan} alt="संकटमोचन हनुमान जी" width={80} height={80} className="h-14 w-14 rounded-full object-cover object-top sm:h-16 sm:w-16" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-2xl leading-tight sm:text-3xl">साधक का संकल्प</h2>
            <p className="mt-0.5 text-sm font-medium leading-snug text-[var(--maroon)]/85">हनुमान जी के सामने मन से लें — हर संकल्प पर टैप करें</p>
          </div>
        </div>

        <ul className="relative mt-3 space-y-2">
          {SANKALP_QUESTIONS.map((q, i) => {
            const checked = !!sankalp[q.id];
            return (
              <li key={q.id}>
                <label
                  className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition duration-300 sm:px-3 ${
                    checked
                      ? 'border-[var(--sindoor)]/60 bg-[#fff8e8] shadow-[0_10px_24px_-14px_var(--sindoor)]'
                      : `border-[var(--maroon)]/20 bg-[#fff8e8]/70 hover:border-[var(--sindoor)]/50 ${q.id === nextId ? 'sankalp-nudge' : ''}`
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={(e) => onToggle(q.id, e.target.checked)} className="peer sr-only" />
                  {/* medallion: number → gold check once taken */}
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px] transition duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--sindoor)] ${
                      checked ? 'bg-gradient-to-b from-[#fffbe8] to-[#c98a1f] shadow-[0_0_16px_-4px_#b8781c]' : 'bg-gradient-to-b from-[#d9a43a] to-[#8a5a12]'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`grid h-full w-full place-items-center rounded-full font-display text-lg transition duration-300 ${
                        checked ? 'bg-gradient-to-b from-[#f7d77a] to-[#d9a43a] text-[var(--maroon)]' : 'bg-[radial-gradient(circle_at_35%_30%,#7c2414,#3a0d06)] text-[#f7d77a]'
                      }`}
                    >
                      {checked ? <Icon name="check" /> : toDevanagari(i + 1)}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="block flex-1 text-base font-medium leading-snug">{q.text}</span>
                    {/* looks like a button so it's obvious the row is tappable */}
                    <span
                      className={`inline-flex min-h-9 w-fit shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-bold transition duration-300 ${
                        checked
                          ? 'border-transparent bg-[var(--sindoor)] text-white shadow-[0_6px_16px_-8px_var(--sindoor)]'
                          : 'border-[var(--sindoor)]/50 bg-white/70 text-[var(--sindoor)] group-hover:bg-white'
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 place-items-center rounded border-2 text-[10px] ${checked ? 'border-white bg-white text-[var(--sindoor)]' : 'border-[var(--sindoor)]'}`}
                        aria-hidden="true"
                      >
                        {checked && <Icon name="check" />}
                      </span>
                      {checked ? 'संकल्प लिया' : 'हाँ, मेरा संकल्प है'}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* one diya per sankalp, lit as each is taken */}
        <div className="relative mt-3 flex items-center justify-center gap-3">
          <div className="flex items-end gap-2" aria-hidden="true">
            {SANKALP_QUESTIONS.map((q) => {
              const lit = !!sankalp[q.id];
              return (
                <span key={q.id} className="flex flex-col items-center">
                  <Icon
                    name="flame"
                    className={`text-base transition duration-500 ${lit ? 'diya-flicker text-[#e4570f] drop-shadow-[0_0_8px_#ffb547]' : 'text-[var(--maroon)]/25'}`}
                  />
                  <span className={`-mt-0.5 h-2 w-6 rounded-b-full transition ${lit ? 'bg-gradient-to-b from-[#d9a43a] to-[#8a5a12]' : 'bg-[var(--maroon)]/15'}`} />
                </span>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-[var(--maroon)]/85">
            {taken === SANKALP_QUESTIONS.length ? 'सभी दीप प्रज्वलित — जय श्री राम' : `${toDevanagari(taken)} / ${toDevanagari(SANKALP_QUESTIONS.length)} संकल्प लिए`}
          </p>
        </div>
      </div>
    </div>
  );
}
