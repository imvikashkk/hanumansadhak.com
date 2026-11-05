import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Icon from '@/components/Icon';
import AppShell, { outlineButton } from '@/components/sadhana/AppShell';
import DayPlayer from '@/components/sadhana/DayPlayer';
import { SADHANA_DAYS } from '@/lib/sadhana';
import { getDayPlaylist } from '@/lib/sadhana-content';
import { requireSadhana } from '@/lib/sadhana-state';

export const metadata: Metadata = {
  title: 'आज की साधना',
  robots: { index: false },
};

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayParam } = await params;
  const day = Number(dayParam);
  const { status } = await requireSadhana(`/sadhana/day/${dayParam}`);

  // Only the open day (or one already completed) can be played, whatever the URL says.
  const content = status.canOpen(day) ? getDayPlaylist(day) : null;
  if (!content) redirect('/sadhana');

  return (
    <AppShell focused back={{ href: '/sadhana', label: 'चार्ट' }} title={`दिन ${day} / ${SADHANA_DAYS}`}>
      <div className="mx-auto max-w-2xl">
        <DayPlayer key={day} day={day} playlist={content.playlist} mainIndex={content.mainIndex} alreadyDone={status.completedDays.has(day)} />

        <div className="mt-5 grid grid-cols-2 gap-3">
          {status.canOpen(day - 1) && (
            <Link href={`/sadhana/day/${day - 1}`} className={`${outlineButton} col-start-1`}>
              <Icon name="chevronLeft" /> दिन {day - 1}
            </Link>
          )}
          {status.canOpen(day + 1) && (
            <Link href={`/sadhana/day/${day + 1}`} className={`${outlineButton} col-start-2`}>
              दिन {day + 1} <Icon name="chevronRight" />
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
