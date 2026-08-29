import { FaEye, FaUser } from 'react-icons/fa6';
import { useLocale } from '@/i18n/LocaleContext';
import { usePageViews } from '@/hooks/usePageViews';

/**
 * 顯示 GA4 歷史總瀏覽次數與使用者數(資料來源:Firestore `stats/pageviews`),
 * 瀏覽數與使用者數各一行。尚未載入或讀取失敗時不佔版面。
 */
export function PageViewCounter({ className = '' }: { className?: string }) {
  const { t, locale } = useLocale();
  const stats = usePageViews();
  if (!stats) return null;

  const fmt = (n: number) =>
    n.toLocaleString(locale === 'zh' ? 'zh-Hant-TW' : 'en-US');
  const views = t.totalViews.replace('{n}', fmt(stats.pageViews));
  const users = t.totalUsers.replace('{n}', fmt(stats.users));

  return (
    <span
      className={`inline-flex flex-col gap-0.5 ${className}`}
      title={stats.updatedAt ? stats.updatedAt.toLocaleString() : undefined}
    >
      <span className="inline-flex items-center gap-1">
        <FaEye size={12} aria-hidden />
        {views}
      </span>
      <span className="inline-flex items-center gap-1">
        <FaUser size={11} aria-hidden />
        {users}
      </span>
    </span>
  );
}
