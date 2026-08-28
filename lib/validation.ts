export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_NAME_LENGTH = 60;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}
