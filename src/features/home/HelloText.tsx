import { Typewriter } from '@/components/Typewriter';
import { useLocale } from '@/i18n/LocaleContext';

/** 首頁開場的打字機動畫(自我介紹 + 職稱),對應 HelloText。 */
export function HelloText() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col justify-end gap-1">
      <Typewriter
        key={`intro-${t.intro}`}
        text={t.intro}
        speedMs={60}
        className="font-mono text-2xl font-bold text-ink"
      />
      <Typewriter
        key={`position-${t.position}`}
        text={t.position}
        speedMs={80}
        className="font-mono text-2xl font-bold leading-tight text-primary"
      />
    </div>
  );
}
