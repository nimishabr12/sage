export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          selected_ascendant: string | null
          current_level: number
          total_xp: number
          streak_count: number
          last_session_date: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string | null
          selected_ascendant?: string | null
          current_level?: number
          total_xp?: number
          streak_count?: number
          last_session_date?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          selected_ascendant?: string | null
          current_level?: number
          total_xp?: number
          streak_count?: number
          last_session_date?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      ascendants: {
        Row: {
          id: string
          user_id: string
          ascendant_name: string
          is_unlocked: boolean
          unlocked_at: string | null
          current_evolution_stage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ascendant_name: string
          is_unlocked?: boolean
          unlocked_at?: string | null
          current_evolution_stage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ascendant_name?: string
          is_unlocked?: boolean
          unlocked_at?: string | null
          current_evolution_stage?: number
          created_at?: string
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          duration_minutes: number
          xp_earned: number
          started_at: string
          completed_at: string | null
          was_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration_minutes: number
          xp_earned?: number
          started_at?: string
          completed_at?: string | null
          was_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration_minutes?: number
          xp_earned?: number
          started_at?: string
          completed_at?: string | null
          was_completed?: boolean
          created_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: string
          user_id: string
          question_1_hours_per_day: number | null
          question_2_time_loss: string | null
          question_3_main_distraction: string | null
          question_4_interruptions: number | null
          question_5_productivity_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_1_hours_per_day?: number | null
          question_2_time_loss?: string | null
          question_3_main_distraction?: string | null
          question_4_interruptions?: number | null
          question_5_productivity_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_1_hours_per_day?: number | null
          question_2_time_loss?: string | null
          question_3_main_distraction?: string | null
          question_4_interruptions?: number | null
          question_5_productivity_rating?: number | null
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id_1: string
          user_id_2: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id_1: string
          user_id_2: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id_1?: string
          user_id_2?: string
          status?: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
      }
      leaderboard_cache: {
        Row: {
          id: string
          user_id: string
          rank: number
          total_focus_hours: number
          streak_count: number
          current_level: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rank: number
          total_focus_hours?: number
          streak_count?: number
          current_level?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rank?: number
          total_focus_hours?: number
          streak_count?: number
          current_level?: number
          updated_at?: string
        }
      }
    }
    Views: {
      user_stats: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          current_level: number
          total_xp: number
          streak_count: number
          selected_ascendant: string | null
          total_sessions: number
          total_focus_hours: number
          sessions_last_7_days: number
          sessions_last_30_days: number
        }
      }
      leaderboard_view: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          current_level: number
          streak_count: number
          total_focus_hours: number
          total_sessions: number
          rank: number
        }
      }
    }
    Functions: {
      get_total_focus_hours: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
    }
  }
}
