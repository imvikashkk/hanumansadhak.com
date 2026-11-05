// Transactional SMS via Fast2SMS' DLT route, using the templates approved in its DLT Manager.
// .env.local: FAST2SMS_API_KEY (required in production).
// Without a key in development the SMS is printed to the server console instead.

const API_URL = 'https://www.fast2sms.com/dev/bulkV2';
const SENDER_ID = 'BHAKAM';

// Message IDs from Fast2SMS > DLT Manager > Content Template.
const TEMPLATES = {
  otp: '230546', // "{#var#} is your verification OTP for Hanuman Sadhak. It is valid for {#var#}. ..."
  purchase: '230545', // "Thank you for subscribing to Hanuman Sadhak! You can log in here: {#var#} ..."
} as const;

// No https:// — DLT caps each variable at 30 characters and the full URL is 31.
const LOGIN_LINK = 'hanumansadhak.com/login';

async function sendDltSms(phone: string, template: keyof typeof TEMPLATES, variables: string[]): Promise<boolean> {
  const key = process.env.FAST2SMS_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] SMS "${template}" for ${phone}: ${variables.join(' | ')}`);
      return true;
    }
    console.error('FAST2SMS_API_KEY is not set');
    return false;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { authorization: key, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        route: 'dlt',
        sender_id: SENDER_ID,
        message: TEMPLATES[template],
        variables_values: variables.join('|'),
        numbers: phone,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.return === false) {
      console.error('Fast2SMS send failed', template, res.status, data);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Fast2SMS send failed', template, err);
    return false;
  }
}

export function sendOtpSms(phone: string, code: string, validForMinutes: number) {
  return sendDltSms(phone, 'otp', [code, `${validForMinutes} minutes`]);
}

export function sendPurchaseSms(phone: string) {
  return sendDltSms(phone, 'purchase', [LOGIN_LINK]);
}
