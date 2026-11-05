'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '../Icon';

// The server decided this day is still locked; tick down, then ask it again.
export default function UnlockCountdown({ unlockAt, now, hours }: { unlockAt: number; now: number; hours: number }) {
  const router = useRouter();
  const [time, setTime] = useState(now);
  const left = Math.max(0, unlockAt - time);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (left === 0) router.refresh();
  }, [left, router]);

  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);

  return (
    <div className="mt-4 rounded-2xl border border-[#f7d77a]/30 bg-black/20 px-4 py-3 text-center">
      <p className="flex items-center justify-center gap-2 text-base font-semibold">
        <Icon name="lock" className="text-[#f7d77a]" /> यह दिन खुलेगा
      </p>
      <p className="mt-1 font-display text-3xl tabular-nums text-[#f7d77a]" role="timer">
        {h} घंटे {m} मिनट {String(s).padStart(2, '0')} सेकंड
      </p>
      <p className="mt-1 text-sm text-[#fff1cf]/70">हर दिन पिछले दिन के {hours} घंटे बाद खुलता है।</p>
    </div>
  );
}
