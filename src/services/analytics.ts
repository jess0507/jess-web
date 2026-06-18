import { logEvent as fbLogEvent } from 'firebase/analytics';
import { analyticsReady } from '@/lib/firebase';

/**
 * 包裝 Firebase Analytics 的事件紀錄(對應 Flutter 的 AnalyticsService)。
 * 等待 analytics 初始化完成後才送出;環境不支援時靜默略過。
 */
export function logEvent(
  name: string,
  parameters?: Record<string, unknown>
): void {
  void analyticsReady.then((analytics) => {
    if (!analytics) return;
    try {
      fbLogEvent(analytics, name, parameters);
    } catch {
      /* 忽略分析錯誤,不影響使用者體驗 */
    }
  });
}
