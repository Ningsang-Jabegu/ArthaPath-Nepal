'use client';

import { FormEvent, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import FormInput from '@/components/form-input';
import AuthFormButton from '@/components/auth-form-button';
import { SimpleThemeToggle } from '@/components/simple-theme-toggle';
import { validateLoginForm } from '@/lib/validation';
import { ValidationErrors } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError, isAuthenticated } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    // Validate form
    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
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
            Welcome Back
          </h1>
          <p 
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Sign in to your ArthaPath account
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
            error={errors.password}
            required
          />

          <AuthFormButton type="submit" isLoading={isLoading}>
            Sign In
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

        {/* Register Link */}
        <p 
          className="text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p 
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
