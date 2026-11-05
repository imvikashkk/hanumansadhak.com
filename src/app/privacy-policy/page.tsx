import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | हनुमान साधक',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="गोपनीयता नीति" updatedOn="24 अक्टूबर 2026">
      <section>
        <p>
          यह गोपनीयता नीति बताती है कि <strong>हनुमान साधक (hanumansadhak.com)</strong> — 40 दिन हनुमान स्तुति साधना — आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करता है।
        </p>
      </section>
      <section>
        <h2>1. हम कौन सी जानकारी लेते हैं</h2>
        <ul>
          <li>आपका <strong>नाम, मोबाइल नंबर और ईमेल</strong> — भुगतान और साधना access देने के लिए</li>
          <li><strong>भुगतान जानकारी</strong> — भुगतान हमारे payment partner <strong>Razorpay</strong> द्वारा सीधे प्रोसेस होता है; हम आपके कार्ड/UPI विवरण न तो देखते हैं और न ही स्टोर करते हैं</li>
          <li><strong>डिवाइस और उपयोग डेटा</strong> (जैसे browser, IP address) — सुरक्षा और वेबसाइट सुधार के लिए</li>
          <li><strong>Cookies</strong> — वेबसाइट के सही काम करने और विज्ञापन मापन के लिए</li>
        </ul>
      </section>
      <section>
        <h2>2. जानकारी का उपयोग कैसे होता है</h2>
        <ul>
          <li>आपको साधना का access देने और ग्राहक सहायता देने के लिए</li>
          <li>साधना पूरी होने पर डिजिटल सर्टिफिकेट बनाने के लिए</li>
          <li>विज्ञापन प्रदर्शन मापने के लिए हम Meta (Facebook) Pixel का उपयोग करते हैं</li>
        </ul>
      </section>
      <section>
        <h2>3. जानकारी किसके साथ साझा होती है</h2>
        <p>हम आपकी जानकारी कभी नहीं बेचते। केवल इन trusted partners के साथ ज़रूरत भर की जानकारी साझा होती है:</p>
        <ul className="mt-2">
          <li><strong>Razorpay</strong> — भुगतान प्रोसेसिंग के लिए</li>
          <li><strong>Meta (Facebook)</strong> — विज्ञापन मापन के लिए</li>
        </ul>
      </section>
      <section>
        <h2>4. आपके अधिकार</h2>
        <p>आप कभी भी अपनी जानकारी देखने, सही करवाने या डिलीट करवाने के लिए नीचे दिए गए संपर्क पर लिख सकते हैं।</p>
      </section>
      <section>
        <h2>5. नीति में बदलाव</h2>
        <p>हम समय-समय पर इस नीति को अपडेट कर सकते हैं। कोई भी बड़ा बदलाव इसी पेज पर दिखाया जाएगा।</p>
      </section>
    </LegalPage>
  );
}
