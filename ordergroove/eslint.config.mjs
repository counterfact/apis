import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".cache/", "counterfact-types/", "node_modules/", "types/"],
  },
  ...tseslint.configs.recommended,
);
