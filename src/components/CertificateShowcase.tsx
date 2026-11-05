'use client';

import { useState } from 'react';
import Certificate from './Certificate';
import CheckoutButton from './CheckoutButton';
import Icon, { type IconName } from './Icon';
import { Reveal } from './Reveal';

const POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'certificate', title: 'आपके नाम के साथ', text: '40वें दिन की साधना पूरी होते ही आपका व्यक्तिगत प्रमाणपत्र तैयार' },
  { icon: 'mobile', title: 'Download और Print', text: 'मोबाइल में सहेजें, print करवाकर घर के मंदिर में रखें' },
  { icon: 'users', title: 'परिवार के साथ साझा करें', text: 'WhatsApp पर भेजें — दूसरों को भी साधना की प्रेरणा मिले' },
];

// Interactive half of CertificateSection: heading, the live certificate preview and the
// "type your name" box (shared state, so both live in this client component).
export default function CertificateShowcase() {
  const [name, setName] = useState('');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_0_24px_-6px_var(--gold)]">
          <Icon name="medal" className="text-[#f7d77a]" /> पूर्णता का सम्मान
        </span>
        <h2 id="certificate-heading" className="mt-4 font-display text-[2.1rem] leading-tight sm:text-5xl">
          40 दिन पूरे — अब आप <span className="text-ember">हनुमान साधक</span>
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2 text-[var(--gold)]" aria-hidden="true">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
          <Icon name="lotus" className="text-xl" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>
        <p className="mt-3 text-base text-[var(--muted-foreground)] sm:text-lg">
          साधना पूरी करने पर मिलता है आपके नाम का <strong className="text-[var(--foreground)]">साधना पूर्णता प्रमाणपत्र</strong>
        </p>
      </Reveal>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-[var(--gold)]/20 blur-3xl" aria-hidden="true" />
          <Certificate name={name} tilted />
        </Reveal>

        <div>
          <Reveal>
            <label htmlFor="cert-name" className="block font-display text-2xl text-[var(--gold)]">
              अपना नाम लिखकर देखें
            </label>
            <div className="relative mt-3">
              <Icon name="sparkle" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)]" />
              <input
                id="cert-name"
                value={name}
                maxLength={28}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम"
                autoComplete="name"
                className="h-14 w-full rounded-2xl border border-[var(--gold)]/40 bg-black/30 pl-11 pr-4 text-lg text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">ऐसा दिखेगा आपका प्रमाणपत्र — 40वें दिन आपके नाम के साथ।</p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 90} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] text-xl text-[var(--maroon)] shadow-[0_0_20px_-6px_var(--gold)]">
                  <Icon name={p.icon} />
                </span>
                <span>
                  <span className="block font-display text-xl">{p.title}</span>
                  <span className="block text-base text-[var(--muted-foreground)]">{p.text}</span>
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-8 flex justify-center lg:justify-start">
            <CheckoutButton placement="certificate" size="md">
              <Icon name="flame" /> आज ही साधना शुरू करें
            </CheckoutButton>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
