'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Store, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthUser } from '@/lib/permissions';
import { ROLE_LABELS, ROLE_STYLES } from '@/lib/permissions';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', Icon: Package, exact: false },
];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function AdminShell({ user, logout, children }: { user: AuthUser; logout: () => void; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const doLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  const navLinks = (
    <>
      {NAV.map(({ href, label, Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-secondary text-white shadow-sm shadow-secondary/30'
                : 'text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white p-5 dark:border-white/20 dark:bg-dark-card lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-md">
            <span className="font-heading text-xl font-black text-white">C</span>
          </div>
          <div>
            <div className="font-heading text-sm font-bold text-primary dark:text-white">Chaudhry Admin</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-accent">Staff Portal</div>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1.5">{navLinks}</nav>

        <Link
          href="/"
          className="mb-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-secondary dark:text-slate-300 dark:hover:bg-white/5"
        >
          <Store size={18} /> View store
        </Link>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/20 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary dark:text-white">{user.name}</p>
              <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${ROLE_STYLES[user.role].badge}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
          <button
            onClick={doLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-white/25 dark:text-slate-300"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header + nav */}
      <div className="lg:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-white/20 dark:bg-dark-card">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-heading text-base font-black text-white">C</span>
            </div>
            <span className="font-heading text-sm font-bold text-primary dark:text-white">Chaudhry Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className={`rounded px-2 py-1 text-[10px] font-bold ${ROLE_STYLES[user.role].badge}`}>{ROLE_LABELS[user.role]}</span>
            <button onClick={doLogout} className="rounded-lg p-2 text-slate-400 hover:text-red-500" aria-label="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 dark:border-white/20 dark:bg-dark-card">
          {navLinks}
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-300">
            <Store size={18} /> Store
          </Link>
        </nav>
      </div>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}

function AdminGate({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-dark-bg">
      <div className="flex items-center gap-3 text-slate-400">
        <Loader2 size={20} className="animate-spin" /> {label}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const isLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    if (ready && !user && !isLoginRoute) router.replace('/admin/login');
  }, [ready, user, isLoginRoute, router]);

  // The login page renders standalone (no shell/guard).
  if (isLoginRoute) return <>{children}</>;
  if (!ready) return <AdminGate label="Loading…" />;
  if (!user) return <AdminGate label="Redirecting to sign in…" />;

  return (
    <AdminShell user={user} logout={logout}>
      {children}
    </AdminShell>
  );
}
