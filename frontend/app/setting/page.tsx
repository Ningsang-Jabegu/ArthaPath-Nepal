'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout, Card, Button, Input } from '@/components';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function SettingPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setDisplayName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  return (
    <AppLayout>
      <div className="p-(--spacing-lg) md:p-(--spacing-xl) space-y-8">
        <div className="space-y-3">
          <p className="text-label uppercase tracking-[0.2em] text-(--color-primary)">Account</p>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-primary)">Settings</h1>
          <p className="max-w-3xl text-body text-(--color-text-secondary)">
            Update your profile details and review the account actions available in the app.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Profile Settings">
            <div className="space-y-4">
              <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" type="button">Save Changes</Button>
                <Link href="/profile" className="inline-flex">
                  <Button variant="secondary" type="button">View Profile</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card title="Preferences">
            <div className="space-y-3 text-body text-(--color-text-secondary)">
              <p>Theme switching, notifications, and account controls are handled from the shared header and dashboard actions.</p>
              <p>Use the logout option in the top-right menu to end your session safely.</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
