'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { PHONE_RE } from '@/data/signup';
import Icon from '../Icon';
import { AuthCard, FormError, inputClass, labelClass } from './AuthShell';

// Login = mobile number → OTP (Fast2SMS) → session → the sadhana (which sends anyone without a plan to /payment).
export default function LoginForm({ next = '/sadhana' }: { next?: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [signupHint, setSignupHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  async function post(url: string, body: object) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json().catch(() => ({})) };
  }

  async function sendOtp(e?: FormEvent) {
    e?.preventDefault();
    setError('');
    setSignupHint(false);
    if (!PHONE_RE.test(phone)) return setError('कृपया सही 10 अंकों का मोबाइल नंबर डालें');
    setBusy(true);
    try {
      const { ok, data } = await post('/api/auth/send-otp', { phone });
      if (!ok) {
        setError(data.error || 'OTP भेजने में समस्या हुई');
        setSignupHint(!!data.signup);
        return;
      }
      setStep('otp');
      setCode('');
      setResendIn(data.resendAfter ?? 30);
    } catch {
      setError('नेटवर्क में समस्या है, कृपया फिर कोशिश करें');
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) return setError('कृपया 6 अंकों का OTP डालें');
    setBusy(true);
    try {
      const { ok, data } = await post('/api/auth/verify-otp', { phone, code });
      if (!ok) {
        setError(data.error || 'OTP गलत है');
        setBusy(false);
        return;
      }
      router.replace(next);
    } catch {
      setError('नेटवर्क में समस्या है, कृपया फिर कोशिश करें');
      setBusy(false);
    }
  }

  const button =
    'cta-shine flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100';

  return (
    <div className="space-y-3 lg:space-y-4">
      <AuthCard padding="p-4 lg:p-6">
        {step === 'phone' ? (
          <form onSubmit={sendOtp} noValidate className="space-y-5">
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
                  autoFocus
                  placeholder="रजिस्टर किया हुआ नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${inputClass} rounded-l-none`}
                />
              </div>
            </div>
            {error && (
              <FormError>
                {error}
                {signupHint && (
                  <Link href="/signup" className="ml-1 underline">
                    Signup करें →
                  </Link>
                )}
              </FormError>
            )}
            <button type="submit" disabled={busy} className={button}>
              {busy ? 'OTP भेजा जा रहा है…' : <>OTP भेजें <Icon name="arrowRight" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} noValidate className="space-y-5">
            <p className="text-base text-[var(--maroon)]/80">
              <strong className="text-[var(--maroon)]">+91 {phone}</strong> पर 6 अंकों का OTP भेजा गया है।{' '}
              <button type="button" onClick={() => { setStep('phone'); setError(''); }} className="font-semibold text-[var(--sindoor)] underline">
                नंबर बदलें
              </button>
            </p>
            <div>
              <label htmlFor="otp" className={labelClass}>OTP</label>
              <input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                placeholder="● ● ● ● ● ●"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`${inputClass} text-center text-2xl font-bold tracking-[0.5em]`}
              />
            </div>
            {error && <FormError>{error}</FormError>}
            <button type="submit" disabled={busy} className={button}>
              {busy ? 'जाँच हो रही है…' : <>Login करें <Icon name="arrowRight" /></>}
            </button>
            <p className="text-center text-sm text-[var(--maroon)]/70">
              OTP नहीं मिला?{' '}
              {resendIn > 0 ? (
                <span>{resendIn} सेकंड में दोबारा भेजें</span>
              ) : (
                <button type="button" disabled={busy} onClick={() => sendOtp()} className="font-semibold text-[var(--sindoor)] underline">
                  दोबारा भेजें
                </button>
              )}
            </p>
          </form>
        )}
      </AuthCard>

      <p className="flex min-h-11 items-center justify-center gap-1.5 text-center text-base text-[var(--muted-foreground)]">
        नए साधक हैं?
        <Link href="/signup" className="font-bold text-[var(--gold)] underline underline-offset-4">Signup करें</Link>
      </p>
    </div>
  );
}
