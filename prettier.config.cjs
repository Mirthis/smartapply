// /** @type {import("prettier").Config} */
const config = {
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "^react(.*)$",
    "^next(.*)$",
    "^~/utils/(.*)$",
    "^~/components(.*)$",
    "^[~/]",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
