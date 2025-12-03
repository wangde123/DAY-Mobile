import { defineConfig } from "umi";
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const DEFAULT_BASE = '/';
const repoBase = '/DAY-Mobile/';
const publicPath = process.env.PUBLIC_PATH ?? repoBase;

export default defineConfig({
  npmClient: 'pnpm',
  base: publicPath === '/' ? DEFAULT_BASE : repoBase,
  publicPath,
  hash: true,  // 启用文件哈希，确保文件名变化强制更新
  history: {
    type: 'browser',
  }
});
