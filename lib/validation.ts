export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_MESSAGE_LENGTH = 10;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}
