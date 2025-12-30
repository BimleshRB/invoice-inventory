/* Simple API client wrapper for frontend to communicate with backend
   Uses NEXT_PUBLIC_API_URL and automatically attaches Authorization header when token available. */

import type { User, UserRole, CurrentUserInfo } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string,string> || {})
  };

  // prefer token from localStorage (frontend should store token after login)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || process.env.NEXT_PUBLIC_DEV_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch(e) { err = { message: text }; }
    const error = new Error(err?.error || err?.message || res.statusText);
    (error as any).status = res.status;
    throw error;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

/**
 * Admin & Role Management API
 */
export const adminApi = {
  // Get current user's role info
  getMyRole: async (): Promise<CurrentUserInfo> => apiFetch('/admin/me/role'),

  // Get all users (Super Admin only)
  getAllUsers: async (): Promise<User[]> => apiFetch('/admin/users'),

  // Get all admins in a store
  getStoreAdmins: async (storeId: string): Promise<User[]> => 
    apiFetch(`/admin/stores/${storeId}/admins`),

  // Get all users in a store
  getStoreUsers: async (storeId: string): Promise<User[]> => 
    apiFetch(`/admin/stores/${storeId}/users`),

  // Assign role to a user
  assignRole: async (userId: string, role: UserRole): Promise<User> => 
    apiFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  // Remove admin role from user (demote to USER)
  removeAdminRole: async (userId: string): Promise<User> => 
    apiFetch(`/admin/users/${userId}/admin`, { method: 'DELETE' }),

  // Get users by role (Super Admin only)
  getUsersByRole: async (role: UserRole): Promise<User[]> => 
    apiFetch(`/admin/users/by-role/${role}`),
};
