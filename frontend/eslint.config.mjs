import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Konfigurasi Next.js standar (Core Web Vitals + TypeScript rules)
  ...nextVitals,
  ...nextTs,

  // Override default ignores dari eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tambahan: abaikan file hasil generate dan config Jest
    "coverage/**",
    "jest.config.ts",
    "jest.setup.ts",
  ]),

  // Override khusus untuk file test: izinkan `any` yang sering diperlukan di mock
  {
    files: ["**/__tests__/**/*", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
