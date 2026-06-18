# Firebase 串接步驟(操作手冊,非實作)

本專案程式碼層已備妥(`src/lib/firebase.ts`、`firebase.json`、`.firebaserc`、`.env.example`)。
這份文件是「人工要做的事」:從 0 到能 `npm run dev` 預覽、`npm run deploy` 部署的完整指令流程。

技術棧:**Vite + React + Firebase(Storage + Hosting)**

---

## 前置需求

- 已安裝 Node.js(專案用 Vite 5,建議 Node 18+)
- 一個 Google 帳號
- 終端機在專案根目錄 `jess-react-web/`

---

## 步驟 1 — 安裝 Firebase CLI(全域)

> 專案刻意不把 `firebase-tools` 放進 devDependencies(避免拖慢 install),改全域安裝。

```bash
npm install -g firebase-tools

# 確認安裝成功
firebase --version
```

---

## 步驟 2 — 登入 Firebase

```bash
firebase login
```

- 會開啟瀏覽器要你用 Google 帳號授權
- CI / 無瀏覽器環境改用:`firebase login --no-localhost`
- 確認登入身分:`firebase login:list`
- 之後要換帳號:`firebase logout` 再重新 `firebase login`

---

## 步驟 3 — 在 Firebase Console 建立專案

到 https://console.firebase.google.com/

1. **Add project** → 命名(例如 `jess-react-web`)→ 建立(Analytics 可略過)
2. 進專案後 **Build → Storage** → **Get started** → 選測試 / 正式模式 → 選地區 → 啟用
3. **Build → Authentication**、**Firestore** 目前不需要(日後再開)

> 也可用 CLI 建立:`firebase projects:create your-project-id`
> 查看現有專案:`firebase projects:list`

---

## 步驟 4 — 取得 Web App 設定值

Console → 專案設定(⚙️ Project settings)→ 最下方 **Your apps**:

1. 點 `</>`(Web)圖示新增一個 Web App → 取名 → 註冊
2. 複製 `firebaseConfig` 物件裡的六個值:
   - `apiKey`、`authDomain`、`projectId`、`storageBucket`、`messagingSenderId`、`appId`

> 這些值對應 `src/lib/firebase.ts` 讀的六個 `VITE_FIREBASE_*` 環境變數。

---

## 步驟 5 — 建立本機 `.env`

```bash
cp .env.example .env
```

把步驟 4 的值填進 `.env`(`.env` 已在 `.gitignore`,不會進 git):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> 注意:`VITE_` 前綴是 Vite 才會把變數注入前端的必要條件;改完 `.env` 要重啟 `npm run dev`。

---

## 步驟 6 — 綁定部署用的 project id

把 `.firebaserc` 裡的 placeholder 改成你的真實 project id:

```bash
# 方式 A:手動編輯 .firebaserc,把 "your-project-id" 改掉
# 方式 B:用 CLI 指定 default 別名
firebase use --add        # 互動選擇專案並設別名
firebase use your-project-id
```

確認目前指向哪個專案:`firebase use`

---

## 步驟 7 — 本機驗證

```bash
npm install        # 若還沒裝過依賴
npm run dev        # 開 http://localhost:5173
```

- 首頁 `Home.tsx` 會用 `useStorageFile('images/hero.jpg')` 抓 Storage 圖片
- 要看到圖:先到 Console → Storage 上傳一張 `images/hero.jpg`
- 抓不到圖通常是:`.env` 沒填對、Storage 規則擋住、或路徑不符

---

## 步驟 8 — 部署到 Firebase Hosting

```bash
# package.json 已定義:build 後 deploy hosting
npm run deploy
# 等同 npm run build && firebase deploy --only hosting
```

- 部署完 CLI 會印出 Hosting URL(`https://your-project-id.web.app`)
- 只想預覽不正式發布:`firebase hosting:channel:deploy preview`
- 部署紀錄 / 回滾:Console → Hosting

> `firebase.json` 已設定 `public: "dist"` + SPA rewrites(全部導向 `/index.html`),無需再調整。

---

## 常用指令速查

| 指令 | 用途 |
|------|------|
| `firebase login` / `logout` / `login:list` | 帳號登入登出 |
| `firebase projects:list` | 列出所有專案 |
| `firebase use [alias]` | 切換 / 查看當前專案 |
| `firebase deploy --only hosting` | 只部署 Hosting |
| `firebase hosting:channel:deploy preview` | 部署到預覽頻道 |
| `firebase serve` | 本機模擬 Hosting(用 dist) |
| `firebase emulators:start` | 啟動本地模擬器(Storage/Auth 等) |

---

## 安全提醒

- `.env` **絕不**進 git(已在 `.gitignore`)
- Web `apiKey` 本來就會曝光在前端,真正的安全靠 **Storage / Firestore Security Rules**;正式上線前務必把 Storage 規則從測試模式收緊
- Storage 規則範例(只開放讀、限制寫)需到 Console → Storage → Rules 設定

---

## 日後擴充(Auth / Firestore)

1. `src/lib/firebase.ts` 解除對應註解(`getAuth` / `getFirestore`)
2. Console 啟用對應服務
3. `firebase` 套件已含這些模組,無需再裝
