import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { execFileSync } from 'node:child_process';

/**
 * 版本號來源為 git tag(package.json 的 version 已停用,固定 1.0.0)。
 * CI 由 APP_VERSION 傳入;本機開發則直接讀最近一個 tag,讀不到就顯示 dev。
 */
function resolveAppVersion(): string {
  if (process.env.APP_VERSION) return process.env.APP_VERSION;
  try {
    const tag = execFileSync('git', ['describe', '--tags', '--abbrev=0'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return tag.replace(/^v/, '') || 'dev';
  } catch {
    return 'dev';
  }
}

const appVersion = resolveAppVersion();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  server: {
    port: 5173,
    open: true,
  },
});
