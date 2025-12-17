// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.js
// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  // TypeScript / .ts
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig, // turn off rules that conflict with Prettier
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@angular-eslint/prefer-inject": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "eslint@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@angular-eslint/no-empty-lifecycle-method": "off",
      "@angular-eslint/no-output-on-prefix": "off",
      "no-empty": "off",
      // "@angular-eslint/directive-selector": [
      //   "error",
      //   { type: "attribute", prefix: "app", style: "camelCase" },
      // ],
      // "@angular-eslint/component-selector": [
      //   "error",
      //   { type: "element", prefix: "app", style: "kebab-case" },
      // ],
      // Run Prettier via ESLint
      // "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  // Templates / .html
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierConfig, // keep template lint rules from fighting formatting
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@angular-eslint/template/no-negated-async": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      // Let Prettier format HTML too
      // "prettier/prettier": "error",
    },
  }
);
