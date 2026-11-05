import { redirect } from 'next/navigation';
import { requireSadhana } from '@/lib/sadhana-state';

// "आज की साधना" in the tab bar: straight to the open day, or the chart when none is open.
export default async function TodayPage() {
  const { status } = await requireSadhana('/sadhana/today');
  redirect(status.nextDay && !status.nextLocked ? `/sadhana/day/${status.nextDay}` : '/sadhana');
}
