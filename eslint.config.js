const tseslint = require("typescript-eslint");
const eslint = require("@eslint/js");
const angular = require("angular-eslint");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      ...tseslint.configs.stylistic,
      prettierRecommended,
    ],
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierRecommended,
    ],
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  }
);
