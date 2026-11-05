import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/hanuman_sadhak_logo.png';

// What the landing page's sample certificate encodes.
const QR_PLACEHOLDER = 'Before Verification Please Complete 40 days Hanuman Sadhana';

// Everything is sized in container units (cqw) so the whole certificate scales as one piece.
// Gold frame → maroon band → gold rule → parchment; the brand logo sits faintly behind the text.
export default function Certificate({
  name,
  completedOn,
  qrValue = QR_PLACEHOLDER,
  tilted = false,
}: {
  name: string;
  // Shown under the signature on a sadhak's real certificate; the landing preview has none.
  completedOn?: string;
  qrValue?: string;
  tilted?: boolean;
}) {
  const shown = name.trim() || 'आपका नाम';
  return (
    <div className={`@container relative mx-auto w-full max-w-3xl ${tilted ? 'rotate-[-1.2deg] transition-transform duration-700 hover:rotate-0' : ''}`}>
      <div className="relative aspect-[1.414/1] rounded-[1.4cqw] bg-gradient-to-br from-[#fbe7a1] via-[#b8781c] to-[#fbe7a1] p-[0.6cqw] shadow-[0_40px_90px_-30px_black,0_0_60px_-20px_#f7d77a]">
        {/* maroon band with a gold bead line */}
        <div className="relative h-full rounded-[1cqw] bg-[radial-gradient(ellipse_at_top,#7c2414,#4a0f08)] p-[1.3cqw]">
          <div className="pointer-events-none absolute inset-[0.65cqw] rounded-[0.7cqw] border-[0.15cqw] border-dotted border-[#f7d77a]/70" aria-hidden="true" />
          <div className="h-full rounded-[0.6cqw] bg-gradient-to-br from-[#fbe7a1] via-[#c98a1f] to-[#fbe7a1] p-[0.3cqw]">
            <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[0.4cqw] bg-[radial-gradient(ellipse_at_center,#fffcf3,#fbf0d8_55%,#f0d9ae)] px-[6cqw] pb-[3.8cqw] pt-[2.2cqw] text-center text-[var(--maroon)]">
              {/* parchment texture, watermark, inner rule, corners */}
              <div className="bg-mandala pointer-events-none absolute inset-0 opacity-40 [filter:sepia(1)_saturate(2)]" aria-hidden="true" />
              <Image src={logo} alt="" sizes="400px" className="pointer-events-none absolute left-1/2 top-1/2 w-[46cqw] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] [filter:sepia(1)]" />
              <div className="pointer-events-none absolute inset-[1cqw] border-[0.12cqw] border-[#b8781c]/50" aria-hidden="true" />
              <CertCorner className="left-[0.6cqw] top-[0.6cqw]" />
              <CertCorner className="right-[0.6cqw] top-[0.6cqw] rotate-90" />
              <CertCorner className="bottom-[0.6cqw] right-[0.6cqw] rotate-180" />
              <CertCorner className="bottom-[0.6cqw] left-[0.6cqw] -rotate-90" />

              {/* crest */}
              <span className="relative rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#9c6413] p-[0.35cqw] shadow-[0_0_2.5cqw_-0.5cqw_#d9a43a]">
                <Image src={logo} alt="" sizes="96px" className="h-[8cqw] w-[8cqw] rounded-full" />
              </span>
              <p className="relative mt-[0.5cqw] text-[1.25cqw] font-bold tracking-[0.5em] text-[#9c6413]">HANUMAN SADHAK</p>

              <h3 className="relative mt-[0.6cqw] bg-gradient-to-b from-[#7c2414] to-[#3a0d06] bg-clip-text font-display text-[4.8cqw] leading-none text-transparent [filter:drop-shadow(0_0.15cqw_0_#e3b04b)]">
                साधना पूर्णता प्रमाणपत्र
              </h3>
              {/* ribbon */}
              <span className="relative mt-[1cqw] inline-flex items-center">
                <span className="h-[2.6cqw] w-[1.6cqw] bg-[#4a0f08] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,45%_50%)]" aria-hidden="true" />
                <span className="bg-gradient-to-b from-[#9b2c1c] to-[#5a1208] px-[2.2cqw] py-[0.55cqw] text-[1.2cqw] font-bold tracking-[0.35em] text-[#f7d77a] shadow-[0_0.3cqw_0.8cqw_-0.3cqw_black]">
                  CERTIFICATE OF COMPLETION
                </span>
                <span className="h-[2.6cqw] w-[1.6cqw] bg-[#4a0f08] [clip-path:polygon(0_0,100%_0,55%_50%,100%_100%,0_100%)]" aria-hidden="true" />
              </span>

              <p className="relative mt-[1.6cqw] text-[1.7cqw] text-[var(--maroon)]/75">यह प्रमाणित किया जाता है कि</p>
              <p className="relative mt-[0.3cqw] flex items-center gap-[1.5cqw]">
                <Flourish />
                <span className="font-display text-[4.4cqw] leading-tight text-[var(--sindoor)] [text-shadow:0_0.15cqw_0_rgb(227_176_75/0.45)]">{shown}</span>
                <Flourish flip />
              </p>
              <p className="relative mt-[0.8cqw] max-w-[64cqw] text-[1.7cqw] leading-snug text-[var(--maroon)]/85">
                ने <strong className="text-[var(--maroon)]">40 दिवसीय हनुमान स्तुति साधना</strong> पूर्ण श्रद्धा, नियम और संकल्प के साथ सम्पन्न की है।
              </p>
              {/* the declaration, on a gold plate */}
              <p className="relative mt-[1.2cqw] rounded-full bg-gradient-to-r from-[#c98a1f] via-[#fbe7a1] to-[#c98a1f] p-[0.18cqw] shadow-[0_0.4cqw_1.2cqw_-0.4cqw_#9c6413]">
                <span className="block rounded-full bg-gradient-to-b from-[#7c2414] to-[#4a0f08] px-[3cqw] py-[0.6cqw] font-display text-[2.5cqw] leading-none text-[#f7d77a]">
                  ॥ मैं हूँ हनुमान साधक ॥
                </span>
              </p>

              {/* footer: QR · seal · signature */}
              <div className="relative mt-auto grid w-full grid-cols-[1fr_auto_1fr] items-end gap-[2.5cqw]">
                <div className="flex items-end gap-[1cqw] text-left">
                  <span className="rounded-[0.5cqw] border-[0.15cqw] border-[#b8781c]/70 bg-white/80 p-[0.5cqw]">
                    <QRCodeSVG value={qrValue} bgColor="transparent" fgColor="#4a0f08" level="M" style={{ display: 'block', width: '8.5cqw', height: '8.5cqw' }} />
                  </span>
                  <span className="text-[1.1cqw] leading-tight text-[var(--maroon)]/70">
                    <span className="block font-bold text-[var(--maroon)]">स्कैन करके</span>
                    सत्यापित करें
                  </span>
                </div>
                <Seal />
                <div className="text-[1.3cqw]">
                  <p className="font-display text-[2.3cqw] italic leading-none text-[var(--sindoor)]">Hanuman Sadhak</p>
                  <p className="mt-[0.4cqw] border-t-[0.12cqw] border-[#b8781c]/60 pt-[0.4cqw] text-[var(--maroon)]/70">{completedOn ? `सम्पन्न तिथि: ${completedOn}` : 'हनुमान साधक परिवार · 40वाँ दिन'}</p>
                </div>
              </div>

              <p className="absolute bottom-[1.5cqw] right-[7.5cqw] text-[1cqw] italic tracking-wide text-[#9c6413]/80">By Bhakti Amrit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 12" fill="none" stroke="#b8781c" strokeWidth="1" className={`h-[1.6cqw] w-[8cqw] ${flip ? '-scale-x-100' : ''}`} aria-hidden="true">
      <path d="M0 6h40" />
      <path d="M40 6c4-5 9-5 11 0-2 5-7 5-11 0Z" fill="#e3b04b" />
      <circle cx="56" cy="6" r="2" fill="#b8781c" />
    </svg>
  );
}

function CertCorner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#b8781c" strokeWidth="1.4" className={`pointer-events-none absolute h-[6cqw] w-[6cqw] ${className}`} aria-hidden="true">
      <path d="M3 37V16C3 8.8 8.8 3 16 3h21" />
      <path d="M8 37V18c0-5.5 4.5-10 10-10h19" strokeOpacity="0.55" />
      <path d="M14 24c0-5.5 4.5-10 10-10 3 0 5 2 5 4.5S27 23 24.5 23 21 21 21 19" />
      <circle cx="3" cy="37" r="1.6" fill="#b8781c" />
      <circle cx="37" cy="3" r="1.6" fill="#b8781c" />
    </svg>
  );
}

// Gold rosette seal with ribbon tails.
function Seal() {
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 44 : 50;
    return `${(50 + r * Math.sin(a)).toFixed(2)},${(50 - r * Math.cos(a)).toFixed(2)}`;
  }).join(' ');
  return (
    <div className="relative h-[13cqw] w-[13cqw]">
      <svg viewBox="0 0 100 120" className="absolute left-0 top-[6cqw] h-[10cqw] w-full" aria-hidden="true">
        <path d="M30 40 L22 110 L36 98 L44 112 L50 45Z" fill="#9b2c1c" />
        <path d="M70 40 L78 110 L64 98 L56 112 L50 45Z" fill="#7a1f12" />
      </svg>
      <svg viewBox="0 0 100 100" className="relative h-full w-full drop-shadow-[0_0.4cqw_0.6cqw_rgb(90_40_10/0.4)]" aria-hidden="true">
        <defs>
          <radialGradient id="seal-gold" cx="35%" cy="30%">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.5" stopColor="#e3b04b" />
            <stop offset="1" stopColor="#9c6413" />
          </radialGradient>
        </defs>
        <polygon points={points} fill="url(#seal-gold)" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#7a4a0c" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#7a4a0c" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="50" y="52" textAnchor="middle" fontSize="22" fontWeight="700" fill="#5a1a08" fontFamily="var(--font-rozha), serif">40</text>
        <text x="50" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5a1a08">दिन पूर्ण</text>
      </svg>
    </div>
  );
}
