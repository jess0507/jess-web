# jess-react-web

Jess 的個人網站(由原 Flutter Web 專案改寫)。技術棧:**Vite + React 18 + TypeScript + Tailwind CSS**,後端串接 **Firebase**(Firestore + Analytics + Storage + Hosting)。

單頁式作品集,含三個捲動區塊(自我介紹 / 專案 / 技能)、中英雙語切換、RWD 導覽列與行動版抽屜選單。portfolio 內容由 Firestore `config/portfolio` 文件的 `data` 欄位載入。

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
| `VITE_FIREBASE_MEASUREMENT_ID` | measurementId(Analytics 用,選填) |

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
├── main.tsx                  # 入口:createRoot
├── App.tsx                   # Provider 組合 + app_opened 事件 + 載入失敗提示
├── index.css                 # Tailwind directives + 打字機游標動畫
├── lib/
│   ├── firebase.ts           # Firebase 初始化(storage / firestore / analytics)
│   └── utils.ts              # openUrlLink / scrollToSection
├── services/                 # analytics(事件紀錄)/ deviceInfo(裝置資訊)
├── data/                     # 型別、Firestore repository、PortfolioContext
├── i18n/                     # 翻譯字典(zh/en)與 LocaleContext
├── hooks/                    # useIsMobile(RWD 斷點)
├── components/               # 共用元件(SocialIcons / NimbusInfoSection / Typewriter)
└── features/
    ├── home/                 # 首頁區塊(InfoSection / ProjectPage / SkillSection …)
    ├── navigation/           # 導覽列、行動抽屜、語系選擇器
    └── version/              # 版本標籤
```

### 對應原 Flutter 專案

| Flutter | React |
|---------|-------|
| Riverpod `portfolioProvider` (AsyncNotifier) | `data/PortfolioContext` |
| `localeProvider` + gen_l10n `.arb` | `i18n/LocaleContext` + `translations.ts` |
| `responsive_builder` 的 RefinedBreakpoints | `hooks/useIsMobile` |
| `AnimatedTextKit` 打字機 | `components/Typewriter` |
| `go_router` / `Scrollable.ensureVisible` | 單頁錨點 + `scrollIntoView` + IntersectionObserver |
| `package_info_plus` 版本 | build 時注入 `__APP_VERSION__` |
