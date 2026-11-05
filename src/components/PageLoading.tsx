import Icon from './Icon';

// Shown the instant a page is opened, while its data comes from the server. Same dark ground as
// the pages that use it, so nothing flashes.
export default function PageLoading() {
  return (
    <div role="status" className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_top,oklch(0.36_0.12_34),oklch(0.25_0.085_30)_70%)] text-[#f7d77a]">
      <div className="text-center">
        <Icon name="lotus" className="animate-float text-5xl" />
        <p className="mt-2 font-display text-2xl">जय श्री राम…</p>
      </div>
    </div>
  );
}
