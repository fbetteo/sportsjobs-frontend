// Simple alphabet for generating suffixes (excluding similar looking characters)
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function encodeJobId(numericId: number): string {
  // Generate a 2-character random suffix
  const suffix = Array(2)
    .fill(0)
    .map(() => ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
    .join('');
  
  return `${numericId}-${suffix}`;
}

export function decodeJobId(encodedId: string): number {
  // If it's an old format ID (just a number), return it directly
  if (/^\d+$/.test(encodedId)) {
    return parseInt(encodedId, 10);
  }
  
  // For new format, strip off the suffix
  const numericPart = encodedId.split('-')[0];
  return parseInt(numericPart, 10);
}
