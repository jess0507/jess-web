import { useMemo } from 'react';
import { Typewriter } from '@/components/Typewriter';
import { useLocale } from '@/i18n/LocaleContext';

/** 首頁開場的打字機動畫(自我介紹 + 職稱),對應 HelloText。 */
export function HelloText() {
  const { t } = useLocale();
  const lines = useMemo(
    () => [
      {
        text: t.intro,
        speedMs: 60,
        className: 'font-mono text-2xl font-bold text-ink',
      },
      {
        text: t.position,
        speedMs: 80,
        className: 'font-mono text-2xl font-bold leading-tight text-primary',
      },
    ],
    [t.intro, t.position],
  );

  return (
    <>
      {/* 給爬蟲與螢幕報讀器:完整、不被打字機動畫切割的唯一主標 */}
      <h1 className="sr-only">{`${t.intro} ${t.position}`}</h1>
      {/* 視覺呈現的打字機動畫,對輔助技術隱藏避免與 h1 重複 */}
      <div aria-hidden="true">
        <Typewriter lines={lines} />
      </div>
    </>
  );
}
