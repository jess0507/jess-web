import { useLocale } from '@/i18n/LocaleContext';
import { usePortfolio } from '@/data/PortfolioContext';
import { navLabel } from '@/i18n/translations';
import { SocialIconsRow } from '@/components/SocialIcons';
import { NavItem } from './NavItem';
import { LocaleSelector } from './LocaleSelector';
import { navItemsData } from './navItems';

interface WebNavigationBarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

/** 桌機版頂部導覽列(對應 WebNavigationBar)。 */
export function WebNavigationBar({
  activeKey,
  onSelect,
}: WebNavigationBarProps) {
  const { t } = useLocale();
  const { data } = usePortfolio();

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center bg-white px-10 shadow-nav">
      <span className="font-mono text-xl font-bold text-ink">{t.logo}</span>

      <div className="mx-8 h-8 w-px bg-brandgrey-100" />

      <nav className="flex h-full items-center">
        {navItemsData.map((item) => (
          <NavItem
            key={item.key}
            title={navLabel(t, item.key)}
            isSelected={activeKey === item.key}
            onClick={() => onSelect(item.key)}
          />
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-5">
        <SocialIconsRow socials={data.socials} source="web_navigation_bar" />
        <LocaleSelector />
      </div>
    </header>
  );
}
