/**
 * Remembers, for the browser session, that the visitor agreed to the IPO Centre's important notice. Storage can be
 * blocked (private browsing, disabled site data) and then even reading `window.sessionStorage` throws, so every
 * access is guarded: blocked storage reads as "not agreed yet", and a failed write only means the visitor is asked
 * again on the next IPO page.
 */

export const IPO_NOTICE_STORAGE_KEY = 'bestari:ir:ipo-notice'
const AGREED = 'agreed'

export function hasAgreedToIpoNotice(): boolean {
  try {
    return window.sessionStorage.getItem(IPO_NOTICE_STORAGE_KEY) === AGREED
  } catch {
    return false
  }
}

export function rememberIpoNoticeAgreement(): void {
  try {
    window.sessionStorage.setItem(IPO_NOTICE_STORAGE_KEY, AGREED)
  } catch {
    // Blocked storage: the gate still opens for this page (its own state), it just is not remembered.
  }
}
