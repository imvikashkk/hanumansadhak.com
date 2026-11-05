'use client';

import { useSyncExternalStore } from 'react';
import { TEXT_SIZE_KEY, TEXT_SIZES } from '@/lib/text-size';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readSaved(): string {
  try {
    return localStorage.getItem(TEXT_SIZE_KEY) || 'normal';
  } catch {
    return 'normal';
  }
}

function choose(id: (typeof TEXT_SIZES)[number]['id'], scale: string) {
  document.documentElement.style.fontSize = scale;
  try {
    localStorage.setItem(TEXT_SIZE_KEY, id);
  } catch {
    // Private mode etc.: still applies for this visit, it just won't be remembered.
  }
  listeners.forEach((l) => l());
}

export default function TextSizeControl() {
  const size = useSyncExternalStore(subscribe, readSaved, () => 'normal');

  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="अक्षर का आकार">
      {TEXT_SIZES.map((t) => {
        const active = size === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => choose(t.id, t.scale)}
            className={`min-h-16 rounded-xl border-2 px-1 py-2 transition-colors ${active ? 'border-[var(--sindoor)] bg-[var(--sindoor)]/10 text-[var(--sindoor)]' : 'border-[var(--maroon)]/20 bg-white/60'}`}
          >
            <span className={`block font-bold ${t.sample}`}>अ</span>
            <span className="mt-0.5 block text-sm">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
