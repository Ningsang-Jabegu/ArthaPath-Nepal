'use client';

import { FormEvent, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import FormInput from '@/components/form-input';
import AuthFormButton from '@/components/auth-form-button';
import { SimpleThemeToggle } from '@/components/simple-theme-toggle';
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
    <div 
      className="flex min-h-screen items-center justify-center transition-colors"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div 
        className="w-full max-w-md rounded-xl border p-8 shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--color-background-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        {/* Theme Toggle */}
        <div className="mb-6 flex justify-end">
          <SimpleThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Create Account
          </h1>
          <p 
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Join ArthaPath and start planning your investments
          </p>
        </div>

        {/* Error Messages */}
        {authError && (
          <div 
            className="mb-4 rounded-lg p-4"
            style={{ backgroundColor: 'var(--color-error-light)' }}
          >
            <p 
              className="text-sm font-medium"
              style={{ color: 'var(--color-error)' }}
            >
              {authError}
            </p>
          </div>
        )}

        {generalError && (
          <div 
            className="mb-4 rounded-lg p-4"
            style={{ backgroundColor: 'var(--color-error-light)' }}
          >
            <p 
              className="text-sm font-medium"
              style={{ color: 'var(--color-error)' }}
            >
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
          <div 
            className="flex items-start gap-3 rounded-lg p-3"
            style={{ backgroundColor: 'var(--color-background-tertiary)' }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer rounded"
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="font-semibold transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="font-semibold transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
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
          <div 
            className="flex-1 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          ></div>
          <span 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >or</span>
          <div 
            className="flex-1 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          ></div>
        </div>

        {/* Login Link */}
        <p 
          className="text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Sign in
          </Link>
        </p>

        {/* Footer */}
        <p 
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          We respect your privacy. Read our policy to learn how we handle data.
        </p>
      </div>
    </div>
  );
}
