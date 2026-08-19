Foovio App — Deployment & Supabase Setup

This document lists the exact steps to deploy the Supabase Edge Functions, apply DB migrations, and configure CI.

1) Supabase CLI: login & link
   - supabase login
   - supabase link --project-ref <YOUR_PROJECT_REF>

2) Set function environment variables in Supabase
   - SUPABASE_URL = https://<project>.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY = <service_role_key> (secret)

3) Deploy functions
   - cd supabase/functions/verify-order
   - supabase functions deploy verify-order
   - cd ../create-order
   - supabase functions deploy create-order

4) Apply DB migration (SQL)
   - Open Supabase → SQL Editor → paste and run: supabase/migrations/20260819_add_idempotency_and_rls.sql
   - Review policies and indexes before committing to production.

5) GitHub Actions (CI)
   - Add repo secrets:
     - SUPABASE_ACCESS_TOKEN (if you want CI to deploy functions)
     - SUPABASE_PROJECT_REF
   - The CI workflow (.github/workflows/ci.yml) will run TypeScript checks and lint. If you enable the deploy step, it will deploy functions on merges to main.

6) Local testing
   - Start Expo locally and sign in with a test user.
   - Place orders from the app. The client will call verify-order and create-order functions which are authoritative for price and idempotency.

Security notes
 - Keep SUPABASE_SERVICE_ROLE_KEY out of version control and only set it inside Supabase Functions environment or CI secrets.
 - Review RLS policies to make sure legitimate app read paths are still allowed. Edge functions run with service role and bypass RLS which is intended.

If you'd like, I can continue and help run these steps with you interactively (you will run the CLI commands locally).