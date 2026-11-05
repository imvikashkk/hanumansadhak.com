'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GALLERY_SECTIONS, hasSrc, type ImageItem } from '@/data/media';
import Lightbox from './Lightbox';
import { Reveal } from './Reveal';
import SectionHeading from './SectionHeading';

function defaultCols(n: number) {
  if (n < 3) return 'mx-auto max-w-3xl grid-cols-2';
  if (n === 3) return 'mx-auto max-w-4xl grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
}

function Grid({
  images,
  cols,
  aspect = 'aspect-[3/4]',
  onOpen,
}: {
  images: ImageItem[];
  cols?: string;
  aspect?: string;
  onOpen: (i: number) => void;
}) {
  return (
    <div className={`grid gap-3 sm:gap-4 ${cols ?? defaultCols(images.length)}`}>
      {images.map((img, i) => (
        <Reveal key={img.src} delay={(i % 4) * 60}>
          <button
            onClick={() => onOpen(i)}
            className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-glow ${aspect}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-left text-sm font-semibold text-white">
              {img.alt}
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

export default function GallerySection() {
  const sections = GALLERY_SECTIONS.map((s) => ({ ...s, images: hasSrc(s.images) })).filter((s) => s.images.length > 0);
  const [open, setOpen] = useState<{ set: ImageItem[]; i: number } | null>(null);

  return (
    <>
      {sections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6" aria-labelledby="gallery-heading">
          <SectionHeading id="gallery-heading" eyebrow="दर्शन" sub="साधना के 40 दिन — हर दिन बजरंगबली के सान्निध्य में">
            हनुमान जी के <span className="text-ember">दिव्य दर्शन</span>
          </SectionHeading>

          <div className="mt-12 flex flex-col gap-14">
            {sections.map((section) => (
              <div key={section.label}>
                <Reveal className="mb-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[var(--border)]" />
                  <h3 className="font-display text-xl text-ember">{section.label}</h3>
                  <span className="h-px flex-1 bg-[var(--border)]" />
                </Reveal>
                <Grid
                  images={section.images}
                  cols={section.cols}
                  aspect={section.aspect}
                  onOpen={(i) => setOpen({ set: section.images, i })}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {open && (
        <Lightbox
          images={open.set}
          index={open.i}
          onChange={(i) => setOpen({ set: open.set, i })}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
