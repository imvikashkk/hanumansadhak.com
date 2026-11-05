import Icon, { type IconName } from '../Icon';
import { Reveal } from '../Reveal';

// One-line summary of the 40 days: five milestones on a gold thread.
const STEPS: { icon: IconName; day: string; label: string }[] = [
  { icon: 'pray', day: 'दिन 1', label: 'संकल्प और शुरुआत' },
  { icon: 'lotus', day: 'दिन 10', label: 'मन की शांति का अनुभव' },
  { icon: 'shield', day: 'दिन 20', label: 'नकारात्मकता से मुक्ति' },
  { icon: 'bolt', day: 'दिन 30', label: 'आत्मविश्वास में वृद्धि' },
  { icon: 'medal', day: 'दिन 40', label: 'पूर्णता और आध्यात्मिक परिवर्तन' },
];

export default function MilestoneStrip() {
  return (
    <Reveal className="mx-auto mt-10 max-w-6xl">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_30px_60px_-34px_var(--maroon)]">
        <div className="relative overflow-hidden rounded-[calc(1.75rem-2px)] bg-[radial-gradient(ellipse_at_top,#a8321f,var(--maroon)_60%,oklch(0.27_0.09_28))] px-3 py-6 text-center sm:px-8 sm:py-7">
          <div className="bg-mandala pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
          <p className="relative font-display text-2xl text-[#fff1cf] sm:text-3xl">
            40 दिनों की <span className="text-[#f7d77a]">साधना यात्रा</span>
          </p>

          <ol className="relative mt-6 grid grid-cols-5">
            {/* gold thread through the medallions */}
            <span className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gradient-to-r from-[#f7d77a]/40 via-[#f7d77a] to-[#f7d77a]/40 sm:top-7" aria-hidden="true" />
            {STEPS.map(({ icon, day, label }) => (
              <li key={day} className="relative flex flex-col items-center px-0.5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-[#f7d77a] to-[#b8781c] p-[2px] shadow-[0_0_18px_-2px_var(--primary)] sm:h-14 sm:w-14">
                  <span className="grid h-full w-full place-items-center rounded-full bg-ember text-lg text-[var(--primary-foreground)] sm:text-2xl">
                    <Icon name={icon} />
                  </span>
                </span>
                <span className="mt-2 text-xs font-bold text-[#f7d77a] sm:text-base">{day}</span>
                <span className="mt-0.5 text-[10px] leading-tight text-[#fff1cf]/85 sm:text-sm">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Reveal>
  );
}
