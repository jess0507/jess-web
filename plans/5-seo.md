# SEO 優化計畫(操作手冊 + 實作範本)

目標:**讓 `Jess Yen 個人網站` 在搜尋引擎與社群分享時被正確索引、有好看的預覽卡片。**

本站現況(影響 SEO 的關鍵點):
- **CSR 單頁 SPA**(Vite + React),HTML 進去只有空的 `<div id="root">`,內容靠 JS 渲染。
- **內容來自 Firestore 非同步載入**(`loadPortfolio`),連 JS 跑完的瞬間都還是空的 → 爬蟲很可能抓不到正文。
- 單頁、用 section(home / projects / skills)切換,沒有真正的多路由。
- 已有:`lang="zh-Hant"`、`<title>`、`<meta description>`。
- 缺少:Open Graph / Twitter Card、canonical、JSON-LD 結構化資料、`robots.txt`、`sitemap.xml`、og 預覽圖。

> 核心觀念:Google 雖然能跑 JS,但「內容延遲從 Firestore 載入」這件事讓索引很不穩定;
> 其他爬蟲(社群預覽、Bing、LINE、FB)大多**不跑 JS**,只看原始 HTML。
> 所以「容易達成」先把 meta 與靜態資訊補滿,「較完整」再解決「正文不在 HTML 裡」的根本問題。

---

## ✅ 進度 Checklist(含檔案位置)

> 狀態:`[x]` 完成 / `[ ]` 待辦 / `[~]` 需手動補

**Part A — 靜態 SEO(已實作,build 已驗證)**

- [x] **A1 meta + OG/Twitter** — `index.html`(title / description / author / keywords / canonical / Open Graph / Twitter Card)
- [x] **A2 robots.txt** — `public/robots.txt`(允許全爬 + 指向 sitemap)
- [x] **A3 sitemap.xml** — `public/sitemap.xml`(單頁,`lastmod` = 2026-06-18)
- [x] **A4 JSON-LD(Person)** — `index.html`(`<script type="application/ld+json">`)
- [x] **manifest.json**(PWA 資訊,參考 game-web)— `public/manifest.json`,於 `index.html` 以 `<link rel="manifest">` 引用
- [x] **og 預覽圖** — `public/og-image.png`(已加入,1200×630 PNG;meta 已指向 `/og-image.png`)
- [x] **JSON-LD `sameAs`** — `index.html`(已填 GitHub `jess0507` / LinkedIn 真實連結)
- [x] **A5 語意 HTML + 圖片 alt** — `<main>`(`ScaffoldWithNav.tsx`)、`<nav>`/`<header>`(`WebNavigationBar.tsx`、`MobileNav.tsx`)、`<section>`(`HomePage.tsx`)、`<h2>`(`NimbusInfoSection.tsx`)、`<h3>`(`SkillSection.tsx`)、`<img alt={title}>`(`ProjectItem.tsx`)皆已具備;最後補上唯一 `<h1>`(`HelloText.tsx` 以 `sr-only` 放姓名+職稱,打字機動畫 `aria-hidden`)
- [x] **A6 部署驗證** — `npm run build && firebase deploy --only hosting`,確認 `/robots.txt`、`/sitemap.xml` 可開啟

**部署後(外部設定)**

- [ ] Google Search Console 加入網站 + 提交 `sitemap.xml`
- [ ] FB Sharing Debugger / LINE 實測 og 卡片
- [ ] **若綁自訂網域**:同步更新網址於 `index.html`(canonical / og:url / og:image / JSON-LD url)、`public/robots.txt`、`public/sitemap.xml`

**Part B — 解決「正文不在 HTML」(未做,視需求)**

- [x] **B1(b) 靜態資料** — `src/data/portfolio.json`(寫死 portfolio 內容)+ `portfolioRepository.ts` 的 `loadPortfolioStatic()`;`PortfolioContext` 改用它。Firestore 版 `loadPortfolio` 仍保留(目前未被打包,tree-shaken)。首屏即有資料、bundle 變小。
- [ ] **B1(a) 預渲染** — 用 `vite-plugin-prerender` / puppeteer 把渲染後 DOM 寫進 `index.html`,讓不跑 JS 的爬蟲也看得到正文(資料已靜態化,這步變單純)
  - (未來若想自動同步 Firestore → JSON:新增 `scripts/fetch-portfolio.ts` 用 firebase-admin 拉資料寫進 `src/data/portfolio.json`,接到 build / CI)
- [ ] **B2 react-helmet-async** — 動態 head(拆多路由後才必要)

---

## 成效量化總覽(先看這張)

> ⚠️ 說明:SEO **沒有保證的排名數字**(排名還受外部連結、競爭者、Google 演算法影響)。
> 下面的 % 是「**SEO 完整度涵蓋率**」——相對於「這類個人作品集站做到滿」的基準,
> 每項措施大約補上多少基礎建設,**不是**「排名上升幾 %」。把它當「待辦清單完成度」看。

**目前現況起點:約 30%**(已有 lang / title / description,但缺 og、結構化資料、sitemap,且正文不在 HTML)。

| 措施 | 本項貢獻 | 累積完整度 | 主要解決什麼 | 你會看到的實際效果 |
|------|:---:|:---:|------|------|
| **現況** | — | **~30%** | — | 搜尋得到名字,但分享連結沒預覽卡、收錄慢 |
| A1 meta + OG/Twitter | **+25%** | ~55% | 搜尋結果呈現 + 社群預覽 | FB/LINE/Slack 貼連結有**標題+描述+縮圖卡片**;Google 搜尋結果標題描述變好看 |
| A2 robots.txt | +3% | ~58% | 爬蟲指引 | 明確告訴爬蟲可抓、指向 sitemap |
| A3 sitemap.xml | +4% | ~62% | 加速收錄 | 提交 Search Console 後**收錄更快更穩** |
| A4 JSON-LD(Person) | +5% | ~67% | 結構化資料 | 有機會進 Google **知識面板 / 複合式搜尋結果**,被理解為「一個人/履歷」 |
| A5 語意 HTML + alt | +5% | ~72% | 內容可讀性 | 標題層級正確、圖片進**圖片搜尋**、無障礙加分 |
| **— Part A 完成 —** | | **~72%** | | 達 80/20 甜蜜點,半天可完成 |
| B1 預渲染 + 靜態 JSON | **+23%** | ~95% | **正文進 HTML(根本問題)** | 所有爬蟲(含不跑 JS 的)都**看得到專案/技能正文**,索引穩定、首屏更快 |
| B2 react-helmet-async | +5% | ~100% | 動態/多路由 head | 拆多路由後每頁有獨立 meta(單頁時效益有限) |

重點解讀:
- **A1 是單項 CP 值最高的**(+25%),只改 `index.html` 就能拿到「社群分享卡片」這個最有感的效果。
- **Part A 全做 ≈ 72%**,半天內完成,適合大多數人「先做到這」。
- **B1 是唯一能補上那關鍵 ~23% 的措施**——因為它解決「爬蟲看原始 HTML 是空的」這個其他項目都繞不過的根本問題。沒做 B1,內容收錄永遠有風險。
- B2 在單頁站幾乎沒差,留到未來拆多路由再做。

---

## Part A — 容易達成(半天內,純靜態,零架構變動)

只改 `index.html` 與新增 `public/` 下的檔案,**不動 React、不影響部署流程**。CP 值最高,先做這段。

### A1. 補齊 `<head>` meta(改 `index.html`)

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />

    <!-- 基本 SEO -->
    <title>Jess Yen 個人網站 | Senior Android & Flutter Engineer</title>
    <meta
      name="description"
      content="Jess Yen 個人網站 — 擁有 7 年行動應用開發經驗的 Senior Android & Flutter Engineer,作品包含 7 款已上架 Google Play 的 App。"
    />
    <meta name="author" content="Jess Yen" />
    <meta name="keywords" content="Jess Yen, Android Engineer, Flutter Engineer, 行動應用開發, 作品集, Portfolio" />
    <link rel="canonical" href="https://你的網域/" />

    <!-- Open Graph(FB / LINE / Slack 等預覽卡片) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Jess Yen 個人網站" />
    <meta property="og:description" content="Senior Android & Flutter Engineer — 7 年行動應用開發經驗。" />
    <meta property="og:url" content="https://你的網域/" />
    <meta property="og:image" content="https://你的網域/og-image.png" />
    <meta property="og:locale" content="zh_TW" />
    <meta property="og:site_name" content="Jess Yen" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Jess Yen 個人網站" />
    <meta name="twitter:description" content="Senior Android & Flutter Engineer — 7 年行動應用開發經驗。" />
    <meta name="twitter:image" content="https://你的網域/og-image.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Lato:wght@400;700;900&family=Gloria+Hallelujah&display=swap"
      rel="stylesheet"
    />
  </head>
  ...
```

要點:
- `og:url` / `canonical` / `og:image` 的網域換成正式網址(Firebase 預設是 `https://<project-id>.web.app`)。
- og:image 建議 **1200×630px PNG**,內容放姓名+職稱即可,放在 `public/og-image.png`。

### A2. 新增 `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://你的網域/sitemap.xml
```

### A3. 新增 `public/sitemap.xml`

單頁站很簡單:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://你的網域/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

> `public/` 下的檔案 Vite 會原封不動複製到 `dist/`,Firebase Hosting 直接就能在根目錄存取。

### A4. JSON-LD 結構化資料(Person Schema)

在 `index.html` 的 `<head>` 或 `<body>` 末尾加一段。讓 Google 知道這是「一個人 / 履歷」:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jess Yen",
  "jobTitle": "Senior Android & Flutter Engineer",
  "email": "merukoo0507@gmail.com",
  "url": "https://你的網域/",
  "description": "擁有 7 年行動應用開發經驗,已開發 7 款上架 Google Play 的 App。",
  "knowsAbout": ["Android", "Flutter", "Kotlin", "Dart", "Mobile Development"],
  "sameAs": [
    "https://github.com/你的帳號",
    "https://www.linkedin.com/in/你的帳號"
  ]
}
</script>
```

> `sameAs` 填你的社群連結(可從 Firestore 的 `socials` 對應內容手動抄進來)。

### A5. 語意化 HTML + 圖片 alt(改 React 元件)

這部分小改 JSX,屬於「容易做、效益穩定」:
- 確保整頁有**唯一一個 `<h1>`**(放姓名或主標),其餘區塊標題用 `<h2>`/`<h3>` 而非純 `<div>`。
  - 對應檔案:`src/features/home/HelloText.tsx`、`InfoSection.tsx`、`SkillSection.tsx`、`ProjectPage.tsx`。
- 區塊用 `<section>` / `<nav>` / `<main>` 等語意標籤包起來(`ScaffoldWithNav.tsx`)。
- 所有專案縮圖 `<img>` 補 `alt`(`ProjectItem.tsx`,用專案 `title` 當 alt)。

### A6. 部署後驗證

```bash
npm run build && firebase deploy --only hosting
```

- Google Search Console:加入網站 → 提交 `sitemap.xml` → 用「網址檢查」看 Google 抓到的渲染結果。
- 社群預覽:FB Sharing Debugger、LINE 用實際貼連結測試 og 卡片。
- `https://你的網域/robots.txt`、`/sitemap.xml` 能直接開到。

---

## Part B — 較完整(解決「正文不在 HTML 裡」的根本問題)

Part A 補好了 meta,但**爬蟲看原始 HTML 仍是空的**(專案、技能內容靠 JS + Firestore 才出現)。
要讓正文真的進到 HTML,有三條路,由淺到深:

### 方案 B1(推薦,改動最小)— Build 時預渲染(Prerender / SSG)

在 `npm run build` 時用無頭瀏覽器把頁面跑一遍,把渲染完成的 DOM **寫死進 `index.html`**。
對「單頁、內容更新不頻繁」的作品集站最划算,且**不用換框架、不用 Node server**,部署照舊丟 Firebase Hosting。

關鍵前提:預渲染時要抓得到內容。目前內容在 Firestore 非同步載入,有兩個做法:
- **(a) 預渲染時等 Firestore 載完**:用 `vite-plugin-prerender` / `puppeteer`,設定「等到某個 DOM 出現」再截 HTML。
- **(b) 把 portfolio 內容在 build 時抓下來變成靜態 JSON**(打 Firestore 一次 → 寫進 `src/data/portfolio.json`),React 首屏直接用靜態資料,Firestore 只做之後的更新。這同時也讓預渲染變單純,**推薦搭配 (b)**。

大致步驟(實作時再細化):
1. `npm i -D vite-plugin-prerender`(或自寫 puppeteer 腳本)。
2. build 流程改成:先跑 `scripts/fetch-portfolio.ts`(用 firebase-admin 把 Firestore 內容寫成 JSON)→ `vite build` → prerender。
3. CI(`.github/workflows/deploy.yml`)的 build step 前面加抓資料那步,需要 service account(已有)。

優點:架構幾乎不動、首屏變快、SEO 內容齊全。
缺點:內容更新後要重新 build/deploy 才會反映在原始 HTML(對作品集站可接受)。

### 方案 B2 — 動態 head 管理(搭配 B1 或單獨用)

裝 `react-helmet-async`,讓 title / description / og 能隨 locale(zh/en)或未來分頁動態變。
- 現在是單頁,效益有限;若之後**拆出真正的多路由**(每個專案一個 URL),這個就必要了。
- 可與 B1 一起:helmet 設定 + 預渲染 → 每頁都有正確且靜態的 meta。

---

## 建議執行順序

| 階段 | 內容 | 投入 | 效益 |
|------|------|------|------|
| 1 | Part A 全部(meta / og / robots / sitemap / JSON-LD / 語意 HTML) | 半天 | 高,立即見效 |
| 2 | 註冊 Google Search Console + 提交 sitemap | 30 分 | 持續觀察用 |
| 3 | 方案 B1(預渲染 + build 時抓靜態資料) | 1~2 天 | 高,解決根本問題 |
| 4 | 方案 B2(視是否拆多路由再決定) | — | 看需求 |

> 先做完 **階段 1~2**(Part A),這是 80% 效益 / 20% 成本的部分;
> 想更完整再進 **階段 3**(B1)。
