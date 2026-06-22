// Build 後預渲染:用 Vite SSR(react-dom/server)把 App 渲染成 HTML,
// 注入 dist/index.html 的 #root。資料已靜態化(src/data/portfolio.json),
// 首次渲染即含完整內容,因此這步單純可靠。
// 目的:讓「不跑 JS」的爬蟲(社群預覽、Bing、LINE、FB 等)也能在原始 HTML 看到正文。
// 不依賴瀏覽器,任何環境(Cloudflare Pages 等精簡 Linux)都能執行。
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_INDEX = resolve('dist/index.html');
const ROOT_DIV = '<div id="root"></div>';

async function run() {
  // 以中介模式起 Vite,只用它的 SSR 模組載入能力(處理 TS/JSX/alias/define)
  const vite = await createServer({
    appType: 'custom',
    server: { middlewareMode: true },
    logLevel: 'warn',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const appHtml = render();

    // 保險:確認真的抓到正文,避免把空殼寫回去
    if (!appHtml.includes('<main')) {
      throw new Error('預渲染結果不含 <main>,放棄寫入');
    }

    const template = readFileSync(DIST_INDEX, 'utf-8');
    if (!template.includes(ROOT_DIV)) {
      throw new Error(`找不到注入點 ${ROOT_DIV},放棄寫入`);
    }

    const html = template.replace(ROOT_DIV, `<div id="root">${appHtml}</div>`);
    writeFileSync(DIST_INDEX, html, 'utf-8');
    console.log(`✓ 預渲染完成,已寫入 ${DIST_INDEX}`);
  } finally {
    await vite.close();
  }
}

run().catch((err) => {
  console.error('✗ 預渲染失敗:', err);
  process.exit(1);
});
