# Testing SAGE Authentication & Onboarding

## Prerequisites Setup

### 1. **Supabase Setup** (Required)

You should already have Supabase set up based on the schema. If not:

1. Go to [supabase.com](https://supabase.com)
2. Find your project
3. Go to **Settings** → **API**
4. Copy these values to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key (keep secret!)

5. Make sure the database schema is applied (the `supabase_schema.sql` file)

### 2. **Google OAuth Setup** (Optional - can skip for basic testing)

If you want to test Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

**For now, you can test without Google OAuth using email/password only.**

---

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

---

## Testing Flow

### **Test 1: Email/Password Signup + Full Onboarding**

1. **Navigate to:** http://localhost:3000/auth/signup

2. **Fill in the form:**
   - Email: test@example.com
   - Username: testuser
   - Password: password123
   - Confirm Password: password123

3. **Click "Create Account"**

4. **Expected: Automatic redirect to onboarding flow**

5. **Watch the animations:**
   - ✨ **Orb Animation** (3.5 seconds) - Teal glowing orb grows
   - 🚀 **Ascendants Flythrough** (4 seconds) - 7 characters fly across
   - 👋 **Welcome Screen** - "Welcome to SAGE..." message
   - Click "Let's Begin"

6. **Answer 5 Questions:**
   - **Q1:** Drag slider to select hours (e.g., 5 hours/day)
   - Click "Next"
   - **Q2:** Select how often distracted (e.g., "Often")
   - Click "Next"
   - **Q3:** Select distractions (can select multiple)
   - Click "Next"
   - **Q4:** Select interruptions count (e.g., 10)
   - Click "Next"
   - **Q5:** Rate productivity (e.g., 6/10)
   - Click "Continue"

7. **Stats Screen:**
   - Watch numbers animate from 0 → final values
   - Shows average person stats + your personalized calculation
   - Click "Continue"

8. **Solution Message:**
   - "Don't worry, your Ascendants are here to save you! 🌟"
   - Click "Meet Your Ascendants"

9. **Ascendant Selection:**
   - Two available: **Solis** (gold) and **Lumis** (orange)
   - Five locked ascendants shown in gray
   - Click one to select (card glows)
   - Click "Begin Your Journey"

10. **Expected: Redirect to /dashboard**

---

### **Test 2: Login Flow**

1. **Navigate to:** http://localhost:3000/auth/login

2. **Fill in:**
   - Email: test@example.com
   - Password: password123
   - Check "Remember me" (optional)

3. **Click "Sign In"**

4. **Expected: Redirect to /dashboard**

---

### **Test 3: Google OAuth** (If configured)

1. **Navigate to:** http://localhost:3000/auth/signup

2. **Click "Sign up with Google"**

3. **Complete Google OAuth flow**

4. **Expected: Redirect to onboarding flow**

---

### **Test 4: Protected Routes**

1. **Open incognito/private window**

2. **Try to access:** http://localhost:3000/dashboard

3. **Expected: Redirect to /auth/login with callback URL**

4. **After login:** Redirect back to /dashboard

---

### **Test 5: Middleware Protection**

1. **Log in first**

2. **Try to access:** http://localhost:3000/auth/login

3. **Expected: Redirect to /dashboard** (authenticated users can't access auth pages)

---

## Troubleshooting

### Issue: "Cannot find module 'next-auth'"
**Solution:** Run `npm install`

### Issue: TypeScript errors about Supabase types
**Solution:** These are expected. Generate types with:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

### Issue: "Invalid credentials" on signup
**Solution:** Check your Supabase URL and anon key in `.env.local`

### Issue: Animations not smooth
**Solution:**
- Close other tabs/programs
- Check browser console for errors
- Try Chrome/Firefox (best Framer Motion support)

### Issue: "Forgot password" link goes nowhere
**Solution:** This is expected - password reset page not yet implemented

---

## What to Look For

### ✅ **Animations:**
- Orb should glow and scale smoothly
- Ascendants should fly from center to right with stagger
- Numbers should count up smoothly (not jump)
- Card hover effects should be smooth
- Transitions between screens should fade nicely

### ✅ **Functionality:**
- Form validation should show errors
- Can't proceed without answering questions
- Back button works on questions
- Selected ascendant shows glow effect
- Locked ascendants show lock icon and "Lvl 10+" text

### ✅ **Data:**
- Check Supabase dashboard to verify:
  - New user created in `users` table
  - Survey responses saved in `survey_responses` table
  - Ascendants created in `ascendants` table (7 rows)
  - Selected ascendant saved in user profile

---

## Quick Test Commands

```bash
# Type check (will show Supabase type errors - that's OK)
npm run type-check

# Lint check
npm run lint

# Build (make sure it compiles)
npm run build
```

---

## Demo Video Checklist

Record your screen testing:
1. ✅ Signup form
2. ✅ Orb animation
3. ✅ Ascendants flythrough
4. ✅ Welcome screen
5. ✅ All 5 questions with different input types
6. ✅ Stats screen with animated numbers
7. ✅ Solution message
8. ✅ Ascendant selection
9. ✅ Dashboard redirect (even if empty page)
10. ✅ Logout and login again

Enjoy testing SAGE! 🚀
