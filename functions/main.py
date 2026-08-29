"""
排程同步 GA4「歷史總瀏覽次數」到 Firestore。

費用設計:不讓訪客直接打 Function,而是每小時跑一次、把結果寫進
Firestore `stats/pageviews`,前端只讀那一筆文件(免費額度內)。

前置設定(只需一次,詳見 README.md):
  1. 啟用 Google Analytics Data API
  2. GA 後台將 SERVICE_ACCOUNT 加為資源「檢視者」
  3. functions/.env.<project> 設定 GA_PROPERTY_ID 與 SYNC_KEY
"""

import json

from firebase_admin import firestore, initialize_app
from firebase_functions import https_fn, params, scheduler_fn
from firebase_functions.options import MemoryOption
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Metric, RunReportRequest

initialize_app()

GA_PROPERTY_ID = params.StringParam(
    "GA_PROPERTY_ID", description="GA4 資源 ID(純數字)"
)
SYNC_KEY = params.StringParam(
    "SYNC_KEY", description="手動觸發 sync_page_views_now 的密鑰(自訂任意字串)"
)

# GA4 允許查詢的最早日期
GA4_EPOCH = "2015-08-14"
STATS_DOC = "stats/pageviews"
REGION = "asia-east1"
# 明確指定執行身分(專案內已存在的 Admin SDK 服務帳號),GA 後台需授權此帳號為「檢視者」
SERVICE_ACCOUNT = "firebase-adminsdk-fbsvc@jess-yen.iam.gserviceaccount.com"


def fetch_totals() -> dict[str, int]:
    """查 GA4 從有資料以來的總瀏覽數與總使用者數。"""
    client = BetaAnalyticsDataClient()
    response = client.run_report(
        RunReportRequest(
            property=f"properties/{GA_PROPERTY_ID.value}",
            date_ranges=[DateRange(start_date=GA4_EPOCH, end_date="today")],
            metrics=[Metric(name="screenPageViews"), Metric(name="totalUsers")],
        )
    )
    values = response.rows[0].metric_values if response.rows else []
    return {
        "pageViews": int(values[0].value) if len(values) > 0 else 0,
        "users": int(values[1].value) if len(values) > 1 else 0,
    }


def sync_to_firestore() -> dict[str, int]:
    totals = fetch_totals()
    firestore.client().document(STATS_DOC).set(
        {**totals, "updatedAt": firestore.SERVER_TIMESTAMP}, merge=True
    )
    return totals


@scheduler_fn.on_schedule(
    schedule="every 60 minutes",
    timezone=scheduler_fn.Timezone("Asia/Taipei"),
    region=REGION,
    memory=MemoryOption.MB_256,
    retry_count=1,
    service_account=SERVICE_ACCOUNT,
)
def sync_page_views(_event: scheduler_fn.ScheduledEvent) -> None:
    """每小時同步一次(Cloud Scheduler 前 3 個 job 免費)。"""
    totals = sync_to_firestore()
    print("synced pageviews", totals)


@https_fn.on_request(
    region=REGION,
    memory=MemoryOption.MB_256,
    service_account=SERVICE_ACCOUNT,
)
def sync_page_views_now(req: https_fn.Request) -> https_fn.Response:
    """
    手動觸發用(部署後先跑一次,不用等整點)。需帶正確的 key,避免被外人刷:
      curl "https://asia-east1-<project>.cloudfunctions.net/sync_page_views_now?key=<SYNC_KEY>"
    """
    if not SYNC_KEY.value or req.args.get("key") != SYNC_KEY.value:
        return https_fn.Response("forbidden", status=403)
    totals = sync_to_firestore()
    return https_fn.Response(
        response=json.dumps(totals), mimetype="application/json"
    )
