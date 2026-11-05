// Signup page ke sawal — yahin badlo, form aur database (users.sankalp) apne aap update.
// Saare sankalp tick karna zaroori hai; jawab users.sankalp me { id: true } ban kar save hote hain.
// Kisi sawal ka `id` mat badlo jab log join karne lage hon — purane jawab usi id se jude hain.

export const SANKALP_QUESTIONS = [
  { id: 'sadhak', text: 'क्या आप सच्चे मन से हनुमान जी के साधक बनना चाहते हैं?' },
  { id: 'niyam', text: 'क्या आप 40 दिन तक रोज़ कम से कम 10 मिनट साधना के लिए निकालेंगे?' },
  { id: 'dhairya', text: 'क्या आप कोई दिन छूट जाने पर भी हार न मानकर 40 दिन की साधना पूरी करेंगे?' },
] as const;

export const GENDERS = [
  { id: 'male', label: 'पुरुष' },
  { id: 'female', label: 'महिला' },
  { id: 'other', label: 'अन्य' },
] as const;

export type GenderId = (typeof GENDERS)[number]['id'];

export const PHONE_RE = /^[6-9]\d{9}$/;
export const MIN_AGE = 10;
export const MAX_AGE = 100;
