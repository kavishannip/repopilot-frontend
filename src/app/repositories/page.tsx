'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RepositoriesTable from '@/components/repositories/RepositoriesTable';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RepositoriesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="w-full space-y-6">
          <RepositoriesTable />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
