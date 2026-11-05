// Diya sparks drifting up from the bottom. Fixed pseudo-random values so
// server and client render the same sparks.
const SPARKS = Array.from({ length: 22 }, (_, i) => {
  const r = (n: number) => ((Math.sin((i + 77) * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: r(1) * 100,
    size: 2 + r(2) * 4,
    duration: 7 + r(3) * 8,
    delay: -r(4) * 15,
    drift: (r(5) - 0.5) * 120,
  };
});

export default function Embers({ className = 'absolute inset-0' }: { className?: string }) {
  return (
    <div className={`pointer-events-none overflow-hidden max-sm:[&>span:nth-child(2n)]:hidden ${className}`} aria-hidden="true">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="ember absolute bottom-0 rounded-full bg-[var(--gold)] shadow-[0_0_8px_2px_var(--primary)]"
          style={
            {
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              '--drift': `${s.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
