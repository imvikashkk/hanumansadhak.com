import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'रिफंड नीति (Refund Policy) | हनुमान साधक',
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="रिफंड नीति" updatedOn="24 अक्टूबर 2026">
      <section className="rounded-xl border border-red-400/40 bg-red-500/10 p-4">
        <p className="font-semibold text-red-300">
          कृपया ध्यान दें: हनुमान स्तुति साधना एक <u>डिजिटल</u> सेवा है जो भुगतान होते ही तुरंत activate हो जाती है। इसलिए <strong>किसी भी परिस्थिति में कोई रिफंड नहीं दिया जाएगा।</strong>
        </p>
      </section>
      <section>
        <h2>1. No Refund Policy</h2>
        <p>भुगतान सफल होने और access मिलने के बाद निम्नलिखित किसी भी कारण से रिफंड नहीं दिया जाएगा:</p>
        <ul className="mt-2">
          <li>मन बदल जाना (change of mind)</li>
          <li>साधना पूरी न कर पाना या बीच में छोड़ देना</li>
          <li>अपेक्षित परिणाम/मनोकामना पूर्ति न होना</li>
          <li>access का कम उपयोग करना</li>
        </ul>
      </section>
      <section>
        <h2>2. कोई कैंसिलेशन नहीं</h2>
        <p>यह एकमुश्त (one-time) भुगतान है, कोई subscription नहीं — भुगतान के साथ ही सेवा delivered मानी जाती है।</p>
      </section>
      <section>
        <h2>3. तकनीकी गड़बड़ी या डुप्लिकेट भुगतान</h2>
        <p>
          अगर तकनीकी खराबी से आपसे <strong>एक से ज़्यादा बार पैसा कट गया हो</strong>, तो payment proof के साथ <strong>7 दिन के अंदर</strong> संपर्क करें। सत्यापन के बाद अतिरिक्त राशि 7-10 कार्यदिवस में उसी भुगतान माध्यम में वापस कर दी जाएगी।
        </p>
      </section>
    </LegalPage>
  );
}
