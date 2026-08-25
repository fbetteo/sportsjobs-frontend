export const DEFAULT_JOB_LOGO_PATH = '/sportsjobs_logo_color_rectangular_202606.png';
export const DEFAULT_JOB_LOGO_URL = 'https://cdn.sportsjobs.online/company-logos/www/sportsjobs_logo_color_rectangular_202606.png';

const VERCEL_DEFAULT_JOB_LOGO_URL = `https://www.sportsjobs.online${DEFAULT_JOB_LOGO_PATH}`;

const LEGACY_DEFAULT_JOB_LOGOS = new Set([
  'https://cdn.sportsjobs.online/blogposts/images/sportsjobs_logo.png',
  DEFAULT_JOB_LOGO_PATH,
  VERCEL_DEFAULT_JOB_LOGO_URL,
  DEFAULT_JOB_LOGO_URL,
]);

export function isDefaultJobLogo(logoUrl?: string | null): boolean {
  const normalizedLogoUrl = logoUrl?.trim();
  return !normalizedLogoUrl || LEGACY_DEFAULT_JOB_LOGOS.has(normalizedLogoUrl);
}

export function getJobLogoSrc(logoUrl?: string | null, _absolute = false): string {
  if (isDefaultJobLogo(logoUrl)) {
    return DEFAULT_JOB_LOGO_URL;
  }

  return logoUrl!.trim();
}
