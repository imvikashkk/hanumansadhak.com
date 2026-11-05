'use client';

import Image from 'next/image';
import logo from '@/assets/hanuman_sadhak_logo.png';
import { useEffect, useState } from 'react';
import { SITE, whatsappLink } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import Icon, { type IconName } from './Icon';

// Short, true reasons to start — rotated in the oval pill above the bar. No false urgency.
const NUDGES: { icon: IconName; text: string }[] = [
  { icon: 'clock', text: 'रोज़ सिर्फ 10 मिनट — घर बैठे' },
  { icon: 'star', text: `${SITE.rating} रेटिंग · ${SITE.devotees} साधक जुड़े` },
  { icon: 'headphones', text: 'हर दिन नया audio मार्गदर्शन' },
  { icon: 'book', text: 'चालीसा, संकल्प और 108 राम नाम जप' },
  { icon: 'mobile', text: 'मोबाइल पर कहीं भी, कभी भी सुनें' },
  { icon: 'certificate', text: '40वें दिन आपके नाम का प्रमाणपत्र' },
  { icon: 'users', text: 'देश-विदेश के साधक परिवार से जुड़ें' },
  { icon: 'pray', text: 'आज संकल्प लें, कल से नहीं' },
];
const NUDGE_MS = 3000;

// Mobile: a bottom bar with the CTA once the hero button scrolls away, with a rotating
// oval nudge on top. Desktop: a floating WhatsApp help button.
export default function StickyCTA() {
  const [show, setShow] = useState(false);
  const [nudge, setNudge] = useState(0);

  // Rotate only while the bar is on screen.
  useEffect(() => {
    if (!show) return;
    const t = window.setInterval(() => setNudge((n) => (n + 1) % NUDGES.length), NUDGE_MS);
    return () => window.clearInterval(t);
  }, [show]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 sm:hidden ${show ? 'translate-y-0' : 'translate-y-[calc(100%+1rem)]'}`}
      >
        {/* oval nudge pill, half over the bar's top edge */}
        <div className="relative z-10 -mb-3.5 flex justify-center px-6" aria-live="polite">
          <p className="flex h-7 max-w-full items-center overflow-hidden rounded-full border border-[#f7d77a]/60 bg-gradient-to-b from-[#9b2c1c] to-[#5a1208] px-4 text-[12px] font-semibold text-[#fff1cf] shadow-[0_6px_16px_-6px_black,0_0_14px_-4px_#f7d77a]">
            <span key={nudge} className="ticker-in flex items-center gap-1.5 whitespace-nowrap">
              <Icon name={NUDGES[nudge].icon} className="shrink-0 text-[13px] text-[#f7d77a]" />
              {NUDGES[nudge].text}
            </span>
          </p>
        </div>
        {/* gold hairline + soft glow along the top edge */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" aria-hidden="true" />
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,oklch(0.42_0.15_34),oklch(0.3_0.11_30)_60%,oklch(0.24_0.09_28))] px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_30px_-10px_rgb(0_0_0/0.7)]">
          <div className="bg-mandala pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative flex items-center gap-2.5">
            {/* the logo carries its own gold ring */}
            <Image src={logo} alt={SITE.nameEn} sizes="44px" className="h-11 w-11 shrink-0 rounded-full drop-shadow-[0_0_10px_rgb(247_215_122/0.45)]" />
            <div className="min-w-0 shrink leading-tight">
              <p className="truncate font-display text-[0.95rem] text-[#fff1cf]">हनुमान साधक</p>
              <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-[var(--gold)]">
                <Icon name="star" className="text-[10px]" /> {SITE.rating} · {SITE.devotees}
              </p>
            </div>
            {/* the main action: takes all the room that's left */}
            <CheckoutButton placement="sticky" tone="red" size="md" className="ml-auto h-[3.25rem] min-w-0 flex-1 !gap-1.5 !px-3 text-[1.05rem]">
              <Icon name="flame" /> साधना शुरू करें
            </CheckoutButton>
          </div>
        </div>
      </div>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-5 font-bold text-white shadow-xl transition-transform hover:scale-105 sm:flex"
        aria-label="WhatsApp पर मदद लें"
      >
        <Icon name="whatsapp" className="text-2xl" /> मदद
      </a>
    </>
  );
}
