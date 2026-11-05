'use client';

import Icon from '../Icon';
import { emberButton, outlineButton } from './AppShell';

const SITE_URL = 'https://hanumansadhak.com';
const SHARE_TEXT = 'जय श्री राम! मैंने 40 दिन की हनुमान स्तुति साधना पूरी की। आप भी शुरू करें!';

export default function CertificateActions() {
  function share() {
    // Desktop browsers mostly have no share sheet; WhatsApp is where this gets shared anyway.
    if (navigator.share) {
      navigator.share({ title: 'मैंने हनुमान स्तुति साधना पूरी की', text: SHARE_TEXT, url: SITE_URL }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SITE_URL}`)}`, '_blank', 'noopener');
    }
  }

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 print:hidden">
      <button type="button" onClick={() => window.print()} className={emberButton}>
        <Icon name="download" /> डाउनलोड / प्रिंट
      </button>
      <button type="button" onClick={share} className={`${outlineButton} min-h-14 text-lg`}>
        <Icon name="share" /> Share करें
      </button>
    </div>
  );
}
