// Poori site ki business settings yahin hain — link, contact.
// Inhe badlo, page apne aap update ho jayega.

export const SITE = {
  name: 'हनुमान साधक',
  nameEn: 'Hanuman Sadhak',
  domain: 'hanumansadhak.com',

  // Har "साधना शुरू करें" / "जॉइन करें" button yahin jata hai: signup → /payment (Razorpay).
  joinUrl: '/signup',

  whatsappNumber: '919776307793',
  whatsappDisplay: '+91 97763 07793',
  email: 'seva@hanumansadhak.com',

  // Social proof numbers used across the page.
  devotees: '50,000+',
  rating: '4.8',
  reviews: '1,000+',
};

export const whatsappLink = (text = 'नमस्ते, मुझे हनुमान साधना के बारे में जानकारी चाहिए') =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
