import { useEffect, useState } from 'react';
import { fetchPageViewStats, type PageViewStats } from '@/services/pageViews';

/** 取得 GA4 總瀏覽數;載入中或失敗時為 null。 */
export function usePageViews(): PageViewStats | null {
  const [stats, setStats] = useState<PageViewStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPageViewStats().then((s) => {
      if (!cancelled) setStats(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
