// lib/newsletterPopup.ts
// Browser-only state for when the newsletter popup may interrupt a visitor.
// Storage can throw (private mode, blocked site data); every access fails closed
// toward *not* showing the popup.

const DISMISSED_AT_KEY = 'signupPopupShown'; // legacy key name kept so existing dismissals still count
const SUBSCRIBED_KEY = 'newsletterSubscribed';

export const NEWSLETTER_POPUP_DISMISS_MS = 7 * 24 * 60 * 60 * 1000; // once a week at most

// Pages where a job-seeker newsletter popup is off-topic or interrupts a task.
const EXCLUDED_PATH_PREFIXES = ['/signup', '/settings', '/post-job', '/advertise', '/dashboard', '/testimonial'];

export const isJobDetailPath = (pathname: string) => pathname.startsWith('/jobs/');

export const isNewsletterPopupExcludedPath = (pathname: string) =>
    EXCLUDED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export function markNewsletterSubscribed() {
    try {
        localStorage.setItem(SUBSCRIBED_KEY, Date.now().toString());
    } catch {
        // Ignore: worst case the visitor sees the popup once more.
    }
}

export function markNewsletterPopupDismissed() {
    try {
        localStorage.setItem(DISMISSED_AT_KEY, Date.now().toString());
    } catch {
        // Ignore storage failures.
    }
}

// window.open(url, '_blank', 'noopener') always returns null by spec, which made the
// forms report every successful open as "popup blocked". Open normally, then sever
// the opener link ourselves so the returned handle still detects real blocking.
export function openNewsletterSubscribeTab(url: string) {
    const opened = window.open(url, '_blank');
    if (opened) {
        opened.opener = null;
    }
    return opened;
}

export function canShowNewsletterPopup() {
    try {
        if (localStorage.getItem(SUBSCRIBED_KEY)) return false;
        const lastDismissed = parseInt(localStorage.getItem(DISMISSED_AT_KEY) || '', 10);
        return !Number.isFinite(lastDismissed) || Date.now() - lastDismissed > NEWSLETTER_POPUP_DISMISS_MS;
    } catch {
        return false;
    }
}
