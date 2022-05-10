module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["prettier", "simple-import-sort", "testing-library"],
  rules: {
    "import/no-anonymous-default-export": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "import/newline-after-import": 2,
    //netguru config simple-import-sort
    "simple-import-sort/imports": [
      1, // as warning for now
      {
        groups: [
          // Side effect imports.
          ["^\\u0000"],
          // Packages. `react` related packages come first.
          ["^react", "^@?\\w"],
          // Internal packages.
          // Absolute imports and other imports such as `@/foo`.
          // Anything that does not start with a dot.
          [
            "^(components)(/.*|$)",
            "^(hooks)(/.*|$)",
            "^(helpers)(/.*|$)",
            "^[^.]",
          ],
          // Relative imports.
          // Anything that starts with a dot.
          ["^\\."],
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-explicit-any": 0,
      },
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
};
