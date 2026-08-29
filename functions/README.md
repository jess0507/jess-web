# 總瀏覽次數同步(GA4 → Firestore)

架構:Cloud Scheduler 每小時觸發 `sync_page_views`,用 GA4 Data API 查「從有資料以來」的
`screenPageViews` / `totalUsers`,寫入 Firestore `stats/pageviews`。
前端(`src/services/pageViews.ts`)只讀這一筆文件,不會因訪客數增加 Function 花費。

預估費用:Function 每月 ~720 次、Scheduler 1 個 job、GA API 每小時 1 次,全部在免費額度內。
但排程 Function 需要 **Blaze 方案**;建議到 GCP「預算與警示」設 $1 警示。

## 一次性設定

1. **啟用 Analytics Data API**
   https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=jess-yen
2. **授權服務帳號讀 GA**
   GA 後台 → 管理 → 資源存取權管理 → 新增 `firebase-adminsdk-fbsvc@jess-yen.iam.gserviceaccount.com`,角色「檢視者」。
3. **取得 GA4 資源 ID**
   GA 後台 → 管理 → 資源設定 → 「資源 ID」(純數字,不是 `G-XXXX`)。
4. **部署 Functions 與 Firestore rules**(本專案 Hosting 走 git tag,這裡另外跑一次即可)
   ```sh
   cd functions && python3 -m venv venv && venv/bin/pip install -r requirements.txt && cd ..
   firebase deploy --only functions,firestore:rules
   ```
   第一次會詢問 `GA_PROPERTY_ID`(步驟 3 的數字)與 `SYNC_KEY`(自訂任意字串),
   會存到 `.env.jess-yen`(已加入 .gitignore)。
5. **手動同步一次**(不用等整點)
   ```sh
   curl "https://asia-east1-jess-yen.cloudfunctions.net/sync_page_views_now?key=<SYNC_KEY>"
   ```
   回傳 `{"pageViews":..., "users":...}` 即成功。
6. **GitHub Secrets 補上 `VITE_FIREBASE_MEASUREMENT_ID`**
   之前 `deploy.yml` 沒傳這個值,正式站的 GA 可能一直沒啟動;補上後推 tag 重新部署。

## 除錯

```sh
firebase functions:log --only sync_page_views
```

常見錯誤:
- `PERMISSION_DENIED` / `User does not have sufficient permissions` → 步驟 2 沒加或加錯帳號。
- `API has not been used in project` → 步驟 1 未啟用。


## Deploy
```sh
firebase deploy --only functions
```