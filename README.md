# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5fb74297-46e8-4d42-bbec-5dc1f0cacdbb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5fb74297-46e8-4d42-bbec-5dc1f0cacdbb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5fb74297-46e8-4d42-bbec-5dc1f0cacdbb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


## Local environment & recommended secrets

This project uses the following environment variables (add to `.env` or your host provider's secret manager):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon public key
- `VITE_SENTRY_DSN` — (optional) Sentry DSN for client-side error reporting
- `VITE_APP_VERSION` — (optional) release string used by error reporting

Do **not** commit secrets to source control. Use your host provider's secret manager (Lovable, Vercel, Netlify, etc) for production.

## CI

A GitHub Actions workflow was added at `.github/workflows/ci.yml` to perform typechecking, linting, tests and build on PRs.

## Notes about changes applied

- Route-based lazy loading + per-route Suspense fallbacks (skeletons) added in `src/App.tsx`.
- Top-level `ErrorBoundary` updated to report to Sentry if `VITE_SENTRY_DSN` is present.
- `src/lib/sentry.ts` added with a safe init wrapper.
- `tsconfig.json` updated to enable `"strict": true`.
- Basic Vitest config added and a unit test for `ErrorBoundary` included.
- If you use Husky or pre-commit hooks, install them locally (not included automatically).
