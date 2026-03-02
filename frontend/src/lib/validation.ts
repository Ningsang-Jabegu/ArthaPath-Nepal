/**
 * Form Validation Utilities
 * Handles client-side validation for auth forms
 */

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email';
  }
  return null;
}

/**
 * Validate password
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

/**
 * Validate name
 */
export function validateName(name: string): string | null {
  if (!name) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.length > 100) {
    return 'Name must not exceed 100 characters';
  }
  return null;
}

/**
 * Validate login form
 */
export function validateLoginForm(
  email: string,
  password: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

/**
 * Validate registration form
 */
export function validateRegisterForm(
  email: string,
  password: string,
  name: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  return errors;
}
