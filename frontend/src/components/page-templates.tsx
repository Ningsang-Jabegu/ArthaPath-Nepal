'use client';

import React from 'react';

interface PageTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function PageTemplate({ title, description, children, action }: PageTemplateProps) {
  return (
    <div className="p-(--spacing-lg) md:p-(--spacing-xl) max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-(--spacing-lg) gap-(--spacing-md)">
        <div>
          <h1 className="text-h2 font-bold text-(--color-text-primary) mb-(--spacing-xs)">
            {title}
          </h1>
          {description && (
            <p className="text-body text-(--color-text-secondary)">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex gap-(--spacing-md)">{action}</div>}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}

/**
 * Dashboard Page Template
 */
interface DashboardPageProps {
  title?: string;
  children: React.ReactNode;
}

export function DashboardPage({ title = 'Dashboard', children }: DashboardPageProps) {
  return (
    <PageTemplate title={title} description="View your investment summary and projections">
      {children}
    </PageTemplate>
  );
}

/**
 * Simulator Page Template
 */
interface SimulatorPageProps {
  children: React.ReactNode;
}

export function SimulatorPage({ children }: SimulatorPageProps) {
  return (
    <PageTemplate
      title="Investment Simulator"
      description="Experiment with different investment scenarios in real-time"
    >
      {children}
    </PageTemplate>
  );
}

/**
 * Explore Page Template
 */
interface ExplorePageProps {
  children: React.ReactNode;
}

export function ExplorePage({ children }: ExplorePageProps) {
  return (
    <PageTemplate
      title="Explore Investments"
      description="Discover different investment opportunities tailored to your profile"
    >
      {children}
    </PageTemplate>
  );
}

/**
 * Education Page Template
 */
interface EducationPageProps {
  children: React.ReactNode;
}

export function EducationPage({ children }: EducationPageProps) {
  return (
    <PageTemplate
      title="Investment Education"
      description="Learn about different investment types and strategies"
    >
      {children}
    </PageTemplate>
  );
}
