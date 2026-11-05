'use client';

import { useRouter } from 'next/navigation';
import Icon from '../Icon';

export default function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
      }}
      className="flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--gold)]/40 px-3 text-sm font-semibold text-[var(--gold)]"
    >
      <Icon name="logout" /> Logout
    </button>
  );
}
