import { AppLayout, Card } from '@/components';

export default function DisclaimerPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-(--spacing-lg) space-y-(--spacing-lg)">
        <h1 className="text-h2 font-bold text-(--color-text-primary)">Financial Disclaimer</h1>
        <p className="text-body text-(--color-text-secondary)">Last updated: March 5, 2026</p>

        <Card title="No Financial Advice">
          <p className="text-body text-(--color-text-primary)">
            ArthaPath Nepal does not provide financial, legal, or tax advice. Information on this platform is educational and informational only.
          </p>
        </Card>

        <Card title="Projection Limitations">
          <p className="text-body text-(--color-text-primary)">
            Projection outputs are generated from assumptions, historical ranges, and model logic. Real-world market outcomes can differ materially.
          </p>
        </Card>

        <Card title="Risk Acknowledgment">
          <p className="text-body text-(--color-text-primary)">
            Investing involves risk, including possible capital loss. High-risk categories can experience volatility, illiquidity, and uncertain returns.
          </p>
        </Card>

        <Card title="Decision Responsibility">
          <p className="text-body text-(--color-text-primary)">
            You are solely responsible for your investment decisions. Please consult a licensed advisor before committing funds.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
