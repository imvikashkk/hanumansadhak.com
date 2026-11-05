'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/data/site';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import Icon from './Icon';

type Props = {
  // Where on the page the click came from — sent to Meta for comparing CTAs.
  placement: string;
  children?: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  // 'red' = the crimson pill used in the hero.
  tone?: 'ember' | 'red';
  className?: string;
};

const SIZES = {
  lg: 'h-16 px-10 text-lg sm:text-xl',
  md: 'h-14 px-8 text-base sm:text-lg',
  sm: 'h-11 px-5 text-sm',
};

const TONES = {
  ember: 'rounded-xl bg-ember shadow-glow text-[var(--primary-foreground)]',
  red: 'rounded-full bg-gradient-to-r from-[#ff3b30] via-[#e3122b] to-[#c4001f] text-white shadow-[0_12px_40px_-8px_#e3122b]',
};

export default function CheckoutButton({ placement, children, size = 'lg', tone = 'ember', className = '' }: Props) {
  return (
    <Link
      href={SITE.joinUrl}
      onClick={() => track('InitiateCheckout', { ...PRODUCT_PARAMS, placement })}
      className={`cta-shine inline-flex items-center justify-center gap-2 font-bold transition-transform hover:scale-[1.03] active:scale-[0.98] ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      {children ?? (
        <>
          <Icon name="flame" /> अभी साधना शुरू करें
        </>
      )}
      <Icon name="arrowRight" />
    </Link>
  );
}
