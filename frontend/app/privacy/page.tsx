import { AppLayout, Card } from '@/components';

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-(--spacing-lg) space-y-(--spacing-lg)">
        <h1 className="text-h2 font-bold text-(--color-text-primary)">Privacy Policy</h1>
        <p className="text-body text-(--color-text-secondary)">Last updated: March 5, 2026</p>

        <Card title="1. What We Collect">
          <ul className="list-disc pl-5 space-y-2 text-body text-(--color-text-primary)">
            <li>Account information such as name and email.</li>
            <li>Simulator inputs and saved planning preferences.</li>
            <li>Usage telemetry and product analytics events.</li>
            <li>Error and performance diagnostics for reliability.</li>
          </ul>
        </Card>

        <Card title="2. How We Use Data">
          <ul className="list-disc pl-5 space-y-2 text-body text-(--color-text-primary)">
            <li>Authenticate users and secure access.</li>
            <li>Generate investment simulations and save plans.</li>
            <li>Improve product experience and usability.</li>
            <li>Monitor security, errors, and abuse.</li>
          </ul>
        </Card>

        <Card title="3. Third-Party Processors">
          <p className="text-body text-(--color-text-primary)">
            We use PostHog for product analytics and Sentry for error monitoring. These services process technical metadata and event data under
            their own policies and safeguards.
          </p>
        </Card>

        <Card title="4. Cookies and Local Storage">
          <p className="text-body text-(--color-text-primary)">
            We use browser storage for theme settings, simulator preferences, and acknowledgment flags (such as risk-warning confirmations).
          </p>
        </Card>

        <Card title="5. User Rights">
          <p className="text-body text-(--color-text-primary)">
            You may request profile updates or account deletion through support channels. We aim to handle requests in line with applicable Nepal
            data protection obligations and good-practice privacy standards.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
