'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';

type NavItem = { href: string; label: string; icon: React.ReactNode };

function IconHome() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconDumbbell() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 5v14M18 5v14" />
      <rect x="4" y="8" width="4" height="8" rx="1" />
      <rect x="16" y="8" width="4" height="8" rx="1" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function IconList() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <IconHome /> },
  { href: '/exercises', label: 'Exercícios', icon: <IconDumbbell /> },
  { href: '/workout', label: 'Meus Treinos', icon: <IconList /> },
  { href: '/profile', label: 'Meu Perfil', icon: <IconUser /> },
];

export function Sidebar() {
  return (
    <Suspense>
      <SidebarContent />
    </Suspense>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--color-bg-surface)' }}
    >
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <Logo size={40} withText />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                color: active ? 'var(--color-text)' : 'var(--color-muted)',
                background: active
                  ? 'var(--color-primary-muted)'
                  : 'transparent',
                borderLeft: active
                  ? '3px solid var(--color-primary)'
                  : '3px solid transparent',
              }}
            >
              <span
                style={{ color: active ? 'var(--color-primary)' : 'inherit' }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3 mb-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7B61FF, #00E5A0)' }}
          >
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-medium truncate"
              style={{ color: 'var(--color-text)' }}
            >
              {user?.name ?? 'Usuário'}
            </span>
            <span
              className="text-xs truncate"
              style={{ color: 'var(--color-muted)' }}
            >
              {user?.email ?? ''}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer"
          style={{ color: 'var(--color-muted)' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              'var(--color-error)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              'var(--color-muted)')
          }
        >
          <IconLogout /> Sair
        </button>
      </div>
    </aside>
  );
}
