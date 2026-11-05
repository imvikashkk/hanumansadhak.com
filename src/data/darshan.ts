// Signup / login ki tasveerein — sab homepage wali hi hain (src/assets/).
import fortyDayRules from '@/assets/40-Day-Rules.png';
import awakenedDeity from '@/assets/Awakened-Deity-of-Kaliyuga.png';
import childrenFamily from '@/assets/Children-and-Family-Blessings.png';
import education from '@/assets/Education-and-Examinations.png';
import familyPeace from '@/assets/Family-Peace.png';
import hanuman1 from '@/assets/hanuman-1.png';
import hanuman2 from '@/assets/hanuman-2.png';
import atRamsFeet from '@/assets/Hanuman-Ji-at-the-Feet-of-Shri-Ram.png';
import health from '@/assets/Health-and-Wellness.png';
import homeProperty from '@/assets/Home-and-Property.png';
import jobCareer from '@/assets/Job-and-Career.png';
import marriage from '@/assets/Marriage-and-Marital-Life.png';
import panchmukhi from '@/assets/Panchmukhi-Hanuman-Ji.png';
import powerOfChalisa from '@/assets/Power-of-Hanuman-Chalisa.png';
import protection from '@/assets/Protection-from-Fear-and-Dangers.png';
import protectionNegativity from '@/assets/Protection-from-Negativity.png';
import sankatmochan from '@/assets/Sankatmochan-Hanuman-Ji.png';
import siyaRamInHeart from '@/assets/Sita-Ram-in-Hanuman-Jis-Heart.png';
import wealthBusiness from '@/assets/Wealth-and-Business.png';
import type { StaticImageData } from 'next/image';

export type DarshanImage = { src: StaticImageData; label: string };

export const SIGNUP_HERO = hanuman2;
export const LOGIN_HERO = hanuman1;
export const PAYMENT_HERO = panchmukhi;

export const SWAROOP: DarshanImage[] = [
  { src: sankatmochan, label: 'संकटमोचन' },
  { src: panchmukhi, label: 'पंचमुखी' },
  { src: siyaRamInHeart, label: 'हृदय में सिया-राम' },
  { src: atRamsFeet, label: 'राम चरणों में' },
  { src: hanuman1, label: 'पवनपुत्र' },
  { src: hanuman2, label: 'राम भक्त' },
];

export const MANOKAMNA: DarshanImage[] = [
  { src: jobCareer, label: 'नौकरी और करियर' },
  { src: wealthBusiness, label: 'धन और व्यापार' },
  { src: marriage, label: 'विवाह' },
  { src: childrenFamily, label: 'संतान सुख' },
  { src: health, label: 'स्वास्थ्य' },
  { src: homeProperty, label: 'घर और संपत्ति' },
  { src: education, label: 'शिक्षा और परीक्षा' },
  { src: familyPeace, label: 'पारिवारिक शांति' },
  { src: protection, label: 'भय से रक्षा' },
  { src: protectionNegativity, label: 'नकारात्मकता से रक्षा' },
  { src: powerOfChalisa, label: 'चालीसा की शक्ति' },
  { src: awakenedDeity, label: 'कलियुग के जागृत देवता' },
  { src: fortyDayRules, label: '40 दिन का नियम' },
];

export const PERKS: { src: StaticImageData; title: string; text: string }[] = [
  { src: powerOfChalisa, title: 'रोज़ नया मार्गदर्शन', text: 'हर दिन का audio — क्या पढ़ें, कैसे बैठें' },
  { src: awakenedDeity, title: 'सिर्फ 10 मिनट रोज़', text: 'घर बैठे, अपने मोबाइल पर' },
  { src: fortyDayRules, title: '40 दिन का संकल्प', text: 'हर दिन की प्रगति का हिसाब' },
  { src: sankatmochan, title: 'साधना सर्टिफिकेट', text: '40 दिन पूरे होने पर' },
];
