import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // Next.js 15 specific rules
            "@next/next/no-img-element": "error",
            "@next/next/no-html-link-for-pages": "error",

            // React 19 specific rules
            "react/no-unescaped-entities": "off",
            "react/jsx-key": "error",

            // TypeScript rules
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",

            // General rules
            "prefer-const": "error",
            "no-var": "error",
        },
    },
];

export default eslintConfig;
