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

  return <Typewriter lines={lines} />;
}
