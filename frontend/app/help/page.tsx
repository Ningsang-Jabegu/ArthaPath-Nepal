'use client';

import React from 'react';
import { AppLayout, Card, Button } from '@/components';
import Link from 'next/link';

const helpTopics = [
  {
    title: 'Getting Started',
    description: 'Learn how to use the dashboard, simulator, and education tools.',
    href: '/simulator',
  },
  {
    title: 'Understanding Risk',
    description: 'Read about risk profiles, diversification, and time horizon.',
    href: '/education',
  },
  {
    title: 'Saving a Plan',
    description: 'Save and compare investment plans from the dashboard.',
    href: '/dashboard',
  },
];

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="p-(--spacing-lg) md:p-(--spacing-xl) space-y-8">
        <div className="space-y-3">
          <p className="text-label uppercase tracking-[0.2em] text-(--color-primary)">Support</p>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-primary)">Help Center</h1>
          <p className="max-w-3xl text-body text-(--color-text-secondary)">
            Find quick guidance for the main parts of the app, or jump to the relevant page and continue from there.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {helpTopics.map((topic) => (
            <Card key={topic.title} title={topic.title} className="h-full">
              <p className="text-body text-(--color-text-secondary)">{topic.description}</p>
              <div className="mt-6">
                <Link href={topic.href} className="inline-flex">
                  <Button variant="secondary">Open</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Need more help?">
          <div className="space-y-3 text-body text-(--color-text-secondary)">
            <p>If something still feels broken, refresh the page after logging out and back in.</p>
            <p>For account-specific issues, visit your profile page and verify your details.</p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
