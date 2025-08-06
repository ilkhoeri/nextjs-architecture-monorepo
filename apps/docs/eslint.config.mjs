import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = config({
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  rules: {
    "@typescript-eslint/ban-ts-comment": "error"
  },
  extends: ["next/core-web-vitals", "next/typescript", "prettier", "plugin:tailwindcss/recommended"],
  plugins: ["tailwindcss", "prettier"],
  ignorePatterns: ["**/fixtures/**"],
  rules: {
    "prettier/prettier": ["error"],
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }
    ]
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "merge", "twMerge"],
      config: "tailwind.config.ts"
    },
    next: {
      rootDir: ["app/*/"]
    }
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser"
    }
  ]
});

export default eslintConfig;
