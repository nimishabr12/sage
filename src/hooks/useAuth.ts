'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      // Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Failed to create account');
      }

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          username,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

      if (profileError) {
        throw new Error('Failed to create user profile');
      }

      // Sign in the user
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    await supabase.auth.signOut();
    router.push('/');
  };

  return {
    user: session?.user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
