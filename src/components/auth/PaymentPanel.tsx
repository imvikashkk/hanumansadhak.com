'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { whatsappLink } from '@/data/site';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import { PRODUCT_NAME, type Plan, type PlanId } from '@/lib/sadhana';
import Icon from '../Icon';
import { AuthCard, FormError } from './AuthShell';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type PricedPlan = Plan & { fullPricePaise: number };

// How each plan looks on its ticket. Only what the plan really does (see PLANS in lib/sadhana.ts).
const TICKETS: Partial<
  Record<
    PlanId,
    {
      big: string;
      unit: string;
      small: string;
      title: string;
      line: string;
      days?: number;
    }
  >
> = {
  lifetime: {
    big: '∞',
    unit: 'जीवनभर',
    small: 'हमेशा के लिए',
    title: 'जीवनभर साधना',
    line: 'एक बार लें, जितनी बार चाहें दोहराएं',
  },
  yearly: {
    big: '365',
    unit: 'दिन',
    small: '1 साल',
    title: '1 साल एक्सेस',
    line: 'साल भर जितनी बार चाहें दोहराएं',
    days: 365,
  },
  full: {
    big: '40',
    unit: 'दिन',
    small: 'एक बार',
    title: '40 दिन साधना',
    line: '40 दिन की साधना, एक बार',
    days: 40,
  },
};

export default function PaymentPanel({
  user,
  plans,
  defaultPlan,
  currentPlanLabel,
}: {
  user: { name: string | null; phone: string };
  plans: PricedPlan[];
  defaultPlan?: PlanId;
  currentPlanLabel?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId | undefined>(defaultPlan);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login'); // only a paid account gets here, and that logs in rather than signs up
  }

  // Already on the top plan — nothing left to buy.
  if (!plans.length || !selected) {
    return (
      <AuthCard>
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember text-3xl text-[var(--primary-foreground)] shadow-glow">
            <Icon name="check" />
          </span>
          <h2 className="mt-4 font-display text-3xl text-[var(--maroon)]">
            आपकी साधना सक्रिय है
          </h2>
          <p className="mt-2 text-base text-[var(--maroon)]/75">
            आपके पास <strong>{currentPlanLabel ?? 'साधना'}</strong> प्लान है।
            साधना से जुड़ी किसी भी मदद के लिए WhatsApp करें।
          </p>
          <Link
            href="/sadhana"
            className="cta-shine mt-6 flex h-14 items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow"
          >
            <Icon name="play" /> साधना खोलें
          </Link>
          <a
            href={whatsappLink(
              'नमस्ते, मैंने हनुमान साधना जॉइन की है — मुझे आगे मार्गदर्शन चाहिए',
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 font-bold text-white"
          >
            <Icon name="whatsapp" /> WhatsApp पर बात करें
          </a>
          <button
            onClick={logout}
            className="mt-4 block w-full text-sm font-semibold text-[var(--maroon)]/60 underline"
          >
            Logout
          </button>
        </div>
      </AuthCard>
    );
  }

  const plan = plans.find((p) => p.id === selected)!;

  async function pay() {
    setError('');
    if (!scriptLoaded || !window.Razorpay) {
      setError('पेज लोड हो रहा है, कृपया कुछ सेकंड में फिर कोशिश करें');
      return;
    }
    setPaying(true);
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });
      const order = await res.json();
      if (!res.ok) {
        setError(order.error || 'ऑर्डर बनाने में समस्या हुई');
        setPaying(false);
        return;
      }
      track('InitiateCheckout', {
        ...PRODUCT_PARAMS,
        value: order.amount / 100,
        currency: 'INR',
        placement: 'payment',
      });

      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: PRODUCT_NAME,
        description: plan.label,
        prefill: { name: user.name || undefined, contact: user.phone },
        theme: { color: '#e3572b' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (!verifyRes.ok) {
            setError(
              'आपकी साधना शुरू करने में समस्या आई। अगर पैसे कट गए हैं तो चिंता न करें — हमें WhatsApp करें',
            );
            setPaying(false);
            return;
          }
          track('Purchase', {
            ...PRODUCT_PARAMS,
            value: order.amount / 100,
            currency: 'INR',
          });
          router.replace(
            `/thank-you?${new URLSearchParams({ txn: response.razorpay_payment_id, plan: plan.id })}`,
          );
        },
        modal: { ondismiss: () => setPaying(false) },
      }).open();
    } catch {
      setError('कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
      setPaying(false);
    }
  }

  const orderedPlans = [...plans].sort((a, b) => a.pricePaise - b.pricePaise);
  const yearly = plans.find((p) => p.id === 'yearly');
  // The ₹ gap to one year, offered only while the 40-day plan is the one selected.
  const yearlyGap =
    selected === 'full' && yearly
      ? (yearly.pricePaise - plan.pricePaise) / 100
      : 0;
  const forty = plans.find((p) => p.id === 'full');
  const yearlyExtra =
    yearly && forty ? (yearly.pricePaise - forty.pricePaise) / 100 : 0;
  const hours = Math.floor(secondsLeft / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((secondsLeft % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(secondsLeft % 60)
    .toString()
    .padStart(2, '0');

  return (
    <div className="mb-24 space-y-3 lg:mb-0 lg:mx-auto lg:max-w-5xl">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-[#fff1cf]/85">
        <span className="font-semibold">
          {user.name && <>{user.name} · </>}+91 {user.phone}
        </span>
        {currentPlanLabel ? (
          <button
            onClick={logout}
            className="min-h-9 font-semibold text-[var(--gold)] underline underline-offset-4"
          >
            दूसरे नंबर से Login करें
          </button>
        ) : (
          // Not paid yet: nothing is final, so back to the signup form with their details filled in.
          <Link
            href="/signup"
            className="flex min-h-9 items-center font-semibold text-[var(--gold)] underline underline-offset-4"
          >
            नंबर या नाम बदलें
          </Link>
        )}
      </div>
      {currentPlanLabel &&
        plans.some((p) => p.pricePaise !== p.fullPricePaise) && (
          <p className="text-sm text-[#fff1cf]/85">
            आपके पास <strong>{currentPlanLabel}</strong> है। अपग्रेड पर आपके
            प्लान का मूल्य घटाकर दाम दिखाया गया है।
          </p>
        )}

      <div className="rounded-xl border border-[var(--gold)]/45 bg-[var(--gold)]/10 px-3 py-2 text-center text-[#fffbe8]">
        <p className="text-sm font-semibold">
          अगले 24 घंटे तक विशेष मूल्य सक्रिय है
        </p>
        <p className="mt-0.5 font-display text-2xl tracking-wide text-[var(--gold)]">
          {hours}:{minutes}:{seconds}
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-2"
        role="radiogroup"
        aria-label="अपना प्लान चुनें"
      >
        {orderedPlans.map((p) => (
          <PlanTicket
            key={p.id}
            plan={p}
            on={p.id === selected}
            onSelect={() => setSelected(p.id)}
            ribbon={
              p.id === 'lifetime'
                ? '★ सर्वश्रेष्ठ'
                : p.id === 'yearly' && plans.length > 1
                  ? 'हमारा सुझाव'
                  : undefined
            }
            note={
              p.id === 'yearly' && yearlyExtra > 0
                ? `365 दिन के लिए दीपावली विशेष मूल्य — 40 दिन वाले से बस ₹${yearlyExtra} ज़्यादा`
                : undefined
            }
          />
        ))}
      </div>
      <p className="text-center text-sm text-[#fff1cf]/75">
        हर प्लान में: रोज़ का audio मार्गदर्शन · 40 दिन का ट्रैकर · साधना
        प्रमाणपत्र
      </p>

      {yearlyGap > 0 && (
        <button
          type="button"
          onClick={() => setSelected('yearly')}
          className="hero-in flex w-full items-center gap-3 rounded-2xl border border-[var(--gold)]/60 bg-[var(--gold)]/10 p-3 text-left text-[#fff1cf]"
        >
          <Icon name="sparkle" className="text-2xl text-[var(--gold)]" />
          <span className="min-w-0 flex-1 text-sm font-medium leading-snug">
            <strong className="block text-base text-[var(--gold)]">
              बस ₹{yearlyGap} और देकर पाएं पूरा 1 साल
            </strong>
            40 दिन सिर्फ एक बार नहीं — साल भर जितनी बार चाहें साधना दोहराएं
          </span>
          <span className="shrink-0 rounded-xl bg-ember px-3 py-2 text-sm font-bold text-[var(--primary-foreground)]">
            चुनें
          </span>
        </button>
      )}

      {error && <FormError>{error}</FormError>}

      {/* the pay button stays in reach, however long the plans run */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--gold)]/30 bg-[#3a140b]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:sticky lg:bottom-2 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <button
          onClick={pay}
          disabled={paying}
          className="cta-shine flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {paying ? (
            'कृपया प्रतीक्षा करें…'
          ) : (
            <>
              ₹{plan.pricePaise / 100} में साधना शुरू करें{' '}
              <Icon name="arrowRight" />
            </>
          )}
        </button>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm text-[#fff1cf]/75">
        <Icon name="lock" className="text-[var(--gold)]" /> Razorpay से 100%
        सुरक्षित · UPI · Card · Netbanking
      </p>
      <p className="text-center text-sm text-[#fff1cf]/75">
        कोई समस्या आ रही है?{' '}
        <a
          href={whatsappLink(
            'नमस्ते, मुझे साधना जॉइन करने में समस्या आ रही है',
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#7ee2a3] underline underline-offset-4"
        >
          WhatsApp पर मदद लें
        </a>
      </p>
    </div>
  );
}

// A ticket: a stub with the duration, a torn perforation with two notches, then the price.
function PlanTicket({
  plan,
  on,
  onSelect,
  ribbon,
  note,
}: {
  plan: PricedPlan;
  on: boolean;
  onSelect: () => void;
  ribbon?: string;
  note?: string;
}) {
  const t = TICKETS[plan.id];
  if (!t) return null;
  const rupees = plan.pricePaise / 100;
  const credited = plan.pricePaise !== plan.fullPricePaise;
  const best = plan.id === 'lifetime';
  const perDay =
    t.days && !credited
      ? `₹${Math.round((rupees / t.days) * 10) / 10}/दिन`
      : best
        ? 'एक बार, बस'
        : null;
  const notch =
    'absolute left-[5.75rem] z-10 h-4 w-4 -translate-x-1/2 rounded-full border bg-[var(--background)] sm:left-[7.5rem]';
  const notchBorder = on
    ? 'border-[#f7d77a]'
    : best
      ? 'border-[#f7d77a]/50'
      : 'border-white/15';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onSelect}
      className={`relative flex w-full rounded-2xl border text-left transition-shadow duration-300 ${
        on
          ? 'border-[#f7d77a] shadow-[0_0_34px_-8px_#f7d77a]'
          : best
            ? 'border-[#f7d77a]/70 shadow-[0_0_30px_-10px_#f7d77a]'
            : 'border-white/25'
      } ${best ? 'bg-[radial-gradient(ellipse_at_left,#94321b,#511a0e_80%)]' : 'bg-[#43170d]'}`}
    >
      {/* stub */}
      <span
        className={`flex w-[5.75rem] shrink-0 flex-col items-center justify-center rounded-l-[calc(1rem-1px)] px-1 py-3 text-center transition-colors duration-300 sm:w-[7.5rem] ${
          on
            ? 'bg-gradient-to-b from-[#fbe7a1] to-[#e3b04b] text-[var(--maroon)]'
            : best
              ? 'bg-[#f7d77a]/15 text-[#f7d77a]'
              : 'bg-white/[0.08] text-[#fffbe8]'
        }`}
      >
        <span
          className={`font-display leading-none ${best ? 'text-5xl' : 'text-4xl sm:text-5xl'}`}
        >
          {t.big}
        </span>
        <span className="mt-1 text-sm font-bold">{t.unit}</span>
        <span
          className={`text-xs font-medium ${on ? 'text-[var(--maroon)]/80' : 'text-[#fff1cf]/65'}`}
        >
          {t.small}
        </span>
      </span>

      {/* perforation */}
      <span
        className={`absolute inset-y-2 left-[5.75rem] border-l-2 border-dashed sm:left-[7.5rem] ${on ? 'border-[#f7d77a]/70' : 'border-white/15'}`}
        aria-hidden="true"
      />
      <span className={`${notch} ${notchBorder} -top-2`} aria-hidden="true" />
      <span
        className={`${notch} ${notchBorder} -bottom-2`}
        aria-hidden="true"
      />

      {/* price */}
      <span className="flex min-w-0 flex-1 items-center gap-2 py-3 pl-4 pr-3 sm:gap-3 sm:pl-5 sm:pr-4">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span
              className={`font-display text-[2rem] leading-none sm:text-4xl ${on || best ? 'text-[#f7d77a]' : 'text-[#fffbe8]'}`}
            >
              ₹{rupees}
            </span>
            {credited && (
              <span className="text-sm text-[#fff1cf]/55 line-through">
                ₹{plan.fullPricePaise / 100}
              </span>
            )}
            {credited && (
              <span className="text-xs font-bold text-[#7ee2a3]">
                अपग्रेड दाम
              </span>
            )}
          </span>
          <span className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-[#fffbe8] sm:text-base">
            {t.title}
            {perDay && (
              <span
                className={`text-sm font-semibold ${on || best ? 'text-[#f7d77a]' : 'text-[#fff1cf]/65'}`}
              >
                {perDay}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-[#fff1cf]/75 lg:[@media(max-height:820px)]:hidden">
            {t.line}
          </span>
          {note && (
            <span className="mt-2 block w-fit rounded-lg border border-[#f7d77a]/25 bg-black/20 px-2.5 py-1 text-[13px] font-semibold leading-snug text-[#f7d77a]">
              {note}
            </span>
          )}
        </span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-[#f7d77a]' : 'border-white/35'}`}
          aria-hidden="true"
        >
          {on && <span className="h-3.5 w-3.5 rounded-full bg-[#f7d77a]" />}
        </span>
      </span>

      {ribbon && (
        <span
          className={`absolute -top-2.5 right-3 z-10 rotate-[-2deg] px-2.5 py-0.5 text-xs font-bold shadow-[0_4px_10px_-3px_black] ${best ? 'bg-gradient-to-b from-[#fbe7a1] to-[#d9a43a] text-[var(--maroon)]' : 'bg-gradient-to-b from-[#e8472b] to-[#b5200f] text-white'}`}
        >
          {ribbon}
        </span>
      )}
    </button>
  );
}
