import type { Metadata } from 'next';
import AuthShell, { AuthCard } from '@/components/auth/AuthShell';
import Icon from '@/components/Icon';
import { whatsappLink } from '@/data/site';

export const metadata: Metadata = {
  title: 'प्रमाणपत्र नहीं मिला',
  robots: { index: false, follow: false },
};

// A wrong link, or a certificate that isn't ours: say so plainly, since this page exists to check that.
export default function SadhakNotFound() {
  return (
    <AuthShell ribbon="प्रमाणपत्र सत्यापन" ribbonIcon="shield" title={<>प्रमाणपत्र <span className="text-[var(--sindoor)]">नहीं मिला</span></>}>
      <AuthCard>
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl text-red-700">
            <Icon name="warning" />
          </span>
          <p className="mt-4 text-base">यह लिंक किसी सत्यापित साधक से नहीं जुड़ा है। QR कोड दोबारा स्कैन करके देखें।</p>
          <a href={whatsappLink('नमस्ते, मुझे एक प्रमाणपत्र का सत्यापन करना है')} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 font-bold text-white">
            <Icon name="whatsapp" /> WhatsApp पर पूछें
          </a>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
