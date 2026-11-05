'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { ImageItem } from '@/data/media';
import Icon from './Icon';

// Full-screen viewer with arrows, keyboard and swipe navigation.
export default function Lightbox({
  images,
  index,
  onChange,
  onClose,
}: {
  images: ImageItem[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const touchX = useRef<number | null>(null);
  const go = (d: number) => onChange((index + d + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onChange, onClose]);

  const img = images[index];
  const arrow = 'absolute top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
    >
      <button onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20" aria-label="बंद करें">
        <Icon name="close" />
      </button>
      <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <Image src={img.src} alt={img.alt} fill sizes="100vw" className="rounded-2xl object-contain" />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={(e) => (e.stopPropagation(), go(-1))} className={`${arrow} left-3 rotate-180`} aria-label="पिछली तस्वीर">
            <Icon name="arrowRight" />
          </button>
          <button onClick={(e) => (e.stopPropagation(), go(1))} className={`${arrow} right-3`} aria-label="अगली तस्वीर">
            <Icon name="arrowRight" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {img.alt} · {index + 1}/{images.length}
          </p>
        </>
      )}
    </div>
  );
}
