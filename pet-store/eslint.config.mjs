import js from "@eslint/js";

export default [
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
    },
  },
];
