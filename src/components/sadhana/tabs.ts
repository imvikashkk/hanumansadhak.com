import type { IconName } from '../Icon';

// In their own module because server components (AppShell, profile) read these too, and a
// value imported from a 'use client' file reaches the server only as an opaque reference.
export const HELP_TEXT = 'नमस्ते, मुझे हनुमान साधना के बारे में मदद चाहिए';

// How a plan that has run out left things: decides which links still lead anywhere.
export type PlanOver = 'finished' | 'unfinished';

export const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: '/sadhana', label: 'साधना', icon: 'grid' },
  { href: '/sadhana/certificate', label: 'प्रमाणपत्र', icon: 'certificate' },
  { href: '/profile', label: 'प्रोफ़ाइल', icon: 'user' },
];
