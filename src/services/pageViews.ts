import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PageViewStats {
  /** GA4 歷史總瀏覽次數(screenPageViews) */
  pageViews: number;
  /** GA4 歷史總使用者數(totalUsers) */
  users: number;
  updatedAt: Date | null;
}

/**
 * 讀取由排程 Function 寫入 Firestore `stats/pageviews` 的 GA4 總瀏覽數。
 * 前端只讀一筆文件、不直接呼叫 GA / Function,避免流量放大費用。
 * 讀取失敗回傳 null,呼叫端自行決定是否顯示。
 */
export async function fetchPageViewStats(): Promise<PageViewStats | null> {
  try {
    const snap = await getDoc(doc(db, 'stats', 'pageviews'));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      pageViews: Number(data.pageViews ?? 0),
      users: Number(data.users ?? 0),
      updatedAt: data.updatedAt?.toDate?.() ?? null,
    };
  } catch {
    return null;
  }
}
