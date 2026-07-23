import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // TAMBAHAN: Suruh linter mengabaikan file ini agar tidak error
  { ignores: ["eslint.config.mjs"] },
  { 
    languageOptions: { 
      globals: globals.node,
      sourceType: "commonjs" 
    } 
  },
  pluginJs.configs.recommended,
];