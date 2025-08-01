const { defineConfig, globalIgnores } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const globals = require("globals");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = defineConfig([
    {
        languageOptions: {
            parser: tsParser,
            sourceType: "module",

            parserOptions: {
                project: ["./tsconfig.json"],
                tsconfigRootDir: __dirname,
            },

            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier,
        },

        extends: compat.extends("plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),

        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",

            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    trailingComma: "all",
                    arrowParens: "always",
                    printWidth: 120,
                    tabWidth: 4,
                    semi: true,
                },
            ],
        },
    },
    globalIgnores(["**/libs/common/prisma/generated", "**/dist", "**/node_modules"]),
]);
