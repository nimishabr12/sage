'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type FocusSession = Database['public']['Tables']['focus_sessions']['Row'];
type FocusSessionInsert = Database['public']['Tables']['focus_sessions']['Insert'];

export function useFocusSession() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const createSession = async (durationMinutes: 25 | 50) => {
    if (!session?.user?.id) return { success: false, error: 'Not authenticated' };

    setLoading(true);
    try {
      const sessionData: FocusSessionInsert = {
        user_id: session.user.id,
        duration_minutes: durationMinutes,
        started_at: new Date().toISOString(),
        was_completed: false,
      };

      const { data, error } = await supabase
        .from('focus_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create session' };
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (sessionId: string, xpEarned: number) => {
    if (!session?.user?.id) return { success: false, error: 'Not authenticated' };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('focus_sessions')
        .update({
          completed_at: new Date().toISOString(),
          was_completed: true,
          xp_earned: xpEarned,
        })
        .eq('id', sessionId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error completing session:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing session:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to complete session' };
    } finally {
      setLoading(false);
    }
  };

  const getUserSessions = async () => {
    if (!session?.user?.id) return { success: false, error: 'Not authenticated', data: [] };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        data: []
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSession,
    completeSession,
    getUserSessions,
  };
}
