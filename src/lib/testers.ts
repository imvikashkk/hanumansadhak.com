// Testing ke liye numbers: inke liye payment, plan limit, din ka kram aur 12 ghante ka lock — kuchh nahi lagta.
// Testing khatam hote hi yahan se number hata dena.
export const TESTER_PHONES = ['9090525328', '7566634500'];

export function isTester(phone: string | null | undefined): boolean {
  return !!phone && TESTER_PHONES.includes(phone);
}
