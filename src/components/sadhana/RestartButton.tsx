'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from '../Icon';

// Lifetime plan: wipes the 40 days' progress, so it asks first.
export default function RestartButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function restart() {
    if (!window.confirm('क्या आप 40 दिन की साधना फिर से शुरू करना चाहते हैं? अभी की प्रगति हट जाएगी।')) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/progress/reset', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
      else router.refresh();
    } catch {
      setError('इंटरनेट की समस्या — फिर कोशिश करें');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={restart}
        disabled={busy}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f7d77a]/60 px-4 font-bold text-[#fff1cf] disabled:opacity-60"
      >
        <Icon name="refresh" /> {busy ? 'शुरू हो रहा है…' : 'फिर से शुरू करें'}
      </button>
      {error && <p role="alert" className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
    </>
  );
}
