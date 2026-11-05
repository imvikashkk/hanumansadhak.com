import Image, { type StaticImageData } from 'next/image';

// A background image that stays fixed to the screen while its parent scrolls over it.
// The parent clips it (clip-path), so it only shows through that parent's box.
// Works on iOS too, unlike `background-attachment: fixed`.
export default function ParallaxImage({ src, className = '' }: { src: StaticImageData; className?: string }) {
  return (
    <div className="absolute inset-0 [clip-path:inset(0)]" aria-hidden="true">
      {/* fixed (true parallax) only on large screens — on phones it scrolls normally, far cheaper to paint */}
      <div className="absolute inset-0 lg:fixed">
        <Image src={src} alt="" fill sizes="100vw" placeholder="blur" className={`object-cover ${className}`} />
      </div>
    </div>
  );
}
