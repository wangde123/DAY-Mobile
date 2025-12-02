import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  base: '/DAY-Mobile/',
  publicPath: '/DAY-Mobile/',
  hash: false,
  history: {
    type: 'browser',
  }
});
