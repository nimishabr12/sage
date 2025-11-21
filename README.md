# SAGE - Focus Timer + Gamified AI Companion

A premium SaaS application combining focus timers with gamified AI companions to boost productivity.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Anime.js
- **Backend**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js
- **Deployment**: Vercel

## 🎨 Design System

**Color Palette:**
- Primary Teal: `#0F766E`
- Gold: `#F59E0B`
- Orange: `#EA580C`
- Dark BG: `#1A1A1A`
- Card BG: `#252525`
- Text: `#FFFFFF`
- Text Secondary: `#B3B3B3`
- Locked: `#5A5A5A`

## 📦 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nimishabr12/sage.git
cd sage
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` with your Supabase credentials.

4. Run the database schema:
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy-paste the content from `supabase_schema.sql`
- Click "Run"

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sage/
├── src/
│   ├── app/              # Next.js 15 App Router
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── onboarding/   # Onboarding flow
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Library code (Supabase client, etc.)
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── styles/           # Global styles
├── public/               # Static assets
└── supabase_schema.sql   # Database schema
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📝 Features

- ✅ Focus timer (25/50 minute sessions)
- ✅ Gamified XP and leveling system
- ✅ AI companion (Ascendants) with evolution stages
- ✅ Streak tracking
- ✅ Leaderboard
- ✅ Friend system
- ✅ Onboarding survey
- ✅ Dark mode with cosmic theme
- ✅ Glassmorphism UI

## 🎯 Roadmap

- [ ] Chrome extension for website blocking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Team workspaces
- [ ] Custom ascendant skins

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

Built with ❤️ using Next.js and Supabase
