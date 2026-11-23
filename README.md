# trak

## Work quietly. Own everything

trak is a personal productivity app for tasks, habits, focus sessions, and calendars. It works offline in guest mode, with optional accounts and cloud sync.

## Features

- **Tasks**: Board and List views, projects, recurring tasks, steps, Todoist import and export, and Vim-style keyboard navigation.
- **Focus & habits**: a Pomodoro timer with floating overlay, habits with flexible frequencies and reminders, and Loop Habit Tracker import and export.
- **Calendar**: month, week, and multi-day views, Google and Outlook sync, event reminders, and `.ics` import and export.
- **Reminders**: push notifications for tasks, events, and habits, plus a morning brief and an evening plan.
- **Data ownership**: guest mode, zero-knowledge content encryption with key rotation, WebDAV backup, and full export.
- **Stats & insights**: period breakdowns, focus and task trends, per-habit insights, and goal tracking.

See [the full feature list](docs/features.md).

## Setup

**Prerequisites**: Node.js 24+, npm, and a Supabase project configured with `supabase/schema.sql` and the migrations.

For a new Supabase project, open **SQL Editor → New query**, run the contents of
[`supabase/schema.sql`](supabase/schema.sql), then confirm that tables such as
`profiles`, `projects`, `tasks`, and `habits` appear under **Database → Tables**.
Deploying this app from GitHub does not apply database SQL automatically.

For email login, set the Supabase **Authentication → URL Configuration** Site
URL to your deployed app and add its `/auth/callback` URL to Redirect URLs (also
add `http://localhost:3000/auth/callback` for local development). Enable email
sign-in in **Authentication → Sign In / Providers**. If CAPTCHA is enabled in
Supabase, configure the matching Turnstile keys in both Supabase and the app.

```bash
npm install
cp .env.example .env.local   # add the required keys
npm run dev
```

To test offline and service worker behavior, build and start the production bundle:

```bash
npm run build && npm start
```

## License

This project is licensed under the GNU Affero General Public License, Version 3. See [LICENSE](LICENSE).
