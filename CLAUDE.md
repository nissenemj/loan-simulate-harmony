# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Velkavapaus.fi** is a Finnish debt management and loan calculator application. The site helps people with debt problems find their path to financial freedom through empathetic, practical guidance.

### Content Principles
- **Empathetic tone** - Never shame or blame users for debt
- **Plain language** - No legal jargon, easy to understand
- **Hopeful** - Solutions exist, no situation is hopeless
- **Practical** - Concrete advice and tools
- **Crisis links required** - Always include crisis help info on serious topics

### Crisis Help Numbers (mandatory on relevant pages)
```
Kriisipuhelin: 09 2525 0111 (24h)
Talous- ja velkaneuvonta: 0295 660 123
Takuusäätiö: 0800 9 8009
```

## Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

Note: Install with `npm install --legacy-peer-deps` if dependency conflicts occur.

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite
- TailwindCSS + shadcn/ui (Radix UI primitives)
- React Router for routing
- React Hook Form + Zod for forms
- Supabase for backend (blog, contacts, users)
- Framer Motion for animations

### Key Directories
```
src/
├── pages/              # Page components (lazy-loaded)
│   ├── oppaat/         # Guides (velkajärjestely, etc.)
│   ├── vinkit/         # Tips (budjetointi, säästäminen)
│   ├── tarinat/        # Success stories
│   └── apua/           # Help resources
├── components/
│   ├── calculator/     # Debt calculator components
│   ├── dashboard/      # User dashboard
│   ├── templates/      # GuideTemplate, TipTemplate, StoryTemplate
│   ├── infographics/   # Visual components (ProcessFlow, StatCard, etc.)
│   └── ui/             # shadcn/ui components
├── contexts/           # AuthContext, ErrorContext, LanguageContext
├── hooks/              # useLocalStorage, useCalculationCache, etc.
├── utils/              # loanCalculations.ts, creditCardCalculations.ts
└── integrations/supabase/
```

### Routing Pattern
- All pages lazy-loaded via `React.lazy()` in `App.tsx`
- Protected routes use `<ProtectedRoute>` wrapper
- Content routes: `/oppaat/*`, `/vinkit/*`, `/tarinat/*`, `/apua/*`

### State Management
- **Auth**: `AuthContext` → `useAuth()`
- **Errors**: `ErrorContext` → `useError()`
- **Local data**: `useLocalStorage<T>()` for loans/cards (stays in browser)
- **Forms**: React Hook Form + Zod validation
- **Server**: TanStack Query for Supabase data

### Data Persistence
- User debt data stored in `localStorage` (privacy-first)
- Supabase for: blog posts, contact submissions, newsletter subscribers

### Page Templates
Use these for consistent content pages:
- `GuideTemplate` - Long-form guides with breadcrumbs
- `TipTemplate` - Short tips with category
- `StoryTemplate` - Success stories with before/after

### Calculator Logic
Core financial calculations in `src/utils/`:
- `loanCalculations.ts` - Annuity, equal-principal, fixed-installment
- `creditCardCalculations.ts` - Credit card payoff strategies

### UI Components
- shadcn/ui for base components (`src/components/ui/`)
- Custom infographics: `ProcessFlow`, `StatCard`, `ComparisonTable`, `Timeline`, `BeforeAfter`
- `CrisisHelp` component with variants: `default`, `compact`, `prominent`

## Git Commit Format

```
<type>(<scope>): <description in Finnish>

Types: feat, fix, content, seo, a11y, refactor
Examples:
  content(oppaat): lisää velkasaneeraus-opas
  feat(calculator): add credit card payoff comparison
```
