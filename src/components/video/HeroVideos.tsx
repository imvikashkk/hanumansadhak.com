'use client';

import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '@/data/media';
import { trackCustom } from '@/lib/pixel';
import Icon from '../Icon';
import { useVideoSource, VIDEO_PLAY_EVENT } from './useVideoSource';

const HERO_ID = 'hero';

// Vertical reels side by side. They loop muted once near the screen (browsers block sound until
// the visitor interacts) and pause while scrolled away, so nothing downloads off screen. Tapping
// one restarts it with sound and mutes the other.
export default function HeroVideos({ videos }: { videos: VideoItem[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [soundOn, setSoundOn] = useState<number | null>(null);

  function playWithSound(index: number) {
    const all = box.current?.querySelectorAll('video');
    if (!all) return;
    // Directly in the tap: mobile browsers only allow sound from inside the gesture itself.
    all.forEach((v, i) => {
      v.muted = i !== index;
    });
    const video = all[index];
    video.currentTime = 0;
    video.play().catch(() => {});
    window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: HERO_ID }));
    trackCustom('VideoPlay', { title: videos[index].title, placement: 'hero' });
    setSoundOn(index);
  }

  return (
    <div ref={box} className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
      {videos.map((video, i) => (
        <Reel key={video.src} video={video} sound={soundOn === i} onTap={() => playWithSound(i)} />
      ))}
    </div>
  );
}

function Reel({ video, sound, onTap }: { video: VideoItem; sound: boolean; onTap: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useVideoSource(ref, video.src, near);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          if (el.muted && el.currentSrc) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);

    // Another player on the page started: this one gives way.
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== HERO_ID) el.pause();
    };
    window.addEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
    return () => {
      io.disconnect();
      window.removeEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
    };
  }, []);

  return (
    // gold light running round the reel's edge
    <div className="relative rounded-[1.1rem] p-[2px]">
      <div className="border-sweep absolute inset-0 rounded-[1.1rem]" aria-hidden="true" />
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-glow">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={video.poster}
          aria-label={video.title}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          controls={sound}
        />
        {!sound && (
          <button
            type="button"
            onClick={onTap}
            aria-label={`${video.title} — आवाज़ के साथ चलाएं`}
            className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
          >
            <span className="inline-flex animate-float items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Icon name="volumeOff" /> आवाज़ के लिए टैप करें
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
