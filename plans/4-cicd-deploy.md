# CI/CD 自動部署步驟(操作手冊,非實作)

目標:**`git push` 到 `master` 時,自動 build 並部署到 Firebase Hosting。**
做法:GitHub Actions + Firebase CLI。

前置:已完成 `plans/firebase-setup.md`(專案已建立、`.firebaserc` 已綁好 project id、本機能 `npm run deploy`)。

---

## 整體流程

```
git push master
   └─ GitHub Actions 觸發
        ├─ checkout 程式碼
        ├─ setup Node + npm ci
        ├─ 注入 VITE_FIREBASE_* secrets → npm run build(產出 dist/)
        └─ firebase deploy --only hosting(用 service account 授權)
```

---

## 步驟 1 — 建立 GitHub repo 並推上去

目前專案還沒有 remote,先建立:

```bash
# 在 GitHub 建好空 repo 後(或用 gh CLI 直接建):
gh repo create jess-react-web --private --source=. --remote=origin

# 或手動加 remote
git remote add origin git@github.com:<你的帳號>/jess-react-web.git
git push -u origin master
```

> 注意:`.env` 不會被推上去(在 `.gitignore`),所以 build 需要的設定值要改放 GitHub Secrets(步驟 3)。

---

## 步驟 2 — 取得 Firebase 部署用憑證(Service Account)

CI 環境不能互動式 `firebase login`,要用「服務帳號金鑰」授權。推薦官方 action 的方式:

```bash
# 在專案根目錄執行,會自動建立 service account 並把金鑰存成檔案 + 設好 GitHub secret
firebase init hosting:github
```

這個指令會:
- 問你要綁哪個 GitHub repo
- 自動建立 service account、產生金鑰
- 把金鑰寫進 GitHub Secret(預設名稱 `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID>`)
- 順手幫你產生一份 workflow yml(可保留或改寫成步驟 4 的版本)

> 手動替代方案:Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰(JSON),
> 再到 GitHub repo → Settings → Secrets and variables → Actions → 新增
> `FIREBASE_SERVICE_ACCOUNT`,貼上整份 JSON 內容。

---

## 步驟 3 — 設定 GitHub Secrets(build 用的環境變數)

`npm run build` 需要六個 `VITE_FIREBASE_*` 值。到 GitHub repo:
**Settings → Secrets and variables → Actions → New repository secret**,逐一新增:

| Secret 名稱 | 值 |
|------|------|
| `VITE_FIREBASE_API_KEY` | (同 .env) |
| `VITE_FIREBASE_AUTH_DOMAIN` | |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | |
| `VITE_FIREBASE_APP_ID` | |
| `FIREBASE_SERVICE_ACCOUNT` | service account JSON(步驟 2,若用 init 則名稱不同) |

> 也可用 CLI 批次設定:`gh secret set VITE_FIREBASE_API_KEY` 會提示你貼上值。

---

## 步驟 4 — 建立 workflow 檔

新增 `.github/workflows/deploy.yml`(實作時才建,這裡是內容範本):

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [master]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live          # live = 正式部署;省略則部署到預覽頻道
          projectId: your-project-id
```

要點:
- `on.push.branches: [master]` → 只在 push 到 master 時跑
- `channelId: live` 才會發布到正式站;拿掉會走「PR 預覽頻道」
- `projectId` 填你的真實 project id(或讓 action 從 `.firebaserc` 讀)
- build step 把 secrets 餵成環境變數,Vite 才抓得到 `VITE_*`

> 替代寫法(不用官方 action,直接用 CLI):
> 在 deploy step 設 `GOOGLE_APPLICATION_CREDENTIALS` 指向寫出的金鑰檔,
> 執行 `npx firebase-tools deploy --only hosting --project your-project-id`。
> 官方 action 較省事,建議用上面那版。

---

## 步驟 5 — 驗證

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: auto deploy to firebase hosting on push to master"
git push origin master
```

- 到 GitHub repo → **Actions** 分頁看 workflow 執行狀況
- 綠勾後開 `https://your-project-id.web.app` 確認上線
- 失敗常見原因:secret 名稱拼錯、service account 權限不足、`npm run build` 型別錯誤

---

## 進階(可選)

| 需求 | 做法 |
|------|------|
| PR 預覽環境 | 加一個 `on: pull_request` 的 job,`channelId` 留空 → 自動產生臨時預覽網址 |
| 先過測試再部署 | 在 build 前加 `npm run lint`(失敗就中止部署) |
| 手動觸發 | workflow 加 `on: workflow_dispatch` |
| 只在 dist 有變動才部署 | 用 `paths` 過濾或加 build 快取 |

---

## 安全提醒

- service account JSON、`.env` 值一律走 GitHub Secrets,**不要**寫進 yml 或 commit
- service account 權限給最小化(Firebase Hosting Admin 即可)
- `GITHUB_TOKEN` 是 Actions 內建,不需自己建立
