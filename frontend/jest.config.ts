import type { Config } from "jest";

const config: Config = {
  // Gunakan ts-jest untuk transpilasi TypeScript
  preset: "ts-jest",

  // Simulasi DOM browser (wajib untuk React Testing Library)
  testEnvironment: "jsdom",

  // Jalankan setup file setelah jsdom siap (untuk @testing-library/jest-dom matchers)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Resolusi path alias @/* → src/* (sesuai tsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock CSS modules agar tidak error saat diimpor di komponen
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
  },

  // Pola file test yang dikenali
  testMatch: [
    "**/__tests__/**/*.(ts|tsx)",
    "**/?(*.)+(spec|test).(ts|tsx)",
  ],

  // Konfigurasi ts-jest agar bisa handle JSX
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },

  // Abaikan folder berikut saat mencari test
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],

  // Ekstensi modul yang dikenali
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Konfigurasi coverage jika dijalankan dengan: npm test -- --coverage
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/app/**", // Next.js pages/layouts biasanya diuji E2E, bukan unit
  ],
};

export default config;
