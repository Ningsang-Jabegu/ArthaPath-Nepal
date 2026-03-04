'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout, EducationPage, Card } from '@/components';
import { EducationArticleDto } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

const riskColors: Record<string, string> = {
  high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
  low: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
};

const riskLabels: Record<string, string> = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};

const getRiskLevel = (category: string): string => {
  const highRisk = ['Stocks', 'Business'];
  const mediumRisk = ['Mutual Fund', 'Gold', 'Real Estate'];
  const lowRisk = ['Bond', 'Fixed Deposit', 'General'];

  if (highRisk.includes(category)) return 'high';
  if (mediumRisk.includes(category)) return 'medium';
  return 'low';
};

export default function EducationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<EducationArticleDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/education/articles`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch articles');

        const articles: EducationArticleDto[] = await response.json();
        const foundArticle = articles.find((a) => a.id === id);

        if (!foundArticle) throw new Error('Article not found');

        setArticle(foundArticle);
        
        // Track article view
        trackEvent('article_viewed', {
          article_id: foundArticle.id,
          article_title: foundArticle.title,
          category: foundArticle.category,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load article'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <EducationPage>
          <div className="text-center py-12">
            <p className="text-(--color-text-secondary)">Loading article...</p>
          </div>
        </EducationPage>
      </AppLayout>
    );
  }

  if (error || !article) {
    return (
      <AppLayout>
        <EducationPage>
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error || 'Article not found'}
              </p>
            </div>
            <Link
              href="/education"
              className="text-(--color-primary) hover:opacity-80 transition-opacity font-medium"
            >
              ← Back to Articles
            </Link>
          </div>
        </EducationPage>
      </AppLayout>
    );
  }

  const riskLevel = getRiskLevel(article.category);

  return (
    <AppLayout>
      <EducationPage>
        <div className="space-y-6">
          {/* Back Button */}
          <Link
            href="/education"
            className="text-(--color-primary) hover:opacity-80 transition-opacity font-medium inline-block"
          >
            ← Back to Articles
          </Link>

          {/* Article Header */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="grow">
                  <h1 className="text-3xl font-bold text-(--color-text-primary) mb-2">
                    {article.title}
                  </h1>
                  <p className="text-body text-(--color-text-secondary)">
                    Last updated:{' '}
                    {new Date(article.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-(--color-border)">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-(--color-text-secondary)">
                    Category:
                  </span>
                  <span className="text-sm font-medium text-(--color-text-primary) px-3 py-1 rounded bg-(--color-border)">
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-(--color-text-secondary)">
                    Risk Level:
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded ${
                      riskColors[riskLevel]
                    }`}
                  >
                    {riskLabels[riskLevel]}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <Card title="Content">
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <div
                className="text-body text-(--color-text-primary) whitespace-pre-wrap leading-relaxed"
                style={{ lineHeight: '1.8', color: 'var(--color-text-primary)' }}
              >
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Card>

          {/* Related Actions */}
          <Card>
            <div className="flex gap-3">
              <Link
                href="/education"
                className="flex-1 px-4 py-2 rounded border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-border) transition-colors text-center font-medium"
              >
                ← Back to Articles
              </Link>
              <button className="flex-1 px-4 py-2 rounded bg-(--color-primary) text-(--color-background) hover:opacity-90 transition-opacity font-medium">
                Save to Learning Queue
              </button>
            </div>
          </Card>
        </div>
      </EducationPage>
    </AppLayout>
  );
}
