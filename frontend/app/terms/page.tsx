import { AppLayout, Card } from '@/components';

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-(--spacing-lg) space-y-(--spacing-lg)">
        <h1 className="text-h2 font-bold text-(--color-text-primary)">Terms of Service</h1>
        <p className="text-body text-(--color-text-secondary)">Last updated: March 5, 2026</p>

        <Card title="1. Scope of Service">
          <p className="text-body text-(--color-text-primary)">
            ArthaPath Nepal provides educational tools, simulations, and planning insights for personal finance and investment literacy.
            The platform does not execute trades and does not provide personalized investment advice.
          </p>
        </Card>

        <Card title="2. User Responsibilities">
          <ul className="list-disc pl-5 space-y-2 text-body text-(--color-text-primary)">
            <li>You are responsible for validating decisions with licensed professionals.</li>
            <li>You must provide accurate inputs for meaningful projections.</li>
            <li>You must not misuse the platform for fraudulent or harmful activity.</li>
          </ul>
        </Card>

        <Card title="3. Projection and Risk Notice">
          <p className="text-body text-(--color-text-primary)">
            All projections are model-based estimates using assumptions and historical patterns. Market behavior can change significantly.
            Returns are not promised, and losses can occur.
          </p>
        </Card>

        <Card title="4. Limitation of Liability">
          <p className="text-body text-(--color-text-primary)">
            ArthaPath Nepal and its contributors are not liable for direct or indirect financial losses, opportunity losses, or damages arising from
            use of simulator outputs, educational content, or AI-generated explanations.
          </p>
        </Card>

        <Card title="5. Data and Privacy">
          <p className="text-body text-(--color-text-primary)">
            Your use of the platform is also governed by our Privacy Policy. By using the service, you consent to processing necessary data for
            authentication, analytics, security monitoring, and feature operation.
          </p>
        </Card>

        <Card title="6. Regulatory Context">
          <p className="text-body text-(--color-text-primary)">
            Content is provided for education and planning support. This service should not be interpreted as securities solicitation or licensed
            portfolio management under Nepal regulations.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
