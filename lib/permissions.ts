/** Role-based access control for the staff admin panel. Mirrors `profiles.role`. */

export type Role = 'admin' | 'ceo' | 'editor' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title?: string;
}

export type Permission =
  | 'product:create'
  | 'product:update' // includes price + image edits
  | 'product:delete'
  | 'catalog:reset'
  | 'users:view';

const MATRIX: Record<Role, Permission[]> = {
  admin: ['product:create', 'product:update', 'product:delete', 'catalog:reset', 'users:view'],
  ceo: ['product:create', 'product:update', 'product:delete', 'catalog:reset', 'users:view'],
  editor: ['product:create', 'product:update'],
  // Default role for a newly signed-up account until an admin grants access.
  viewer: [],
};

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  ceo: 'Chief Executive',
  editor: 'Catalog Editor',
  viewer: 'Pending Access',
};

/** Tailwind color tokens per role, used for badges/accents in the admin UI. */
export const ROLE_STYLES: Record<Role, { badge: string; dot: string }> = {
  admin: { badge: 'bg-secondary/10 text-secondary', dot: 'bg-secondary' },
  ceo: { badge: 'bg-accent/10 text-accent-dark dark:text-accent', dot: 'bg-accent' },
  editor: { badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15', dot: 'bg-emerald-500' },
  viewer: { badge: 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300', dot: 'bg-slate-400' },
};
