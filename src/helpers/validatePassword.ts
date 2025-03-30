export const validatePassword = (password: string) => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long.")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.")
  }

  if (!/[.,]/.test(password)) {
    errors.push("Password must contain at least one special character.")
  }

  return errors
}
