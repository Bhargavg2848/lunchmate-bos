# Environment Setup Guide

## Required Accounts
- GitHub (already available)
- Supabase (free)
- Vercel (free)

## Local Requirements
- Node.js 20 LTS recommended
- npm 10+

## Planned Environment Variables
Create `.env.local` in project root after app scaffold:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase Setup (high-level)
1. Create project in Supabase
2. Copy project URL and keys
3. Add env vars locally and in Vercel
4. Enable Auth providers (Email OTP first)

## Deployment Setup (high-level)
1. Import repo in Vercel
2. Add environment variables
3. Deploy from `main`

## Security Notes
- Never expose service role key to frontend
- Use Row-Level Security for all operational tables
