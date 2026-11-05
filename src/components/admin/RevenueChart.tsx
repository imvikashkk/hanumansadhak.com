import { rupees } from './AdminShell';

interface Day { label: string; full: string; paise: string; sales: number }

// One series: a single hue, no legend, thin bars on a shared baseline. Each bar's day and amount
// show on hover or tap, and the table below carries the same numbers without relying on colour.
export default function RevenueChart({ days }: { days: Day[] }) {
  const max = Math.max(...days.map((d) => Number(d.paise)), 1);
  return (
    <figure>
      <p className="mb-1 text-xs tabular-nums text-[var(--maroon)]/70">ऊपरी रेखा: {rupees(max)}</p>
      <div className="relative h-44 border-b border-[var(--maroon)]/30">
        <span className="absolute inset-x-0 top-0 border-t border-dashed border-[var(--maroon)]/15" aria-hidden="true" />
        <ul className="absolute inset-0 flex items-end">
          {days.map((d, i) => (
            // tabIndex: focus is what shows the amount on touch screens
            <li key={d.full} tabIndex={0} className="group relative flex h-full flex-1 cursor-default items-end justify-center px-[1px] outline-none">
              <span
                className="block w-full max-w-5 rounded-t-[4px] bg-[var(--sindoor)] transition-opacity group-hover:opacity-80"
                style={{ height: Number(d.paise) ? `${Math.max((Number(d.paise) / max) * 100, 2)}%` : 0 }}
              />
              <span className={`pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg bg-[#2b0b06] px-2 py-1 text-xs text-[#fff1cf] group-hover:block group-focus:block ${i > days.length - 4 ? 'right-0' : i < 3 ? 'left-0' : 'left-1/2 -translate-x-1/2'}`}>
                {d.full}: <strong>{rupees(d.paise)}</strong> · {d.sales} बिक्री
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-1 flex text-[11px] tabular-nums text-[var(--maroon)]/65" aria-hidden="true">
        {days.map((d, i) => (
          <span key={d.full} className={`flex-1 text-center ${i % 2 === days.length % 2 ? 'max-sm:invisible' : ''}`}>{d.label}</span>
        ))}
      </div>
      <details className="mt-2 text-sm">
        <summary className="min-h-8 cursor-pointer font-semibold text-[var(--maroon)]/80">तालिका में देखें</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr className="text-xs text-[var(--maroon)]/70"><th className="py-1 font-semibold">दिन</th><th className="font-semibold">बिक्री</th><th className="text-right font-semibold">कमाई</th></tr></thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.full} className="border-t border-[var(--maroon)]/10 tabular-nums"><td className="py-1">{d.full}</td><td>{d.sales}</td><td className="text-right">{rupees(d.paise)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
