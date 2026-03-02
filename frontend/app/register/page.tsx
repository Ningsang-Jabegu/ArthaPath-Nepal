'use client';

import { FormEvent, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import FormInput from '@/components/form-input';
import AuthFormButton from '@/components/auth-form-button';
import { validateRegisterForm } from '@/lib/validation';
import { ValidationErrors } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error: authError, isAuthenticated } = useAuth();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    if (!agreeToTerms) {
      setGeneralError('You must agree to the terms and conditions');
      return;
    }

    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    // Validate form
    const validationErrors = validateRegisterForm(email, password, name);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setGeneralError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join ArthaPath and start planning your investments
          </p>
        </div>

        {/* Error Messages */}
        {authError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {authError}
            </p>
          </div>
        )}

        {generalError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {generalError}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            ref={nameRef}
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name}
            required
          />

          <FormInput
            ref={emailRef}
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            required
          />

          <FormInput
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="••••••••"
            helperText="At least 8 characters"
            error={errors.password}
            required
          />

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300"
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="font-semibold text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="font-semibold text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <AuthFormButton type="submit" isLoading={isLoading}>
            Create Account
          </AuthFormButton>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
          >
            Sign in
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          We respect your privacy. Read our policy to learn how we handle data.
        </p>
      </div>
    </div>
  );
}
