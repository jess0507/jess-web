// Build 後預渲染:用 vite preview 起本機伺服器,puppeteer 跑一遍頁面,
// 把 React 渲染完成的 DOM 寫回 dist/index.html。
// 目的:讓「不跑 JS」的爬蟲(社群預覽、Bing、LINE、FB 等)也能在原始 HTML 看到正文。
// 資料已靜態化(src/data/portfolio.json),首屏即會渲染,因此這步單純可靠。
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_INDEX = resolve('dist/index.html');
// 等到專案卡片真正渲染出來(只有資料載入後才會有 main 內的 <img>)
const CONTENT_SELECTOR = 'main button img';

async function run() {
  // 1. 起一個只服務 dist/ 的本機預覽伺服器
  const server = await preview({
    preview: { port: 4173, strictPort: false, open: false },
  });
  const url = server.resolvedUrls?.local?.[0] ?? 'http://localhost:4173/';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // 等正文渲染(資料載入 → 專案卡片出現)
    await page.waitForSelector(CONTENT_SELECTOR, { timeout: 30000 });

    const rendered = await page.content();

    // 保險:確認真的抓到正文,避免把空殼寫回去
    if (!rendered.includes('<main')) {
      throw new Error('預渲染結果不含 <main>,放棄寫入');
    }

    writeFileSync(DIST_INDEX, rendered, 'utf-8');
    console.log(`✓ 預渲染完成,已寫入 ${DIST_INDEX}`);
  } finally {
    await browser.close();
    await server.httpServer.close();
  }
}

run().catch((err) => {
  console.error('✗ 預渲染失敗:', err);
  process.exit(1);
});
