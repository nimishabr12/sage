'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export function useUser() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const updateUser = async (updates: Partial<User>) => {
    if (!session?.user?.id) return { success: false };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session.user.id);

      if (error) {
        console.error('Error updating user:', error);
        return { success: false, error: error.message };
      }

      // Refetch user data
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setUser(data);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Update failed' };
    }
  };

  return {
    user,
    loading,
    updateUser,
  };
}
