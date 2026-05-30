import js from "@eslint/js";
import tseslint from "typescript-eslint";

const typedFiles = ["scenarios/**/*.ts"];

export default tseslint.config(
  {
    ignores: [".cache/**"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        fetch: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        URLSearchParams: "readonly",
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: typedFiles,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: typedFiles,
  })),
);
