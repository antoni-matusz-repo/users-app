import "dotenv/config";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    globalSetup: ["./tests/unit/global-setup.ts"],
    // Testy integracyjne współdzielą jedną bazę testową i czyszczą ją przez
    // deleteMany() w beforeEach — przy równoległych plikach to wyścig
    // (np. jeden plik kasuje User, gdy drugi w tym momencie tworzy powiązany
    // wiersz Account, co łamie klucz obcy). Prościej wyłączyć równoległość
    // plików niż izolować każdy plik osobnym schematem/bazą.
    fileParallelism: false,
  },
});
