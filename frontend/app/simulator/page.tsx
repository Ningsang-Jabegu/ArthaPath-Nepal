'use client';

import React, { useState } from 'react';
import { AppLayout, SimulatorPage, Card, Button, Input } from '@/components';

export default function Simulator() {
  const [capital, setCapital] = useState<number>(100000);
  const [monthly, setMonthly] = useState<number>(5000);
  const [duration, setDuration] = useState<number>(5);
  const [riskLevel, setRiskLevel] = useState<string>('balanced');

  return (
    <AppLayout>
      <SimulatorPage>
        <div className="grid lg:grid-cols-3 gap-(--spacing-lg)">
          {/* Input Panel */}
          <Card variant="summary" title="Investment Parameters">
            <div className="space-y-4">
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Initial Capital: ₹{capital.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-caption text-(--color-text-secondary) mt-1">
                  ₹10K - ₹50L
                </p>
              </div>

              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Monthly Investment: ₹{monthly.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-caption text-(--color-text-secondary) mt-1">
                  ₹1K - ₹5L
                </p>
              </div>

              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Duration: {duration} years
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-caption text-(--color-text-secondary) mt-1">
                  1 - 50 years
                </p>
              </div>

              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                  Risk Level
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="primary" className="flex-1">
                  Calculate
                </Button>
                <Button variant="secondary" className="flex-1">
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Projection Card */}
            <Card variant="summary" title="Projection Results">
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-l-4 border-(--color-success) pl-4">
                    <p className="text-caption text-(--color-text-secondary)">Conservative</p>
                    <p className="text-2xl font-bold text-(--color-success)">₹25,64,000</p>
                  </div>
                  <div className="border-l-4 border-(--color-warning) pl-4">
                    <p className="text-caption text-(--color-text-secondary)">Expected</p>
                    <p className="text-2xl font-bold text-(--color-warning)">₹35,84,000</p>
                  </div>
                  <div className="border-l-4 border-(--color-error) pl-4">
                    <p className="text-caption text-(--color-text-secondary)">Optimistic</p>
                    <p className="text-2xl font-bold text-(--color-error)">₹48,92,000</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Allocation Card */}
            <Card variant="summary" title="Suggested Allocation">
              <div className="space-y-3">
                {[
                  { name: 'Stocks', percent: 60 },
                  { name: 'Mutual Funds', percent: 20 },
                  { name: 'Bonds', percent: 15 },
                  { name: 'Fixed Deposit', percent: 5 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="text-label font-medium text-(--color-text-primary) w-32">
                      {item.name}
                    </span>
                    <div className="flex-1 bg-(--color-border) rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-(--color-primary) h-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-label font-medium text-(--color-primary) w-12 text-right">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </SimulatorPage>
    </AppLayout>
  );
}
