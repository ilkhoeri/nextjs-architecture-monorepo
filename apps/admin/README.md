# Monorepo - Admin

## Getting Started

First, create .env

Generate db:

```bash
cd apps/admin && npx prisma db push && cd ../..
```

Run the development server:

Started from root:

```bash
bun dev:admin
```

or started from current app:

```bash
cd apps/admin && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
