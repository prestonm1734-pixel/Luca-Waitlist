# Luca Waitlist — Supabase Setup

## What was changed in `index.html`

1. **Supabase CDN script** injected before `</head>`
2. **Credentials config block** injected before `</head>` — fill in your values
3. **Waitlist React component** updated with:
   - Real email regex validation (shows inline error before hitting Supabase)
   - Async `insert` into the `waitlist` table
   - Success message: "You're on the list. We'll be in touch."
   - Error message: "Something went wrong. Try again."
   - Loading state disables the button while the request is in flight
4. **`.waitlist-error` CSS** added for the inline error display

---

## Step-by-step setup

### 1. Create the Supabase table

Open your Supabase project → **SQL Editor** → New query → paste
the contents of `waitlist_schema.sql` → click **Run**.

This creates:
- `public.waitlist` table with columns `id`, `email`, `created_at`, `source`
- A unique index on `email` (prevents duplicates)
- A Row Level Security policy allowing anonymous inserts

### 2. Get your Supabase credentials

In your Supabase dashboard:
1. Go to **Project Settings → API**
2. Copy **Project URL** → this is your `SUPABASE_URL`
3. Copy **anon / public** key → this is your `SUPABASE_ANON_KEY`

### 3. Fill in credentials in `index.html`

Find this block near the top of `index.html` (search for `STEP 1`):

```html
<script>
  window.SUPABASE_URL    = 'YOUR_SUPABASE_URL';
  window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

Replace both placeholder strings with your real values.

### 4. Open `index.html` in a browser

No server needed — double-click it. Submit the form with a real email
and check your Supabase **Table Editor → waitlist** to confirm the row appears.

---

## Viewing signups

In your Supabase dashboard:
- **Table Editor → waitlist** — visual table view
- **SQL Editor** → run: `select * from public.waitlist order by created_at desc;`

## Security notes

- The `anon` key is safe to expose in client-side HTML — RLS restricts it to insert-only
- Emails are never readable by anonymous users (only via Dashboard or service role)
- The unique index silently rejects duplicate emails (Supabase returns a 409 which is caught and shown as "Something went wrong. Try again.")
