import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'pnpm',
  base: '/DAY-Mobile/',
  publicPath: '/DAY-Mobile/',
  hash: false,
  history: {
    type: 'browser',
  }
});
