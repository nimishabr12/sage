// User Types
export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  selected_ascendant?: AscendantName
  current_level: number
  total_xp: number
  streak_count: number
  last_session_date?: string
  timezone: string
  created_at: string
  updated_at: string
}

// Ascendant Types
export type AscendantName = 'solis' | 'lumis' | 'noctis' | 'terra' | 'aqua' | 'aether'

export interface Ascendant {
  id: string
  user_id: string
  ascendant_name: AscendantName
  is_unlocked: boolean
  unlocked_at?: string
  current_evolution_stage: 0 | 1 | 2 | 3
  created_at: string
  updated_at: string
}

// Focus Session Types
export interface FocusSession {
  id: string
  user_id: string
  duration_minutes: 25 | 50
  xp_earned: number
  started_at: string
  completed_at?: string
  was_completed: boolean
  created_at: string
}

// Survey Types
export interface SurveyResponse {
  id: string
  user_id: string
  question_1_hours_per_day: number
  question_2_time_loss: string
  question_3_main_distraction: string
  question_4_interruptions: number
  question_5_productivity_rating: number
  created_at: string
}

// Friendship Types
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked'

export interface Friendship {
  id: string
  user_id_1: string
  user_id_2: string
  status: FriendshipStatus
  created_at: string
  updated_at: string
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string
  user_id: string
  rank: number
  total_focus_hours: number
  streak_count: number
  current_level: number
  updated_at: string
}

// UI State Types
export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  remainingSeconds: number
  totalSeconds: number
  sessionType: 25 | 50
}
