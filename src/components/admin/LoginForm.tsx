'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { FormError, inputClass, labelClass } from '../auth/AuthShell';

export default function AdminLoginForm() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'लॉगिन नहीं हो सका');
        setBusy(false);
        return;
      }
      router.replace('/admin');
    } catch {
      setError('नेटवर्क में समस्या है, कृपया फिर कोशिश करें');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="admin-id" className={labelClass}>User ID</label>
        <input id="admin-id" value={userId} onChange={(e) => setUserId(e.target.value)} autoFocus required autoComplete="username" className={inputClass} />
      </div>
      <div>
        <label htmlFor="admin-password" className={labelClass}>Password</label>
        <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputClass} />
      </div>
      {error && <FormError>{error}</FormError>}
      <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center rounded-xl bg-ember font-bold text-[var(--primary-foreground)] disabled:opacity-60">
        {busy ? 'जाँच हो रही है…' : 'Login करें'}
      </button>
    </form>
  );
}
