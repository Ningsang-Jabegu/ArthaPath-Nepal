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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Capital Card */}
            <Card variant="metric" title="Total Capital">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                ₹0
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Not invested yet
              </p>
            </Card>

            {/* Risk Profile Card */}
            <Card variant="metric" title="Risk Profile">
              <p className="text-lg font-semibold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                Not Set
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Complete your assessment
              </p>
            </Card>

            {/* Monthly Contribution Card */}
            <Card variant="metric" title="Monthly Contribution">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                ₹0
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Not set
              </p>
            </Card>

            {/* Duration Card */}
            <Card variant="metric" title="Investment Duration">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                -
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Years
              </p>
            </Card>
          </div>

          {/* Welcome Card */}
          <Card variant="summary" title={`Welcome, ${user?.name}!`} interactive>
            <div className="space-y-4">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Get started by creating your first investment plan. Answer a few questions about your
                financial goals, and we'll provide personalized investment recommendations.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">Start Assessment</Button>
                <Button variant="secondary">View Education</Button>
              </div>
            </div>
          </Card>

          {/* User Info */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <Card title="Your Profile">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Name
                  </p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Email
                  </p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Member Since
                  </p>
                  <p style={{ color: 'var(--color-text-primary)' }}>
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
