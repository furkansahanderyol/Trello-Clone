export function validateEmail(email: string) {
  const errors: string[] = []

  if (!email.trim()) {
    errors.push("Email is required.")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address.")
  }

  return errors
}
