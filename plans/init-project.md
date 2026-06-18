# jess-react-web 初始化實作紀錄(供 Review)

技術棧:**Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 + Firebase**(Storage + Hosting)
對齊參考專案 `~/Documents/React/game-web`,移除企業級重型套件後的精簡版。

---

## 步驟 1 — 改寫 `package.json`

把空殼改成 React 專案設定。

- 加 `"type": "module"`(Vite 使用 ESM)
- scripts:
  - `dev` → `vite`(開發伺服器 localhost:5173)
  - `build` → `tsc && vite build`(先型別檢查再打包到 `dist/`)
  - `preview` → `vite preview`
  - `lint` → `eslint src --ext .ts,.tsx`
  - `deploy` → `npm run build && firebase deploy --only hosting`
- dependencies:`react@18`、`react-dom@18`、`react-router-dom@6`、`firebase@10`
- devDependencies:`vite`、`@vitejs/plugin-react`、`typescript`、型別套件、`tailwindcss`/`postcss`/`autoprefixer`、`vite-tsconfig-paths`、eslint 相關

> 註:`firebase-tools`(部署 CLI)改為全域安裝,不放 devDependencies 以免拖慢 install。

---

## 步驟 2 — 建構/設定檔

| 檔案 | 作用 |
|------|------|
| `index.html` | 網頁進入點,`<div id="root">` + 引入 `/src/main.tsx`,`lang="zh-Hant"` |
| `vite.config.ts` | 啟用 `@vitejs/plugin-react` + `vite-tsconfig-paths`,server port 5173、自動開啟瀏覽器 |
| `tsconfig.json` | 前端設定:`jsx: react-jsx`、`moduleResolution: bundler`、`noEmit`、`@/* → src/*` 別名、strict |
| `tsconfig.node.json` | 給 `vite.config.ts` 用的設定 |
| `tailwind.config.js` | `content` 掃描 `index.html` + `src/**/*.{ts,tsx}` |
| `postcss.config.js` | 載入 tailwindcss + autoprefixer |
| `.eslintrc.cjs` | React Hooks + TypeScript 規則 |

---

## 步驟 3 — Firebase Storage 串接層

| 檔案 | 作用 |
|------|------|
| `.env.example` | 六個 `VITE_FIREBASE_*` 變數範本(真實 `.env` 不進 git) |
| `src/vite-env.d.ts` | 宣告 `import.meta.env` 內 Firebase 變數的型別 |
| `src/lib/firebase.ts` | `initializeApp(config)` → 匯出 `storage`;預留 Auth/Firestore 註解擴充點 |
| `src/hooks/useStorageFile.ts` | 範例 hook:輸入 Storage 路徑 → 回傳 `{ url, loading, error }`,內部用 `ref` + `getDownloadURL`,含 cancelled 防護避免 race condition |

---

## 步驟 4 — App 與頁面骨架

| 檔案 | 作用 |
|------|------|
| `src/main.tsx` | `createRoot` 掛 `<BrowserRouter><App /></BrowserRouter>`,引入 `index.css` |
| `src/index.css` | Tailwind 三條 directives |
| `src/App.tsx` | react-router-dom v6 路由:`/` → Home、`/about` → About,外層包 `Layout` |
| `src/components/Layout.tsx` | 頂部導覽列(首頁/關於,含 active 樣式)+ `<Outlet />` |
| `src/pages/Home.tsx` | 首頁,用 `useStorageFile('images/hero.jpg')` 示範串接 Storage 並顯示圖片/載入/錯誤狀態 |
| `src/pages/About.tsx` | 靜態關於頁範例 |

---

## 步驟 5 — Firebase Hosting 部署設定

| 檔案 | 作用 |
|------|------|
| `firebase.json` | `hosting.public = "dist"`、SPA rewrites 全導向 `/index.html`、ignore node_modules 等 |
| `.firebaserc` | `projects.default` 預留 `your-project-id` placeholder |
| `README.md` | 開發/設定/部署完整說明 |

---

## 步驟 6 — 清理

- 刪除舊的 `src/index.ts`(被 `main.tsx` 取代)
- 改寫 `.gitignore`:加入 `node_modules`、`dist`、`.env`、`.firebase`、`.DS_Store`、`.idea` 等

---

## 驗證結果

| 項目 | 結果 |
|------|------|
| `npm install` | ✅ exit 0 |
| `npm run build` | ✅ 通過(tsc + vite build,產出 dist/,gzip JS ≈ 70 kB) |
| `npm run lint` | ✅ 無錯誤 |

---

## 你需要自行完成的事

1. Firebase Console 建立專案 → 啟用 **Storage**
2. `cp .env.example .env` 並填入六組設定值
3. `npm run dev` 開 http://localhost:5173 預覽
4. 部署:`firebase login` → 改 `.firebaserc` 的 project id → `npm run deploy`

## 日後擴充

- 加 Auth / Firestore:於 `src/lib/firebase.ts` 解除對應註解、`import` 對應模組即可
