import AboutSection from '@/components/AboutSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import CertificateSection from '@/components/CertificateSection';
import CTASection from '@/components/CTASection';
import EngagementTracker from '@/components/EngagementTracker';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import GallerySection from '@/components/GallerySection';
import HeroSection from '@/components/HeroSection';
import JourneySection from '@/components/journey/JourneySection';
import MarqueeStrip from '@/components/MarqueeStrip';
import Navbar from '@/components/Navbar';
import OfferSection from '@/components/OfferSection';
import PauseOffscreen from '@/components/PauseOffscreen';
import PhalSection from '@/components/PhalSection';
import StickyCTA from '@/components/StickyCTA';
import WhatsAppProofs from '@/components/WhatsAppProofs';
import WhySection from '@/components/WhySection';
// import VideoTestimonials from '@/components/VideoTestimonials'; // temporarily hidden

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <main className="relative min-h-screen overflow-x-clip pt-[var(--banner-h)]">
        <Navbar />
        <HeroSection />
        <MarqueeStrip />
        <AboutSection />
        <PhalSection />
        {/* <VideoTestimonials /> */}
        <WhatsAppProofs />
        <JourneySection />
        <CertificateSection />
        <WhySection />
        <GallerySection />
        <OfferSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
      <StickyCTA />
      <EngagementTracker />
      <PauseOffscreen />
    </>
  );
}
