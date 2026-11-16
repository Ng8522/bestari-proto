const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shared by the IR enquiry form and the news alerts sign-up. */
export function emailError(email: string): string | undefined {
  const value = email.trim()
  if (!value) return 'Please enter your email address.'
  return EMAIL_PATTERN.test(value) ? undefined : 'Please enter a valid email address.'
}
