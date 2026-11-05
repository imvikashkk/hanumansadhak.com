'use client';

import { useEffect, type RefObject } from 'react';

// Fired with the id of the video that just started, so every other player pauses.
export const VIDEO_PLAY_EVENT = 'hs-video:play';

export const isHls = (src: string) => /\.m3u8(\?|$)/i.test(src);

export function youtubeId(src: string): string | null {
  const m = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

// The video's own poster, else YouTube's thumbnail.
export function videoPoster(video: { src: string; poster?: string }): string | undefined {
  const ytId = youtubeId(video.src);
  return video.poster || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined);
}

// Attaches `src` to the <video>: native for MP4 (and HLS on Safari/iOS),
// hls.js elsewhere — loaded only when an HLS video is actually needed.
export function useVideoSource(ref: RefObject<HTMLVideoElement | null>, src: string, active: boolean) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !active || !src) return;

    // The autoplay attribute alone doesn't reliably start a src set from JS.
    const start = () => {
      if (video.autoplay) video.play().catch(() => {});
    };

    if (!isHls(src) || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      start();
      return;
    }

    let destroyed = false;
    let hls: { destroy: () => void } | null = null;
    import('hls.js').then(({ default: Hls }) => {
      if (destroyed) return;
      if (!Hls.isSupported()) {
        video.src = src;
        start();
        return;
      }
      // Small players on sharp phone screens would otherwise pull 720p on mobile data.
      const h = new Hls({ capLevelToPlayerSize: true, maxDevicePixelRatio: 2 });
      h.on(Hls.Events.MANIFEST_PARSED, start);
      h.loadSource(src);
      h.attachMedia(video);
      hls = h;
    });
    return () => {
      destroyed = true;
      hls?.destroy();
    };
  }, [ref, src, active]);
}
