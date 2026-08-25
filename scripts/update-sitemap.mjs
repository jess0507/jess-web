// Build 後更新 sitemap:把 dist/sitemap.xml 的 lastmod 換成建置當天日期。
// public/sitemap.xml 只是模板,真正的日期由這步產生,
// 避免每次改版都要手動改日期(忘了改,Google 會當作內容沒更新)。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_SITEMAP = resolve('dist/sitemap.xml');
const LASTMOD = /<lastmod>.*?<\/lastmod>/g;

function run() {
  // 用本地時區取 YYYY-MM-DD(toISOString 是 UTC,台灣半夜建置會差一天)
  const today = new Date().toLocaleDateString('sv-SE');

  const xml = readFileSync(DIST_SITEMAP, 'utf-8');
  const found = xml.match(LASTMOD);
  if (!found) {
    throw new Error('sitemap 找不到 <lastmod>,放棄寫入');
  }

  writeFileSync(DIST_SITEMAP, xml.replace(LASTMOD, `<lastmod>${today}</lastmod>`), 'utf-8');
  console.log(`✓ sitemap lastmod 已更新為 ${today}(${found.length} 筆)`);
}

try {
  run();
} catch (err) {
  console.error('✗ sitemap 更新失敗:', err);
  process.exit(1);
}
