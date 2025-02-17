import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    plugins: {
      react,
    },
    languageOptions: {
      globals: {
        window: "readonly",
        fetch: "readonly",
        URL: "readonly",
      },
    },
  },
];
