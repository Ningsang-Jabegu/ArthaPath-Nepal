'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout, DashboardPage, Card, Button } from '@/components';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-(--spacing-lg) mb-(--spacing-lg)">
            {/* Total Capital Card */}
            <Card variant="metric" title="Total Capital">
              <p className="text-3xl font-bold text-(--color-primary) mt-2">₹0</p>
              <p className="text-caption text-(--color-text-secondary) mt-2">Not invested yet</p>
            </Card>

            {/* Risk Profile Card */}
            <Card variant="metric" title="Risk Profile">
              <p className="text-lg font-semibold text-(--color-primary) mt-2">Not Set</p>
              <p className="text-caption text-(--color-text-secondary) mt-2">
                Complete your assessment
              </p>
            </Card>

            {/* Monthly Contribution Card */}
            <Card variant="metric" title="Monthly Contribution">
              <p className="text-3xl font-bold text-(--color-primary) mt-2">₹0</p>
              <p className="text-caption text-(--color-text-secondary) mt-2">Not set</p>
            </Card>

            {/* Duration Card */}
            <Card variant="metric" title="Investment Duration">
              <p className="text-3xl font-bold text-(--color-primary) mt-2">-</p>
              <p className="text-caption text-(--color-text-secondary) mt-2">Years</p>
            </Card>
          </div>

          {/* Welcome Card */}
          <Card variant="summary" title={`Welcome, ${user?.name}!`} interactive>
            <div className="space-y-4">
              <p className="text-body text-(--color-text-secondary)">
                Get started by creating your first investment plan. Answer a few questions about your
                financial goals, and we'll provide personalized investment recommendations.
              </p>
              <div className="flex gap-(--spacing-md) flex-wrap">
                <Button variant="primary">Start Assessment</Button>
                <Button variant="secondary">View Education</Button>
              </div>
            </div>
          </Card>

          {/* User Info */}
          <div className="mt-(--spacing-lg) grid md:grid-cols-2 gap-(--spacing-lg)">
            <Card title="Your Profile">
              <div className="space-y-3">
                <div>
                  <p className="text-label font-medium text-(--color-text-secondary)">Name</p>
                  <p className="text-body text-(--color-text-primary)">{user?.name}</p>
                </div>
                <div>
                  <p className="text-label font-medium text-(--color-text-secondary)">Email</p>
                  <p className="text-body text-(--color-text-primary)">{user?.email}</p>
                </div>
                <div>
                  <p className="text-label font-medium text-(--color-text-secondary)">Member Since</p>
                  <p className="text-body text-(--color-text-primary)">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'Recently'}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions">
              <div className="space-y-2 flex flex-col">
                <Button variant="primary">Edit Profile</Button>
                <Button variant="secondary">View Settings</Button>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </DashboardPage>
      </AppLayout>
    </ProtectedRoute>
  );
}
