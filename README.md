# hanumansadhak.com

40 दिन हनुमान स्तुति साधना की landing page (Next.js 16, aischool वाला structure)।

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_META_PIXEL_ID भरें
npm run dev
```

## क्या कहाँ बदलें

| क्या | फ़ाइल |
| --- | --- |
| Payment link, WhatsApp, ईमेल | `src/data/site.ts` |
| Videos (hero, featured, भक्तों के reels), gallery sections, WhatsApp screenshots | `src/data/media.ts` (फ़ाइलें: `public/gallery`, `public/video-posters`, `public/whatsapp-feedback`) |
| मनोकामनाएं, अनुभव, FAQ, 40 दिन की यात्रा | `src/data/content.ts` |

Video `src` MP4, HLS (`.m3u8`, Bunny CDN) या YouTube link हो सकता है। खाली `src` वाला video नहीं दिखता।
नई remote image host हो तो `next.config.ts` के `remotePatterns` में जोड़ें।

## Meta Pixel events

`PageView` (load), `ViewContent` (10 सेकंड या 15% scroll), `InitiateCheckout` (हर CTA, `placement` के साथ),
custom `VideoPlay` और `ScrollDepth` (50/90%)।
