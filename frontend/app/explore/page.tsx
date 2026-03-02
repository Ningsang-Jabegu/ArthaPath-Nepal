'use client';

import React from 'react';
import { AppLayout, ExplorePage, Card } from '@/components';

export default function Explore() {
  return (
    <AppLayout>
      <ExplorePage>
        <div className="space-y-8">
          {/* Filters Section */}
          <Card title="Filter Investments">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-(--spacing-md)">
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Risk Level
                </label>
                <select className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)">
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Type
                </label>
                <select className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)">
                  <option>All Types</option>
                  <option>Stocks</option>
                  <option>Mutual Funds</option>
                  <option>Bonds</option>
                  <option>Fixed Deposit</option>
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Duration
                </label>
                <select className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)">
                  <option>All</option>
                  <option>Short Term</option>
                  <option>Medium Term</option>
                  <option>Long Term</option>
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Liquidity
                </label>
                <select className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)">
                  <option>All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Investment Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-(--spacing-lg)">
            {[
              { name: 'Stocks', icon: '📈', description: 'Own pieces of companies' },
              { name: 'Mutual Funds', icon: '💼', description: 'Diversified portfolios' },
              { name: 'Bonds', icon: '🏦', description: 'Fixed income securities' },
              { name: 'Fixed Deposit', icon: '🔒', description: 'Guaranteed returns' },
              { name: 'Gold', icon: '✨', description: 'Safe store of value' },
              { name: 'Real Estate', icon: '🏠', description: 'Property investments' },
            ].map((investment) => (
              <Card key={investment.name} title={investment.name} interactive>
                <div className="space-y-3">
                  <p className="text-3xl">{investment.icon}</p>
                  <p className="text-body text-(--color-text-secondary)">
                    {investment.description}
                  </p>
                  <button className="text-label font-medium text-(--color-primary) hover:opacity-80 transition-opacity">
                    Learn More →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ExplorePage>
    </AppLayout>
  );
}
