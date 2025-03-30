export function checkMail(email: string | undefined) {
  const errors: string[] = []

  if (!email || !email.trim()) {
    errors.push("Email is required.")

    return errors
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address.")
  }

  return errors
}

export function checkPassword(password: string | undefined) {
  console.log("IT WORKED")
  const errors: string[] = []

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long.")
    return errors
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.")
  }

  if (!/[.,]/.test(password)) {
    errors.push("Password must contain at least one special character.")
  }

  return errors
}
