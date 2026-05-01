'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout, Card, Button } from '@/components';
import { useAuth } from '@/context/auth-context';
import { getAccessToken, userApi } from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setIsLoading(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return (
    <AppLayout>
      <div className="p-(--spacing-lg) md:p-(--spacing-xl) space-y-8">
        <div className="space-y-3">
          <p className="text-label uppercase tracking-[0.2em] text-(--color-primary)">Account</p>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-primary)">Profile</h1>
          <p className="max-w-3xl text-body text-(--color-text-secondary)">
            Review your account details and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Profile Details">
            {isLoading ? (
              <p className="text-body text-(--color-text-secondary)">Loading profile...</p>
            ) : !profile ? (
              <div className="space-y-3 text-body text-(--color-text-secondary)">
                <p>You need to sign in to view your profile details.</p>
                <Link href="/login" className="inline-flex">
                  <Button variant="primary">Go to Login</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 text-body">
                <div>
                  <p className="text-sm text-(--color-text-secondary)">Name</p>
                  <p className="text-(--color-text-primary)">{profile?.name ?? 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-(--color-text-secondary)">Email</p>
                  <p className="text-(--color-text-primary)">{profile?.email ?? 'Not set'}</p>
                </div>
              </div>
            )}
          </Card>

          <Card title="Quick Links">
            <div className="space-y-3 flex flex-col">
              <Link href="/setting" className="inline-flex">
                <Button variant="secondary">Open Settings</Button>
              </Link>
              <Link href="/help" className="inline-flex">
                <Button variant="secondary">Get Help</Button>
              </Link>
              <Link href="/dashboard" className="inline-flex">
                <Button variant="primary">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
