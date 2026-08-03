'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AuthUser, Role, Permission, can as canDo } from '@/lib/permissions';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Load the staff profile (role) for a signed-in auth user. */
async function loadProfile(id: string, email: string): Promise<AuthUser> {
  const fallback: AuthUser = { id, email, name: email, role: 'viewer' };
  if (!supabase) return fallback;
  const { data } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', id)
    .single();
  if (!data) return fallback;
  return {
    id,
    email: data.email ?? email,
    name: data.full_name || data.email || email,
    role: (data.role as Role) ?? 'viewer',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (session?.user && active) {
        setUser(await loadProfile(session.user.id, session.user.email ?? ''));
      }
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        setUser(await loadProfile(session.user.id, session.user.email ?? ''));
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase is not configured.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message };
    if (data.user) setUser(await loadProfile(data.user.id, data.user.email ?? ''));
    return { ok: true };
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!supabase) return { ok: false, error: 'Supabase is not configured.' };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (error) return { ok: false, error: error.message };
    // If email confirmation is enabled there is no active session yet.
    return { ok: true, needsConfirmation: !data.session };
  }, []);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const can = useCallback((permission: Permission) => canDo(user?.role, permission), [user]);

  return (
    <AuthContext.Provider value={{ user, ready, login, signUp, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
