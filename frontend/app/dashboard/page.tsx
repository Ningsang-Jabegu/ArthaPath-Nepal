'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import AuthFormButton from '@/components/auth-form-button';

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ArthaPath
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-20 w-full px-6 py-8">
        <div className="max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You have successfully logged in. More features coming soon.
          </p>

          {/* Dashboard Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Simulator
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Start planning your investments with our smart simulator
              </p>
              <button className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-700">
                Open Simulator
              </button>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Learn
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Explore investment education articles and guides
              </p>
              <button className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-700">
                Browse Articles
              </button>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Profile
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences
              </p>
              <button className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member Since
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(user?.created_at || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Dashboard Page
 * Protected route - requires authentication
 */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
