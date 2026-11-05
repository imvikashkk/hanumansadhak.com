'use client';

import { useRouter } from 'next/navigation';
import Icon from '../Icon';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/');
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-white/70 text-lg font-bold text-red-700 active:bg-red-50">
      <Icon name="logout" /> लॉगआउट
    </button>
  );
}
