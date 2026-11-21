import { useLocale } from '@/i18n/LocaleContext';
import { usePortfolio } from '@/data/PortfolioContext';
import { SocialIconsRow } from '@/components/SocialIcons';
import { HelloText } from './HelloText';
import { InfoActionButtons } from './InfoActionButtons';

/** 首頁的自我介紹區塊(對應 InfoSection)。 */
export function InfoSection() {
  const { t } = useLocale();
  const { data } = usePortfolio();

  return (
    <div className="flex flex-col items-start">
      <div className="flex h-44 items-start pt-20 md:h-40">
        <HelloText />
      </div>

      <p className="mt-4 whitespace-pre-line text-base leading-[2] text-text2">
        {t.aboutDev}
      </p>

      <p className="mt-9 flex flex-wrap items-baseline gap-x-2 text-base">
        <span className="font-mono font-bold text-ink">{t.emailLabel}</span>
        <span className="select-text text-text2">{t.email}</span>
      </p>

      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-base">
        <span className="font-mono font-bold text-ink">{t.telegramLabel}</span>
        <span className="select-text text-text2">{t.telegram}</span>
      </p>

      <div className="mt-9">
        <InfoActionButtons
          resumeEnLink={data.links.resumeEn}
          resumeZhLink={data.links.resumeZh}
          portfolioLink={data.links.portfolioGoogleDocs}
        />
      </div>

      <div className="mt-7">
        <SocialIconsRow
          socials={data.socials}
          source="info_section"
          buttonClassName="bg-transparent"
          iconSize={18}
        />
      </div>
    </div>
  );
}
