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
      <div className="flex h-44 items-start md:h-40">
        <HelloText />
      </div>

      <p className="mt-8 whitespace-pre-line text-base leading-[2] text-text2">
        {t.aboutDev}
      </p>

      <p className="mt-9 font-mono text-base font-bold text-ink">
        {t.emailLabel}
      </p>
      <p className="select-text text-base text-text2">{t.email}</p>

      <div className="mt-9">
        <InfoActionButtons
          resumeLink={data.links.resumeGoogleDocs}
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
