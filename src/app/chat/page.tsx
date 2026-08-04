'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatWorkspace from '@/components/chat/ChatWorkspace';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="w-full h-full">
          <ChatWorkspace />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
