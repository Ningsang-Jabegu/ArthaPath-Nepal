'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout, Card, Input, Button } from '@/components';
import {
  adminApi,
  CategoryDto,
  CreateCategoryDto,
  UsageAnalytics,
} from '@/lib/api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'categories'>('analytics');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    type: 'Stocks',
    expected_return_min: 0,
    expected_return_max: 0,
    risk_level: 'Medium',
    liquidity_score: 5,
    lock_in_period: 'None',
    minimum_capital: 0,
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [analyticsData, categoriesData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAllCategories(),
      ]);
      setAnalytics(analyticsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setModalMode('create');
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'Stocks',
      expected_return_min: 0,
      expected_return_max: 0,
      risk_level: 'Medium',
      liquidity_score: 5,
      lock_in_period: 'None',
      minimum_capital: 0,
      description: '',
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: CategoryDto) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      expected_return_min: category.expected_return_min,
      expected_return_max: category.expected_return_max,
      risk_level: category.risk_level,
      liquidity_score: category.liquidity_score,
      lock_in_period: category.lock_in_period,
      minimum_capital: category.minimum_capital,
      description: category.description,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (modalMode === 'create') {
        await adminApi.createCategory(formData);
      } else if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData);
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setIsLoading(true);
    setError('');
    try {
      await adminApi.deleteCategory(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const riskChartData = analytics
    ? [
        { name: 'Low Risk', value: analytics.categoriesByRiskLevel.Low },
        { name: 'Medium Risk', value: analytics.categoriesByRiskLevel.Medium },
        { name: 'High Risk', value: analytics.categoriesByRiskLevel.High },
      ]
    : [];

  const typeChartData = analytics
    ? Object.entries(analytics.categoriesByType).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const userRoleData = analytics
    ? [
        { name: 'Admin Users', count: analytics.usersByRole.admin },
        { name: 'Regular Users', count: analytics.usersByRole.user },
      ]
    : [];

  return (
    <AppLayout>
      <div className="min-h-screen bg-(--color-background) p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-h1 font-bold text-(--color-text-primary)">
              Admin Dashboard
            </h1>
            <p className="text-body text-(--color-text-secondary) mt-2">
              Manage investment categories and view platform analytics
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-(--color-border)">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
                  : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
                  : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              📁 Categories
            </button>
          </div>

          {isLoading && !analytics && (
            <div className="text-center py-12">
              <p className="text-(--color-text-secondary)">Loading...</p>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Users">
                  <p className="text-h2 font-bold text-(--color-text-primary)">
                    {analytics.totalUsers}
                  </p>
                  <p className="text-sm text-(--color-text-secondary) mt-1">
                    Platform users
                  </p>
                </Card>
                <Card title="Admin Users">
                  <p className="text-h2 font-bold text-(--color-primary)">
                    {analytics.usersByRole.admin}
                  </p>
                  <p className="text-sm text-(--color-text-secondary) mt-1">
                    Administrators
                  </p>
                </Card>
                <Card title="Regular Users">
                  <p className="text-h2 font-bold text-(--color-text-primary)">
                    {analytics.usersByRole.user}
                  </p>
                  <p className="text-sm text-(--color-text-secondary) mt-1">
                    Active users
                  </p>
                </Card>
                <Card title="Investment Categories">
                  <p className="text-h2 font-bold text-(--color-text-primary)">
                    {analytics.totalInvestmentCategories}
                  </p>
                  <p className="text-sm text-(--color-text-secondary) mt-1">
                    Available options
                  </p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Risk Level Distribution */}
                <Card title="Categories by Risk Level">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Type Distribution */}
                <Card title="Categories by Investment Type">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={typeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* User Roles */}
                <Card title="User Role Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userRoleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Recent Users */}
                <Card title="Recent Users">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {analytics.recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 border border-(--color-border) rounded-md"
                      >
                        <p className="font-medium text-(--color-text-primary)">
                          {user.name || 'Unnamed User'}
                        </p>
                        <p className="text-sm text-(--color-text-secondary)">
                          {user.email}
                        </p>
                        <p className="text-xs text-(--color-text-secondary) mt-1">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-h3 font-bold text-(--color-text-primary)">
                  Investment Categories ({categories.length})
                </h2>
                <button
                  onClick={handleCreateCategory}
                  className="px-4 py-2 bg-(--color-primary) text-(--color-background) rounded-md hover:opacity-90 transition-opacity font-medium"
                >
                  + Create Category
                </button>
              </div>

              {/* Categories Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-(--color-border)">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Risk Level
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Return Range
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Liquidity
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Min. Capital
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-(--color-text-primary)">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-(--color-border) hover:bg-(--color-border) transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-(--color-text-primary) font-medium">
                            {category.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-(--color-text-secondary)">
                            {category.type}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                category.risk_level === 'High'
                                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                  : category.risk_level === 'Medium'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              }`}
                            >
                              {category.risk_level}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-(--color-text-secondary)">
                            {category.expected_return_min}% - {category.expected_return_max}%
                          </td>
                          <td className="py-3 px-4 text-sm text-(--color-text-secondary)">
                            {category.liquidity_score}/10
                          </td>
                          <td className="py-3 px-4 text-sm text-(--color-text-secondary)">
                            ₹{category.minimum_capital.toLocaleString('en-NP')}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-sm text-(--color-primary) hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-background) rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-(--color-border)">
              <h2 className="text-h3 font-bold text-(--color-text-primary)">
                {modalMode === 'create' ? 'Create Category' : 'Edit Category'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                    required
                  >
                    <option value="Stocks">Stocks</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="Bond">Bond</option>
                    <option value="FD">FD</option>
                    <option value="Gold">Gold</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                {/* Expected Return Min */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Expected Return Min (%) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.expected_return_min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_return_min: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                {/* Expected Return Max */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Expected Return Max (%) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.expected_return_max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_return_max: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Risk Level *
                  </label>
                  <select
                    value={formData.risk_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        risk_level: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Liquidity Score */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Liquidity Score (0-10) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.liquidity_score}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        liquidity_score: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                {/* Lock-in Period */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Lock-in Period *
                  </label>
                  <Input
                    type="text"
                    value={formData.lock_in_period}
                    onChange={(e) =>
                      setFormData({ ...formData, lock_in_period: e.target.value })
                    }
                    placeholder="e.g., None, 3 months, 1 year"
                    required
                  />
                </div>

                {/* Minimum Capital */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Minimum Capital (₹) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.minimum_capital}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimum_capital: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-(--color-border)">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-(--color-border) rounded-md text-(--color-text-primary) hover:bg-(--color-border) transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-(--color-primary) text-(--color-background) rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Saving...'
                    : modalMode === 'create'
                    ? 'Create'
                    : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
