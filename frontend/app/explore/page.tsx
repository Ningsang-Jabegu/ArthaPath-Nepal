'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppLayout, ExplorePage, Card, Input } from '@/components';
import {
  exploreApi,
  InvestmentOpportunityDto,
  ExploreFilterParams,
  SortBy,
} from '@/lib/api';

type ViewMode = 'grid' | 'list';

const riskColors: Record<string, string> = {
  High: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
  Low: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
};

export default function Explore() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunityDto[]>([]);
  const [lockInPeriods, setLockInPeriods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'Low' | 'Medium' | 'High' | ''>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLockIn, setSelectedLockIn] = useState<string>('');
  const [minLiquidity, setMinLiquidity] = useState<number>(0);
  const [maxCapital, setMaxCapital] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortBy>('risk_asc');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [opps, periods] = await Promise.all([
          exploreApi.getAllOpportunities(),
          exploreApi.getLockInPeriods(),
        ]);
        setOpportunities(opps);
        setLockInPeriods(periods);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load opportunities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  const applyFilters = async () => {
    setIsLoading(true);
    setError('');
    try {
      const filters: ExploreFilterParams = {
        ...(selectedRiskLevel && { risk_level: selectedRiskLevel }),
        ...(selectedType && { investment_type: selectedType as any }),
        ...(minLiquidity > 0 && { min_liquidity_score: minLiquidity }),
        ...(selectedLockIn && { lock_in_period: selectedLockIn }),
        ...(maxCapital > 0 && { max_minimum_capital: maxCapital }),
        sort_by: sortBy,
      };

      const filtered = await exploreApi.getFilteredOpportunities(filters);
      setOpportunities(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side search filtering
  const filteredOpportunities = useMemo(() => {
    if (!searchQuery) return opportunities;
    return opportunities.filter(
      (opp) =>
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [opportunities, searchQuery]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-NP')}`;
  };

  return (
    <AppLayout>
      <ExplorePage>
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Search Bar */}
          <Card title="Search Investments">
            <div className="flex gap-3 items-end">
              <div className="grow">
                <Input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 border border-(--color-border) rounded-md text-(--color-text-primary) hover:bg-(--color-border) transition-colors"
              >
                {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
              </button>
            </div>
          </Card>

          {/* Filters */}
          <Card title="Filter & Sort">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Risk Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Risk Level
                  </label>
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Investment Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  >
                    <option value="">All Types</option>
                    <option value="Stocks">Stocks</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="Bond">Bond</option>
                    <option value="FD">Fixed Deposit</option>
                    <option value="Gold">Gold</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                {/* Lock-in Period */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Lock-in Period
                  </label>
                  <select
                    value={selectedLockIn}
                    onChange={(e) => setSelectedLockIn(e.target.value)}
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  >
                    <option value="">Any Duration</option>
                    {lockInPeriods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Liquidity Score */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Min. Liquidity Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={minLiquidity || ''}
                    onChange={(e) => setMinLiquidity(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  />
                </div>

                {/* Max Capital */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Max. Minimum Capital (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={maxCapital || ''}
                    onChange={(e) => setMaxCapital(Number(e.target.value))}
                    placeholder="Any amount"
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  >
                    <option value="risk_asc">Risk: Low to High</option>
                    <option value="risk_desc">Risk: High to Low</option>
                    <option value="return_desc">Return: High to Low</option>
                    <option value="return_asc">Return: Low to High</option>
                    <option value="liquidity_desc">Liquidity: High to Low</option>
                    <option value="liquidity_asc">Liquidity: Low to High</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-(--color-primary) text-(--color-background) rounded-md hover:opacity-90 transition-opacity font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setSelectedRiskLevel('');
                    setSelectedType('');
                    setSelectedLockIn('');
                    setMinLiquidity(0);
                    setMaxCapital(0);
                    setSortBy('risk_asc');
                    setSearchQuery('');
                    exploreApi.getAllOpportunities().then(setOpportunities);
                  }}
                  className="px-6 py-2 border border-(--color-border) rounded-md text-(--color-text-primary) hover:bg-(--color-border) transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-(--color-text-secondary)">Loading opportunities...</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-(--color-text-secondary)">
                No investment opportunities found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-(--color-text-primary)">
                  {filteredOpportunities.length} Investment{filteredOpportunities.length !== 1 ? 's' : ''} Found
                </h3>
              </div>

              <div
                className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredOpportunities.map((opp) => (
                  <Card
                    key={opp.id}
                    className={`hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex items-start gap-4' : ''
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'grow space-y-2' : 'space-y-3'}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-(--color-text-primary)">
                          {opp.name}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            riskColors[opp.risk_level]
                          }`}
                        >
                          {opp.risk_level}
                        </span>
                      </div>

                      {/* Type Badge */}
                      <div>
                        <span className="inline-block text-sm px-2 py-1 rounded bg-(--color-border) text-(--color-text-secondary) font-medium">
                          {opp.type}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-(--color-text-secondary) line-clamp-2">
                        {opp.description}
                      </p>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-(--color-border)">
                        <div>
                          <p className="text-xs text-(--color-text-secondary)">Expected Return</p>
                          <p className="text-sm font-semibold text-(--color-text-primary)">
                            {opp.expected_return_min}% - {opp.expected_return_max}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-(--color-text-secondary)">Liquidity Score</p>
                          <p className="text-sm font-semibold text-(--color-text-primary)">
                            {opp.liquidity_score}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-(--color-text-secondary)">Min. Capital</p>
                          <p className="text-sm font-semibold text-(--color-text-primary)">
                            {formatCurrency(opp.minimum_capital)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-(--color-text-secondary)">Lock-in Period</p>
                          <p className="text-sm font-semibold text-(--color-text-primary)">
                            {opp.lock_in_period}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </ExplorePage>
    </AppLayout>
  );
}
