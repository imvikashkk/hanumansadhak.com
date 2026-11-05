'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Icon from '../Icon';
import { FormError, inputClass } from '../auth/AuthShell';
import { emberButton, outlineButton } from './AppShell';

export default function NameEditor({ name }: { name: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'सेव नहीं हो पाया');
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError('इंटरनेट की समस्या — फिर कोशिश करें');
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button type="button" onClick={() => { setValue(name ?? ''); setEditing(true); }} className={`${outlineButton} w-full`}>
        <Icon name="pencil" /> नाम बदलें
      </button>
    );
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-bold">आपका नाम</label>
        <input id="name" value={value} onChange={(e) => setValue(e.target.value)} autoFocus maxLength={100} autoComplete="name" className={inputClass} />
        <p className="mt-1.5 text-sm text-[var(--maroon)]/70">यही नाम आपके प्रमाणपत्र पर लिखा जाएगा</p>
      </div>
      {error && <FormError>{error}</FormError>}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setEditing(false)} className={outlineButton}>रद्द करें</button>
        <button type="submit" disabled={saving || !value.trim()} className={`${emberButton} min-h-12 text-base`}>
          {saving ? 'सेव हो रहा है…' : 'सेव करें'}
        </button>
      </div>
    </form>
  );
}
