export function checkMail(email: string | undefined) {
  const errors: string[] = [];

  if (!email || !email.trim()) {
    errors.push('Email is required.');

    return errors;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  return errors;
}

export function checkPassword(password: string | undefined) {
  const errors: string[] = [];

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
    return errors;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }

  if (!/[.,]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return errors;
}

export function checkName(name: string) {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push('Name cannot be empty.');
  }

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (/[\d]/.test(name)) {
    errors.push('Name cannot contain numbers.');
  }

  if (/[^a-zA-ZğüşöçıİĞÜŞÖÇ'-\s]/.test(name)) {
    errors.push('Name contains invalid characters.');
  }

  return errors;
}

export function checkConfirmPassword(
    password: string,
    confirmPassword: string,
) {
  const errors: string[] = [];

  if (password !== confirmPassword) {
    errors.push('Passwords must match.');
  }

  return errors;
}
