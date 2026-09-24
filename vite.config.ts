import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      setup: {
        command: [],
        dependsOn: ["config"],
      },
      config: {
        command: "vp config",
      },
      lint: {
        command: [],
        dependsOn: ["lint:vp", "lint:ruff", "lint:tofu"],
      },
      "lint:vp": {
        command: "vp check",
      },
      "lint:ruff": {
        command: "uv run --no-sync ruff check",
      },
      "lint:tofu": {
        command: "tofu -chdir=tofu fmt --check",
      },
      fix: {
        command: [],
        dependsOn: ["fix:vp", "fix:ruff", "fix:tofu"],
      },
      "fix:vp": {
        command: "vp check --fix",
      },
      "fix:ruff": {
        command: "uv run --no-sync ruff check --fix",
      },
      "fix:tofu": {
        command: "tofu -chdir=tofu fmt",
      },
      test: {
        command: "vp test",
      },
      "tofu:init": {
        command:
          'tofu -chdir=tofu init -upgrade -reconfigure -backend-config="bucket=tofu-$(aws sts get-caller-identity --query Account --output text)"',
      },
      "tofu:plan": {
        command: "tofu -chdir=tofu plan",
      },
      "tofu:apply": {
        command: "tofu -chdir=tofu apply -auto-approve",
      },
      ci: {
        command: [],
        dependsOn: ["lint", "test"],
      },
    },
  },
  fmt: {
    printWidth: 120,
    sortImports: {
      newlinesBetween: false,
    },
    sortTailwindcss: {},
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "vitest", "node", "import"],
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
      "@stylistic/eslint-plugin",
    ],
    rules: {
      curly: "error",
      "vite-plus/prefer-vite-plus-imports": "error",
      "node/no-process-env": "error",
      "unicorn/prefer-node-protocol": "error",
      "typescript/consistent-type-imports": ["error", { prefer: "no-type-imports" }],
      "vitest/valid-expect": ["warn", { maxArgs: 2 }],
      "@stylistic/padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: "*",
          next: [
            "import",
            "export",
            "class",
            "function",
            "block",
            "block-like",
            "multiline-expression",
            "multiline-const",
            "multiline-let",
          ],
        },
        {
          blankLine: "always",
          prev: [
            "import",
            "export",
            "class",
            "function",
            "block",
            "block-like",
            "multiline-expression",
            "multiline-const",
            "multiline-let",
          ],
          next: "*",
        },
        { blankLine: "never", prev: "import", next: "import" },
        { blankLine: "never", prev: "*", next: ["case", "default"] },
        { blankLine: "never", prev: ["case", "default"], next: "*" },
      ],
    },
  },
  test: {
    passWithNoTests: true,
  },
  staged: {
    "*": "vp check --fix",
    "*.py": "uv run --no-sync ruff check --fix",
    "*.tofu": "tofu -chdir=tofu fmt",
  },
});
