// Decoration for the light chandan-cream band: a marigold toran along the top,
// two slowly turning mandalas, soft saffron glows and falling marigold petals.
// Fixed pseudo-random values so server and client render the same petals.

// Marigolds strung along one swag of the toran (a curve dipping between two hooks).
const SWAG = Array.from({ length: 9 }, (_, i) => {
  const t = i / 8;
  return { x: 80 * t, y: 4 * (1 - t) ** 2 + 60 * (1 - t) * t + 4 * t ** 2 };
});

const PETALS = Array.from({ length: 14 }, (_, i) => {
  const r = (n: number) => ((Math.sin((i + 31) * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: r(1) * 100,
    size: 7 + r(2) * 7,
    duration: 14 + r(3) * 12,
    delay: -r(4) * 26,
    drift: (r(5) - 0.5) * 160,
    color: r(6) > 0.5 ? '#f59e0b' : '#ea580c',
  };
});

export function Toran() {
  return (
    <svg className="absolute inset-x-0 top-1 h-14 w-full drop-shadow-[0_3px_3px_rgb(120_40_10/0.25)]" aria-hidden="true">
      <defs>
        <pattern id="toran" width="80" height="56" patternUnits="userSpaceOnUse">
          <rect width="80" height="2.5" fill="#7c2d12" />
          {/* mango leaf hanging from the middle of each swag */}
          <path d="M40 30 Q47 41 40 54 Q33 41 40 30Z" fill="#4d7c0f" />
          <path d="M40 31 V52" stroke="#a3c25a" strokeWidth="0.8" />
          {SWAG.map(({ x, y }, i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4.6" fill="#f59e0b" />
              <circle cx={x} cy={y} r="2.6" fill="#ea580c" />
              <circle cx={x} cy={y} r="1" fill="#fde68a" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="56" fill="url(#toran)" />
    </svg>
  );
}

// The mandala's paths live once in MandalaDefs (rendered in the root layout); every
// Mandala is just a <use> of it — two dozen of them would otherwise add ~200 KB of SVG to the page.
export function MandalaDefs() {
  const ring = (count: number, d: string, step = 360 / count) =>
    Array.from({ length: count }, (_, i) => <path key={i} d={d} transform={`rotate(${i * step})`} />);
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <symbol id="mandala" viewBox="-100 -100 200 200">
        <g fill="none" stroke="currentColor" strokeWidth="0.7">
          <circle r="98" />
          <circle r="94" strokeDasharray="1.5 3" />
          {ring(24, 'M0 -92 C9 -78 9 -64 0 -56 C-9 -64 -9 -78 0 -92Z')}
          {Array.from({ length: 36 }, (_, i) => (
            <circle key={i} cx="0" cy="-74" r="1.1" fill="currentColor" stroke="none" transform={`rotate(${i * 10 + 5})`} />
          ))}
          <circle r="56" />
          {ring(16, 'M0 -56 Q13 -41 0 -28 Q-13 -41 0 -56Z')}
          <circle r="28" />
          {ring(12, 'M0 -28 Q6 -20 0 -12 Q-6 -20 0 -28Z')}
          <circle r="12" />
          <circle r="4" fill="currentColor" />
        </g>
      </symbol>
    </svg>
  );
}

export function Mandala({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden="true">
      <use href="#mandala" />
    </svg>
  );
}

// `fixedMandalas`: the two mandalas stay put on screen (like a fixed background) while the band scrolls.
export default function CreamDecor({ fixedMandalas = false }: { fixedMandalas?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* faint mandala tiling + saffron glows */}
      <div className="bg-mandala absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-[var(--primary)]/15 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[var(--gold)]/25 blur-3xl" />

      {/* clip-path keeps fixed mandalas inside this band */}
      <div className={`absolute inset-0 ${fixedMandalas ? '[clip-path:inset(0)]' : ''}`}>
        <div className={fixedMandalas ? 'absolute inset-0 lg:fixed' : 'absolute inset-0'}>
          {/* inline timing: .animate-spin-slow's shorthand would beat utility classes */}
          <Mandala
            className={`animate-spin-slow absolute -left-36 w-80 text-[var(--sindoor)] opacity-[0.12] sm:-left-40 sm:w-[30rem] ${fixedMandalas ? 'top-[calc(var(--banner-h)+var(--nav-h)-4rem)]' : 'top-28'}`}
            style={{ animationDuration: '90s' }}
          />
          <Mandala
            className="animate-spin-slow absolute -bottom-40 -right-40 w-96 text-[var(--maroon)] opacity-[0.1] sm:w-[36rem]"
            style={{ animationDuration: '120s', animationDirection: 'reverse' }}
          />
        </div>
      </div>

      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal absolute -top-6 rounded-[60%_0_60%_0] opacity-70 max-sm:[&:nth-child(2n)]:hidden"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}

      <Toran />
    </div>
  );
}

// A small gold curl for the card's corners; rotate it for each corner.
export function Corner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" className={`absolute h-9 w-9 text-[var(--gold)] ${className}`} aria-hidden="true">
      <path d="M3 37V16C3 8.8 8.8 3 16 3h21" />
      <path d="M8 37V18c0-5.5 4.5-10 10-10h19" strokeOpacity="0.55" />
      <path d="M14 24c0-5.5 4.5-10 10-10 3 0 5 2 5 4.5S27 23 24.5 23 21 21 21 19" />
      <circle cx="3" cy="37" r="1.6" fill="currentColor" />
      <circle cx="37" cy="3" r="1.6" fill="currentColor" />
    </svg>
  );
}
