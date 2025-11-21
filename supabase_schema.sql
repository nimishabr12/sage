-- ============================================
-- SAGE - Supabase Database Schema
-- Focus Timer + Gamified AI Companion SaaS
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    selected_ascendant VARCHAR(50),
    current_level INT DEFAULT 1 CHECK (current_level >= 1),
    total_xp INT DEFAULT 0 CHECK (total_xp >= 0),
    streak_count INT DEFAULT 0 CHECK (streak_count >= 0),
    last_session_date DATE,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- TABLE: ascendants
-- ============================================
CREATE TABLE ascendants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ascendant_name VARCHAR(50) NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    current_evolution_stage INT DEFAULT 0 CHECK (current_evolution_stage >= 0 AND current_evolution_stage <= 3),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, ascendant_name)
);

-- Index for ascendants
CREATE INDEX idx_ascendants_user_id ON ascendants(user_id);
CREATE INDEX idx_ascendants_unlocked ON ascendants(user_id, is_unlocked);

-- ============================================
-- TABLE: focus_sessions
-- ============================================
CREATE TABLE focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL CHECK (duration_minutes IN (25, 50)),
    xp_earned INT DEFAULT 0 CHECK (xp_earned >= 0),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    was_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for focus_sessions
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX idx_focus_sessions_user_started ON focus_sessions(user_id, started_at DESC);
CREATE INDEX idx_focus_sessions_completed ON focus_sessions(user_id, was_completed, started_at);

-- ============================================
-- TABLE: survey_responses
-- ============================================
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_1_hours_per_day INT CHECK (question_1_hours_per_day >= 0 AND question_1_hours_per_day <= 16),
    question_2_time_loss VARCHAR(100),
    question_3_main_distraction VARCHAR(100),
    question_4_interruptions INT CHECK (question_4_interruptions >= 0 AND question_4_interruptions <= 20),
    question_5_productivity_rating INT CHECK (question_5_productivity_rating >= 1 AND question_5_productivity_rating <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Index for survey_responses
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);

-- ============================================
-- TABLE: friendships
-- ============================================
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (user_id_1 != user_id_2),
    UNIQUE(user_id_1, user_id_2)
);

-- Index for friendships
CREATE INDEX idx_friendships_user_1 ON friendships(user_id_1, status);
CREATE INDEX idx_friendships_user_2 ON friendships(user_id_2, status);

-- ============================================
-- TABLE: leaderboard_cache
-- ============================================
CREATE TABLE leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank INT NOT NULL,
    total_focus_hours DECIMAL(10, 2) DEFAULT 0,
    streak_count INT DEFAULT 0,
    current_level INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Index for leaderboard_cache
CREATE INDEX idx_leaderboard_rank ON leaderboard_cache(rank ASC);
CREATE INDEX idx_leaderboard_user_id ON leaderboard_cache(user_id);
CREATE INDEX idx_leaderboard_updated ON leaderboard_cache(updated_at DESC);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to ascendants table
CREATE TRIGGER update_ascendants_updated_at
    BEFORE UPDATE ON ascendants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to friendships table
CREATE TRIGGER update_friendships_updated_at
    BEFORE UPDATE ON friendships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ascendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: users
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can view other users' public profiles (for leaderboard/friends)
CREATE POLICY "Users can view public profiles"
    ON users FOR SELECT
    USING (true);

-- ============================================
-- RLS POLICIES: ascendants
-- ============================================

-- Users can view their own ascendants
CREATE POLICY "Users can view own ascendants"
    ON ascendants FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own ascendants
CREATE POLICY "Users can insert own ascendants"
    ON ascendants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own ascendants
CREATE POLICY "Users can update own ascendants"
    ON ascendants FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: focus_sessions
-- ============================================

-- Users can view their own focus sessions
CREATE POLICY "Users can view own focus sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own focus sessions
CREATE POLICY "Users can insert own focus sessions"
    ON focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own focus sessions
CREATE POLICY "Users can update own focus sessions"
    ON focus_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: survey_responses
-- ============================================

-- Users can view their own survey responses
CREATE POLICY "Users can view own survey responses"
    ON survey_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own survey responses
CREATE POLICY "Users can insert own survey responses"
    ON survey_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own survey responses
CREATE POLICY "Users can update own survey responses"
    ON survey_responses FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: friendships
-- ============================================

-- Users can view friendships they're part of
CREATE POLICY "Users can view own friendships"
    ON friendships FOR SELECT
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Users can create friendship requests
CREATE POLICY "Users can create friendships"
    ON friendships FOR INSERT
    WITH CHECK (auth.uid() = user_id_1);

-- Users can update friendships they're part of
CREATE POLICY "Users can update own friendships"
    ON friendships FOR UPDATE
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Users can delete friendships they're part of
CREATE POLICY "Users can delete own friendships"
    ON friendships FOR DELETE
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- ============================================
-- RLS POLICIES: leaderboard_cache
-- ============================================

-- Everyone can view the leaderboard (public data)
CREATE POLICY "Anyone can view leaderboard"
    ON leaderboard_cache FOR SELECT
    USING (true);

-- Only system can insert/update leaderboard (typically via backend function)
CREATE POLICY "System can manage leaderboard"
    ON leaderboard_cache FOR ALL
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate total focus hours for a user
CREATE OR REPLACE FUNCTION get_total_focus_hours(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_hours DECIMAL;
BEGIN
    SELECT COALESCE(SUM(duration_minutes) / 60.0, 0)
    INTO total_hours
    FROM focus_sessions
    WHERE user_id = p_user_id AND was_completed = TRUE;

    RETURN total_hours;
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_session DATE;
    current_streak INT;
BEGIN
    -- Get the user's last session date and current streak
    SELECT last_session_date, streak_count
    INTO last_session, current_streak
    FROM users
    WHERE id = NEW.user_id;

    -- Only update streak if session was completed
    IF NEW.was_completed = TRUE THEN
        -- If last session was yesterday, increment streak
        IF last_session = CURRENT_DATE - INTERVAL '1 day' THEN
            UPDATE users
            SET streak_count = streak_count + 1,
                last_session_date = CURRENT_DATE
            WHERE id = NEW.user_id;

        -- If last session was today, don't change streak
        ELSIF last_session = CURRENT_DATE THEN
            -- Do nothing
            NULL;

        -- If last session was more than 1 day ago, reset streak
        ELSE
            UPDATE users
            SET streak_count = 1,
                last_session_date = CURRENT_DATE
            WHERE id = NEW.user_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update streak when a session is completed
CREATE TRIGGER trigger_update_user_streak
    AFTER INSERT OR UPDATE ON focus_sessions
    FOR EACH ROW
    WHEN (NEW.was_completed = TRUE)
    EXECUTE FUNCTION update_user_streak();

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
DECLARE
    new_level INT;
    xp_for_next_level INT;
BEGIN
    IF NEW.was_completed = TRUE AND NEW.xp_earned > 0 THEN
        -- Update total XP
        UPDATE users
        SET total_xp = total_xp + NEW.xp_earned
        WHERE id = NEW.user_id;

        -- Calculate new level (100 XP per level, can adjust formula)
        SELECT total_xp / 100 + 1
        INTO new_level
        FROM users
        WHERE id = NEW.user_id;

        -- Update level if it increased
        UPDATE users
        SET current_level = new_level
        WHERE id = NEW.user_id AND current_level < new_level;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update XP and level when a session is completed
CREATE TRIGGER trigger_update_user_xp
    AFTER INSERT OR UPDATE ON focus_sessions
    FOR EACH ROW
    WHEN (NEW.was_completed = TRUE)
    EXECUTE FUNCTION update_user_xp();

-- ============================================
-- SEED DATA (Optional - Ascendant Types)
-- ============================================

-- You can uncomment this section after creating your first user
-- to automatically create ascendant entries for them

-- CREATE OR REPLACE FUNCTION create_default_ascendants()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     INSERT INTO ascendants (user_id, ascendant_name, is_unlocked, current_evolution_stage)
--     VALUES
--         (NEW.id, 'solis', TRUE, 0),      -- Starter ascendant (unlocked by default)
--         (NEW.id, 'lumis', FALSE, 0),
--         (NEW.id, 'noctis', FALSE, 0),
--         (NEW.id, 'terra', FALSE, 0),
--         (NEW.id, 'aqua', FALSE, 0),
--         (NEW.id, 'aether', FALSE, 0);
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trigger_create_default_ascendants
--     AFTER INSERT ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION create_default_ascendants();

-- ============================================
-- VIEWS (Optional - for easier queries)
-- ============================================

-- View for user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.avatar_url,
    u.current_level,
    u.total_xp,
    u.streak_count,
    u.selected_ascendant,
    COUNT(fs.id) FILTER (WHERE fs.was_completed = TRUE) as total_sessions,
    COALESCE(SUM(fs.duration_minutes) FILTER (WHERE fs.was_completed = TRUE), 0) / 60.0 as total_focus_hours,
    COUNT(fs.id) FILTER (WHERE fs.was_completed = TRUE AND fs.started_at >= CURRENT_DATE - INTERVAL '7 days') as sessions_last_7_days,
    COUNT(fs.id) FILTER (WHERE fs.was_completed = TRUE AND fs.started_at >= CURRENT_DATE - INTERVAL '30 days') as sessions_last_30_days
FROM users u
LEFT JOIN focus_sessions fs ON u.id = fs.user_id
GROUP BY u.id;

-- View for leaderboard
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
    u.id,
    u.username,
    u.avatar_url,
    u.current_level,
    u.streak_count,
    COALESCE(SUM(fs.duration_minutes) FILTER (WHERE fs.was_completed = TRUE), 0) / 60.0 as total_focus_hours,
    COUNT(fs.id) FILTER (WHERE fs.was_completed = TRUE) as total_sessions,
    RANK() OVER (ORDER BY COALESCE(SUM(fs.duration_minutes) FILTER (WHERE fs.was_completed = TRUE), 0) DESC) as rank
FROM users u
LEFT JOIN focus_sessions fs ON u.id = fs.user_id
GROUP BY u.id
ORDER BY total_focus_hours DESC;

-- ============================================
-- INDEXES for views and performance
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_focus_sessions_user_completed_date
    ON focus_sessions(user_id, was_completed, started_at DESC);

CREATE INDEX idx_users_level_xp
    ON users(current_level DESC, total_xp DESC);

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE users IS 'Stores user profile data, progression, and streaks';
COMMENT ON TABLE ascendants IS 'Stores user-owned ascendants and their evolution stages';
COMMENT ON TABLE focus_sessions IS 'Tracks all focus session attempts and completions';
COMMENT ON TABLE survey_responses IS 'Stores onboarding survey responses for analytics';
COMMENT ON TABLE friendships IS 'Manages friend relationships between users';
COMMENT ON TABLE leaderboard_cache IS 'Cached leaderboard data for performance';

-- ============================================
-- END OF SCHEMA
-- ============================================

-- To verify the schema was created successfully, run:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
