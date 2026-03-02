'use client';

import React from 'react';
import { AppLayout, EducationPage, Card } from '@/components';

const articles = [
  {
    id: 1,
    title: 'Understanding Stocks',
    category: 'Stocks',
    risk: 'high',
    preview: 'Learn how stock ownership works and how to build a stock portfolio.',
    icon: '📈',
  },
  {
    id: 2,
    title: 'Mutual Funds 101',
    category: 'Mutual Funds',
    risk: 'medium',
    preview: 'Discover how mutual funds provide diversification and professional management.',
    icon: '💼',
  },
  {
    id: 3,
    title: 'Bond Investing Basics',
    category: 'Bonds',
    risk: 'low',
    preview: 'Understand fixed income securities and how bonds fit into your portfolio.',
    icon: '🏦',
  },
  {
    id: 4,
    title: 'Fixed Deposits in Nepal',
    category: 'Fixed Deposit',
    risk: 'low',
    preview: 'Explore safe, guaranteed returns with Fixed Deposits from Nepali banks.',
    icon: '🔒',
  },
  {
    id: 5,
    title: 'Gold as an Investment',
    category: 'Gold',
    risk: 'medium',
    preview: 'Why gold is a timeless store of value and how to invest in it.',
    icon: '✨',
  },
  {
    id: 6,
    title: 'Real Estate Investment',
    category: 'Real Estate',
    risk: 'medium',
    preview: 'Property investment strategies and considerations for Nepal market.',
    icon: '🏠',
  },
  {
    id: 7,
    title: 'The Power of Compound Interest',
    category: 'General',
    risk: 'low',
    preview: "Einstein called it the 8th wonder. Learn why starting early matters.",
    icon: '⚡',
  },
  {
    id: 8,
    title: 'Risk and Diversification',
    category: 'General',
    risk: 'medium',
    preview: "Don't put all eggs in one basket: the importance of diversification.",
    icon: '🎯',
  },
];

const riskColors: Record<string, string> = {
  low: 'bg-(--color-success-light) text-(--color-success-dark)',
  medium: 'bg-(--color-warning-light) text-(--color-warning-dark)',
  high: 'bg-(--color-error-light) text-(--color-error-dark)',
};

const riskLabels: Record<string, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

export default function Education() {
  return (
    <AppLayout>
      <EducationPage>
        <div className="space-y-8">
          {/* Category Filter */}
          <Card title="Filter by Category">
            <div className="flex flex-wrap gap-2">
              {['All', 'Stocks', 'Mutual Funds', 'Bonds', 'Fixed Deposit', 'Gold', 'Real Estate'].map(
                (category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      category === 'All'
                        ? 'bg-(--color-primary) text-(--color-background) border-(--color-primary)'
                        : 'border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary)'
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </Card>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-(--spacing-lg)">
            {articles.map((article) => (
              <Card key={article.id} title={article.title} interactive>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{article.icon}</span>
                    <span
                      className={`px-2 py-1 rounded text-caption font-medium ${riskColors[article.risk]}`}
                    >
                      {riskLabels[article.risk]}
                    </span>
                  </div>

                  <p className="text-body text-(--color-text-secondary)">
                    {article.preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-label font-medium text-(--color-text-secondary)">
                      {article.category}
                    </span>
                    <button className="text-label font-medium text-(--color-primary) hover:opacity-80 transition-opacity">
                      Read More →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </EducationPage>
    </AppLayout>
  );
}
