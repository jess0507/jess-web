import { useLocale } from '@/i18n/LocaleContext';
import { logEvent } from '@/services/analytics';
import { openUrlLink } from '@/lib/utils';

interface InfoActionButtonsProps {
  resumeEnLink: string;
  resumeZhLink: string;
  portfolioLink: string;
}

const buttonBase =
  'flex h-12 min-w-[80px] items-center justify-center rounded px-4 font-mono text-base font-bold transition-opacity hover:opacity-90';

/** 首頁的英文履歷 / 中文履歷 / 作品集按鈕列(對應 InfoActionButtons)。 */
export function InfoActionButtons({
  resumeEnLink,
  resumeZhLink,
  portfolioLink,
}: InfoActionButtonsProps) {
  const { t } = useLocale();

  const handleClick = (buttonName: string, link: string) => {
    logEvent('button_clicked', { button_name: buttonName, link });
    openUrlLink(link);
  };

  const buttons = [
    { name: 'resume_en', label: t.resumeEn, link: resumeEnLink, bg: 'bg-primary text-black' },
    { name: 'resume_zh', label: t.resumeZh, link: resumeZhLink, bg: 'bg-primary text-black' },
    { name: 'portfolio', label: t.portfolio, link: portfolioLink, bg: 'bg-ink-200 text-accent' },
  ];

  return (
    <div className="flex flex-wrap gap-6">
      {buttons.map((b) => (
        <button
          key={b.name}
          type="button"
          onClick={() => handleClick(b.name, b.link)}
          className={`${buttonBase} ${b.bg}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
