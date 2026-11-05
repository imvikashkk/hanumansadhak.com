import Icon from '@/components/Icon';

export default function Loading() {
  return (
    <div className="theme-cream grid min-h-dvh place-items-center bg-[var(--cream)] text-[var(--maroon)]" role="status">
      <div className="text-center">
        <Icon name="lotus" className="animate-float text-6xl text-[var(--sindoor)]" />
        <p className="mt-3 font-display text-2xl">जय श्री राम…</p>
      </div>
    </div>
  );
}
