## Supabase setup

1. Open the Supabase SQL editor for your project.
2. Run [`schema.sql`](/Users/nilsmacmini/Desktop/websites/reaktion/supabase/schema.sql).
3. If the website still reports that `submit_guest_score(...)` could not be found, run this once in the SQL editor and then refresh the site:

```sql
notify pgrst, 'reload schema';
```
4. Add these variables to your local `.env` and your hosting provider:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

What this schema sets up:

- `leaderboard_scores` as the raw event log for all valid submissions
- `leaderboard_recent_100` for the latest 100 submissions
- `leaderboard_top_100` for the best score per `guest_id`, capped at 100 rows
- `submit_guest_score(...)` as the write entry point for guest submissions
- `request_profile_claim(...)` as the write entry point for later account claim flows

After adding the env vars, restart the dev server or redeploy so the frontend switches from preview mode to the live Supabase leaderboard.
