import { FaHeart } from 'react-icons/fa6';
import { useLocale } from '@/i18n/LocaleContext';
import { usePortfolio } from '@/data/PortfolioContext';
import { SocialIconsRow } from '@/components/SocialIcons';

/** 行動版抽屜底部:社群圖示與「Made in Taiwan」署名(對應 DrawerFooter)。 */
export function DrawerFooter() {
  const { t } = useLocale();
  const { data } = usePortfolio();

  return (
    <div className="flex flex-col items-center gap-3">
      <SocialIconsRow
        socials={data.socials}
        source="mobile_drawer"
        buttonClassName="bg-ink-100"
        iconClassName="text-white"
        className="justify-center"
      />

      <p className="text-center text-sm font-bold text-text2">
        {t.buildBy}{' '}
        <span className="font-black text-white underline">{t.jessYen}</span>
      </p>

      <p className="flex items-center gap-1 text-sm font-bold text-text2">
        {t.madeIn}
        <span>🇹🇼</span>
        {t.withText}
        <FaHeart size={12} className="text-brandred" />
      </p>
    </div>
  );
}
