'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (
      !token &&
      typeof window !== 'undefined' &&
      !localStorage.getItem('token')
    ) {
      router.replace('/login');
    }
  }, [token, router]);

  if (
    !isAuthenticated &&
    typeof window !== 'undefined' &&
    !localStorage.getItem('token')
  ) {
    return null;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div
        className="hidden lg:flex w-60 flex-shrink-0 h-full border-r"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="w-64 h-full border-r shadow-2xl"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: 'var(--color-muted)' }}
            className="cursor-pointer"
          >
            <MenuIcon />
          </button>
          <span
            className="font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            WorkoutApp
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
