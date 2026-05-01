'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout, Card, Button } from '@/components';

const faqs = [
  {
    question: 'Is ArthaPath financial advice?',
    answer:
      'No. ArthaPath is an educational and planning tool. All outputs are estimates and should be reviewed with a qualified financial advisor before making decisions.',
  },
  {
    question: 'Why do the projections change when I adjust inputs?',
    answer:
      'The simulator recalculates based on your capital, monthly contribution, duration, risk tolerance, liquidity need, and emergency fund status. Small input changes can shift risk profile and allocation.',
  },
  {
    question: 'Can I save and reload a plan later?',
    answer:
      'Yes. Signed-in users can save plans from the dashboard and load them again from the saved plans section.',
  },
  {
    question: 'Why do I see cached or repeated education content?',
    answer:
      'Education pages are cached for performance. If content looks stale, refresh the page or clear the browser cache after updates.',
  },
  {
    question: 'How do I contact support if something is broken?',
    answer:
      'Use the Help Center for guided support links, then check your profile and dashboard for session-related issues. If the problem persists, log out and back in to refresh your session.',
  },
  {
    question: 'Why does logout sometimes not seem to do anything?',
    answer:
      'Logout clears local authentication data and returns you to the login screen. If a stale browser tab is still open, refresh it or open the login page directly.',
  },
];

export default function FAQPage() {
  return (
    <AppLayout>
      <div className="p-(--spacing-lg) md:p-(--spacing-xl) space-y-8">
        <div className="space-y-3">
          <p className="text-label uppercase tracking-[0.2em] text-(--color-primary)">Support</p>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-primary)">Frequently Asked Questions</h1>
          <p className="max-w-3xl text-body text-(--color-text-secondary)">
            Quick answers to the most common questions about ArthaPath, account access, and the planning experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} title={faq.question}>
                <p className="text-body text-(--color-text-secondary)">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card title="Need more help?">
              <div className="space-y-3 text-body text-(--color-text-secondary)">
                <p>Visit the Help Center for guided support topics and quick navigation to the main app areas.</p>
                <Link href="/help" className="inline-flex">
                  <Button variant="secondary">Open Help Center</Button>
                </Link>
              </div>
            </Card>

            <Card title="Useful Links">
              <div className="space-y-3 flex flex-col">
                <Link href="/education" className="inline-flex">
                  <Button variant="secondary">Browse Education</Button>
                </Link>
                <Link href="/dashboard" className="inline-flex">
                  <Button variant="secondary">Go to Dashboard</Button>
                </Link>
                <Link href="/profile" className="inline-flex">
                  <Button variant="secondary">View Profile</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}