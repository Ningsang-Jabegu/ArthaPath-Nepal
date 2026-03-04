'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout, EducationPage, Card, Input } from '@/components';
import { educationApi, EducationArticleDto } from '@/lib/api';

type EducationCategory =
  | 'All'
  | 'Stocks'
  | 'Mutual Fund'
  | 'Bond'
  | 'Fixed Deposit'
  | 'Gold'
  | 'Real Estate'
  | 'Business'
  | 'General';

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

const categories: EducationCategory[] = [
  'All',
  'Stocks',
  'Mutual Fund',
  'Bond',
  'Fixed Deposit',
  'Gold',
  'Real Estate',
  'Business',
  'General',
];

const getRiskLevel = (category: string): string => {
  const highRisk = ['Stocks', 'Business'];
  const mediumRisk = ['Mutual Fund', 'Gold', 'Real Estate'];
  const lowRisk = ['Bond', 'Fixed Deposit', 'General'];

  if (highRisk.includes(category)) return 'high';
  if (mediumRisk.includes(category)) return 'medium';
  return 'low';
};

export default function Education() {
  const [articles, setArticles] = useState<EducationArticleDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EducationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await educationApi.getAllArticles();
        setArticles(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load education articles'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles by category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <AppLayout>
      <EducationPage>
        <div className="space-y-8">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Search Bar */}
          <Card title="Search Articles">
            <Input
              type="text"
              placeholder="Search by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </Card>

          {/* Category Filter */}
          <Card title="Filter by Category">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    category === selectedCategory
                      ? 'bg-(--color-primary) text-(--color-background) border-(--color-primary)'
                      : 'border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary)'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Card>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-(--color-text-secondary)">
                Loading articles...
              </p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-(--color-text-secondary)">
                No articles found. Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-(--spacing-lg)">
              {filteredArticles.map((article) => {
                const riskLevel = getRiskLevel(article.category);
                return (
                  <Link
                    key={article.id}
                    href={`/education/${article.id}`}
                    className="no-underline"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="space-y-3 h-full flex flex-col">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-(--color-text-primary) line-clamp-2 flex-grow">
                          {article.title}
                        </h3>

                        {/* Category and Risk */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-(--color-text-secondary) px-2 py-1 rounded bg-(--color-border)">
                            {article.category}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              riskColors[riskLevel]
                            }`}
                          >
                            {riskLabels[riskLevel]}
                          </span>
                        </div>

                        {/* Preview */}
                        <p className="text-sm text-(--color-text-secondary) line-clamp-3 flex-grow">
                          {article.content.substring(0, 150)}...
                        </p>

                        {/* Read More Button */}
                        <div className="pt-2 border-t border-(--color-border)">
                          <button className="text-sm font-medium text-(--color-primary) hover:opacity-80 transition-opacity">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </EducationPage>
    </AppLayout>
  );
}
