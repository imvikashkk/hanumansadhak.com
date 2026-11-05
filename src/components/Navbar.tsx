import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/hanuman_sadhak_logo_2.png';
import { SITE } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import Icon, { type IconName } from './Icon';
import MobileMenu from './MobileMenu';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center ${className}`} aria-label={`${SITE.name} — होम`}>
      {/* the logo already carries the name + tagline */}
      <Image src={logo} alt={SITE.nameEn} sizes="120px" priority className="h-11 w-auto drop-shadow-[0_4px_14px_rgb(0_0_0/0.6)] sm:h-[4.5rem]" />
    </Link>
  );
}

const NAV_LINKS = [
  { href: '#parichay', label: 'परिचय' },
  { href: '#phal', label: 'मनोकामनाएं' },
  { href: '#yatra', label: '40 दिन की यात्रा' },
  { href: '#faq', label: 'प्रश्न' },
];

const NAV_STATS: { icon: IconName; value: string; label: string; className?: string }[] = [
  { icon: 'users', value: SITE.devotees, label: 'साधक' },
  { icon: 'star', value: `${SITE.rating}/5`, label: 'रेटिंग' },
  { icon: 'shield', value: '100%', label: 'सुरक्षित', className: 'max-[400px]:hidden' },
];

// Sticks just under the fixed announcement banner. Signup and login have no banner and no
// sections of their own (nor does payment): `page` pins it to the top, points the links back at the homepage and
// drops the button for the page you're already on.
export default function Navbar({ page }: { page?: 'signup' | 'login' | 'payment' | 'sadhak' }) {
  const links = page ? NAV_LINKS.map((l) => ({ ...l, href: `/${l.href}` })) : NAV_LINKS;
  return (
    <header data-site-header className={`sticky ${page ? 'top-0' : 'top-[var(--banner-h)]'} z-30 border-b transition-transform duration-300 border-[var(--gold)]/15 bg-gradient-to-b from-black/95 to-[#1a0604]/95 shadow-[0_10px_30px_-15px_black] lg:from-black/80 lg:to-[#1a0604]/75 lg:backdrop-blur-md`}>
      <div className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 2xl:max-w-[90rem]">
        <Logo />

        {/* phones: one compact trust chip fills the middle (the full stats need tablet width) */}
        <p className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--gold)]/35 bg-gradient-to-b from-white/10 to-white/[0.03] px-3 py-1.5 text-[13px] leading-none shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:hidden">
          <span className="flex items-center gap-1 font-bold text-[var(--gold)]">
            <Icon name="star" className="text-xs" /> {SITE.rating}
          </span>
          <span className="h-3.5 w-px bg-white/20" aria-hidden="true" />
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Icon name="users" className="text-xs text-[var(--primary)]" />
            <span className="font-bold">{SITE.devotees}</span>
            <span className="text-[var(--muted-foreground)] max-[350px]:hidden">साधक</span>
          </span>
        </p>

        <nav aria-label="मुख्य" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="group relative rounded-full px-3 py-2 text-[15px] font-medium text-[var(--foreground)]/85 transition-colors hover:text-[var(--gold)]"
                >
                  {label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {/* tablets + wide screens get the trust stats (phones see them in the bottom bar); the in-between desktop width only has room for the links */}
          <ul className="hidden items-center sm:flex lg:hidden xl:flex">
            {NAV_STATS.map(({ icon, value, label, className = '' }, i) => (
              <li
                key={label}
                className={`flex items-center gap-1.5 px-2.5 sm:gap-2 sm:px-4 ${i > 0 ? 'border-l border-white/15' : ''} ${className}`}
              >
                <Icon name={icon} className="text-base text-[var(--primary)] sm:text-lg" />
                <span className="leading-tight">
                  <span className="block text-[13px] font-bold text-[var(--foreground)] sm:text-[15px]">{value}</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)] sm:text-xs">{label}</span>
                </span>
              </li>
            ))}
          </ul>
          {page !== 'login' && page !== 'payment' && (
            <Link href="/login" className="hidden items-center gap-1.5 text-[15px] font-bold text-[var(--gold)] hover:underline lg:flex">
              <Icon name="lock" /> Login
            </Link>
          )}
          {/* wrapped: the button's own inline-flex would override `hidden` */}
          {page !== 'signup' && page !== 'payment' && (
            <div className="hidden lg:block">
              <CheckoutButton placement="navbar" tone="red" size="sm">
                जॉइन करें
              </CheckoutButton>
            </div>
          )}
          <MobileMenu links={links} page={page} />
        </div>
      </div>
      {/* thin gold glow along the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent" />
    </header>
  );
}
