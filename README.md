# Next.js Architecture Monorepo

A scalable, modular, and high-performance **Turborepo starter** for modern web applications using **Next.js App Router**, **TailwindCSS**, and **Bun**.

> Powered by Bun, designed for teams and individuals who care about maintainability and performance.

---

## Tech Stack

This monorepo leverages the latest tools and best practices for development, deployment, and production. All dependencies are managed using **Bun Workspaces** and **Catalogs**.

| 🚀 Stack            | Description                                         |
| ------------------- | --------------------------------------------------- |
| **Package Manager** | [bun@1.2.19](https://bun.sh/docs)                   |
| **App Library**     | [react@^19](https://react.dev)                      |
| **Framework**       | [next@^15 (App Router)](https://nextjs.org)         |
| **Language**        | [typescript@^5.3.3](https://www.typescriptlang.org) |
| **Styling**         | [tailwindcss@^4](https://tailwindcss.com)           |
| **Linting**         | [eslint@^9](https://eslint.org)                     |
| **Others**          | [View full dependencies](./package.json)            |

**Learn more:**

- Workspaces: <https://bun.sh/docs/install/workspaces>
- Catalogs: <https://bun.com/docs/install/catalogs>

---

## 📦 Monorepo Structure

This monorepo includes multiple **Next.js apps**, **shared packages**, and **custom configurations**. Here's an overview:

```md
main/
├── apps/
│ ├── admin/
│ │ ├── app/
│ │ ├── next.config.js
│ │ ├── tsconfig.json
│ │ └── ...
│ │
│ ├── docs/
│ │ ├── app/
│ │ ├── next.config.js
│ │ ├── tsconfig.json
│ │ └── ...
│ │
│ └── web/
│ · ├── app/
│ · ├── next.config.js
│ · ├── tsconfig.json
│ · └── ...
│
├── shared/
│ ├── shells/
│ │ ├── src/
│ │ └── ...
│ └── ...
│
├── packages/
│ ├── config/
│ │ ├── config-eslint/
│ │ │ ├── package.json
│ │ │ └── ...
│ │ ├── config-typescript/
│ │ │ ├── package.json
│ │ │ └── ...
│ │ └── tailwind-config/
│ │ · ├── package.json
│ │ · └── ...
│ │
│ ├── ui/
│ │ ├── src/
│ │ └── ...
│ └── ...
│
├── package.json # Root-level dependencies/tools
├── eslint.config.mjs # Monorepo linting configuration
└── node_modules
```

---

## 📁 Apps & Packages

- `@repo/eslint-config`: Shared lint rules (with `eslint-config-next` & `prettier`)
- `@repo/typescript-config`: Base `tsconfig` definitions
- `@repo/tailwind-config`: TailwindCSS configuration
- `@repo/ui`: Reusable UI components
- `@repo/hooks`: Shared custom hooks
- `@repo/store`: Global state management
- `@repo/icons`: Icon components
- `@repo/utils`: Shared utility functions

All packages are written in **TypeScript** and designed to be modular and easily composable.

---

## 🛠 Usage Example: `packages/ui`

This package provides reusable UI components styled with TailwindCSS. It is configured to:

- Compile styles into `dist/index.css`
- Use `tailwindcss` with a class prefix (e.g., `ui-`) to avoid style conflicts
- Export components via `exports` in `package.json`

You can import components like:

```ts
import { Button } from '@repo/ui';
import { cn } from '@repo/utils';
```

By default, it supports direct source consumption via `transpilePackages` in Next.js:

```ts
// next.config.js
transpilePackages: ['@repo/ui'];
```

To build CSS manually:

```bash
bun run build
```

Or watch for changes during development:

```bash
bun run dev
```

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ilkhoeri/nextjs-architecture-monorepo.git
cd nextjs-architecture-monorepo
```

### 2. Install dependencies (root)

```bash
bun install
```

### 3. Run your app

```bash
bun dev -C apps/web
```

> Or navigate into any `apps/*` directory and run manually.

---

## 🔧 Development Notes

- All packages support auto-type checking, linting, and formatting.
- Shared configuration packages are versioned using Bun Workspaces.
- Tailwind classes are prefixed where appropriate to ensure style isolation.
- You can add new packages by placing them under `packages/` and configuring their `package.json`.

---

## 📌 Roadmap / To-Do

- [ ] Add CI workflow with Bun
- [ ] Add component tests with Vitest
- [ ] Add storybook support
- [ ] Add deployment examples (e.g., Vercel, Netlify)

---

## 🤝 Contributing

Feel free to fork, use, and contribute to this monorepo. PRs and issues are welcome!

---

## 📜 License

MIT © [@ilkhoeri](https://github.com/ilkhoeri)
