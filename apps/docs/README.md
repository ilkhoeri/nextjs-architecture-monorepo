# Monorepo - Docs

## Getting Started

First, run the development server:

Started from root:

```bash
bun dev:docs
```

or started from current app:

```bash
cd apps/docs && bun dev:build
```

or

```bash
cd apps/docs && bun build:content && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `./md/*`. The page auto-updates as you edit the file.
