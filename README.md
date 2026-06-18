# jess-react-web

Jess 的個人網站。技術棧:**Vite + React 18 + TypeScript + Tailwind CSS**,後端串接 **Firebase**(Storage + Hosting)。

## 開始開發

```bash
npm install          # 安裝依賴
cp .env.example .env # 建立環境變數檔,並填入 Firebase 設定值
npm run dev          # 啟動開發伺服器(http://localhost:5173)
```

### Firebase 設定值哪裡找?

Firebase Console → 選你的專案 → 專案設定(齒輪)→ 「你的應用程式」→ SDK 設定，把對應值填進 `.env`：

| .env 變數 | 對應 Firebase 欄位 |
|-----------|--------------------|
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

## 指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 本機開發伺服器 |
| `npm run build` | 型別檢查 + 打包到 `dist/` |
| `npm run preview` | 預覽打包結果 |
| `npm run lint` | ESLint 檢查 |
| `npm run deploy` | build 後部署到 Firebase Hosting |

## 部署到 Firebase Hosting

```bash
npm install -g firebase-tools   # 第一次需安裝 CLI
firebase login                  # 互動式登入
firebase use your-project-id    # 設定 .firebaserc 內的專案 id
npm run deploy                  # = npm run build && firebase deploy --only hosting
```

## 專案結構

```
src/
├── main.tsx              # 入口:createRoot + BrowserRouter
├── App.tsx              # 路由表
├── index.css           # Tailwind directives
├── lib/firebase.ts     # Firebase 初始化(匯出 storage)
├── hooks/              # 自訂 hooks(useStorageFile)
├── components/         # 共用元件(Layout)
└── pages/              # 頁面(Home / About)
```

> 日後若要加 Auth / Firestore，於 `src/lib/firebase.ts` 解除對應註解即可。
