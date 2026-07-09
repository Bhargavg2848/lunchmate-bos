# Supabase Auth Setup (Email OTP)

1. Open Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Enable **Magic Link** or OTP flow
4. Set Site URL:
   - Local: `http://localhost:3000`
   - Production: your Vercel URL
5. Add redirect URLs:
   - `http://localhost:3000/dashboard`
   - `https://<your-vercel-domain>/dashboard`

## Apply SQL schema
- Open Supabase SQL editor
- Run: `supabase/sql/001_auth_roles.sql`

## Role assignment (temporary)
For now, add role records manually in SQL editor for test users.
Later we’ll build admin UI for role assignment.
