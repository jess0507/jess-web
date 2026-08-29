import { FaEye } from 'react-icons/fa6';
import { useLocale } from '@/i18n/LocaleContext';
import { usePageViews } from '@/hooks/usePageViews';

/**
 * 顯示 GA4 歷史總瀏覽次數(資料來源:Firestore `stats/pageviews`)。
 * 尚未載入或讀取失敗時不佔版面。
 */
export function PageViewCounter({ className = '' }: { className?: string }) {
  const { t, locale } = useLocale();
  const stats = usePageViews();
  if (!stats) return null;

  const formatted = stats.pageViews.toLocaleString(
    locale === 'zh' ? 'zh-Hant-TW' : 'en-US'
  );

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      title={
        stats.updatedAt
          ? `${t.totalViews} · ${stats.updatedAt.toLocaleString()}`
          : t.totalViews
      }
    >
      <FaEye size={12} aria-hidden />
      <span>
        {t.totalViews} {formatted}
      </span>
    </span>
  );
}
