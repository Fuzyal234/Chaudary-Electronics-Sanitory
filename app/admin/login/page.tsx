'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowLeft, LogIn, UserPlus, PackageCheck, ImageIcon, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, ready, login, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  // Already signed in → go to the dashboard.
  useEffect(() => {
    if (ready && user) router.replace('/admin');
  }, [ready, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');

    if (mode === 'signup') {
      const res = await signUp(name, email, password);
      if (!res.ok) {
        setError(res.error ?? 'Unable to create account.');
        setBusy(false);
        return;
      }
      if (res.needsConfirmation) {
        setInfo('Account created. Please confirm your email, then sign in. An administrator will grant your access role.');
        setMode('signin');
        setBusy(false);
        return;
      }
      router.replace('/admin');
      return;
    }

    const res = await login(email, password);
    if (res.ok) {
      router.replace('/admin');
    } else {
      setError(res.error ?? 'Unable to sign in.');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg dark:bg-dark-bg">
      {/* Branding panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-12 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <Link href="/" className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
            <span className="font-heading text-2xl font-black text-primary">C</span>
          </div>
          <div>
            <div className="font-heading text-lg font-bold leading-tight">CHAUDHRY</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent">Staff Portal</div>
          </div>
        </Link>

        <div className="relative">
          <h1 className="font-heading text-4xl font-bold leading-tight">
            Manage your <span className="text-accent">catalog</span> with confidence.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Add products, update prices, and refresh imagery — changes go live across the store instantly.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              { Icon: PackageCheck, label: 'Add & edit products in seconds' },
              { Icon: Tag, label: 'Update prices and discounts' },
              { Icon: ImageIcon, label: 'Upload product images to the cloud' },
            ].map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} className="text-accent" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} Chaudhry Sanitary, Electric &amp; Hardware</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-secondary">
            <ArrowLeft size={16} /> Back to store
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              <ShieldCheck size={13} /> Authorized staff only
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-primary dark:text-white">
              {mode === 'signin' ? 'Sign in to Admin' : 'Create a staff account'}
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {mode === 'signin' ? 'Enter your staff credentials to continue.' : 'Register, then an administrator grants your role.'}
            </p>
          </div>

          {!isSupabaseConfigured && (
            <p className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-500/10">
              Supabase isn’t configured. Add your keys to <code>.env.local</code> and restart the dev server.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-primary dark:text-white">Full Name</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sana Malik"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-primary transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-primary dark:text-white">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@chaudhry.pk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-primary transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-primary dark:text-white">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-primary transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-secondary"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-500/10"
              >
                {error}
              </motion.p>
            )}
            {info && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10"
              >
                {info}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: busy ? 1 : 1.02 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
              type="submit"
              disabled={busy || !isSupabaseConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark disabled:opacity-70"
            >
              {mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
              className="font-semibold text-secondary hover:text-secondary-dark"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
