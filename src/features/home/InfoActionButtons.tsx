import { useLocale } from '@/i18n/LocaleContext';
import { logEvent } from '@/services/analytics';
import { openUrlLink } from '@/lib/utils';

interface InfoActionButtonsProps {
  resumeLink: string;
  portfolioLink: string;
}

/** 首頁的履歷 / 作品集按鈕列(對應 InfoActionButtons)。 */
export function InfoActionButtons({
  resumeLink,
  portfolioLink,
}: InfoActionButtonsProps) {
  const { t } = useLocale();

  const handleClick = (buttonName: string, link: string) => {
    logEvent('button_clicked', { button_name: buttonName, link });
    openUrlLink(link);
  };

  return (
    <div className="flex gap-6">
      <button
        type="button"
        onClick={() => handleClick('resume', resumeLink)}
        className="flex h-12 min-w-[80px] items-center justify-center rounded bg-primary px-4 font-mono text-base font-bold text-accent transition-opacity hover:opacity-90"
      >
        {t.resume}
      </button>
      <button
        type="button"
        onClick={() => handleClick('portfolio', portfolioLink)}
        className="flex h-12 min-w-[80px] items-center justify-center rounded bg-ink-200 px-4 font-mono text-base font-bold text-accent transition-opacity hover:opacity-90"
      >
        {t.portfolio}
      </button>
    </div>
  );
}
