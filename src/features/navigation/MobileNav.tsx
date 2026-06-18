import { useEffect } from 'react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { useLocale } from '@/i18n/LocaleContext';
import { navLabel } from '@/i18n/translations';
import { LocaleSelector } from './LocaleSelector';
import { DrawerFooter } from './DrawerFooter';
import { navItemsData } from './navItems';

interface MobileNavBarProps {
  onOpenDrawer: () => void;
}

/** 行動版頂部列:Logo + 漢堡選單按鈕(對應 MobileNavigationbutton)。 */
export function MobileNavBar({ onOpenDrawer }: MobileNavBarProps) {
  const { t } = useLocale();
  return (
    <div className="sticky top-0 z-30 flex h-[52px] items-center bg-white px-5 shadow-nav">
      <span className="font-mono text-xl font-bold text-ink">{t.logo}</span>
      <button
        type="button"
        aria-label="開啟選單"
        onClick={onOpenDrawer}
        className="ml-auto p-2 text-ink-100"
      >
        <FaBars size={26} />
      </button>
    </div>
  );
}

interface AppDrawerProps {
  open: boolean;
  activeKey: string;
  onClose: () => void;
  onSelect: (key: string) => void;
}

/** 行動版側邊抽屜(對應 AppDrawer)。 */
export function AppDrawer({
  open,
  activeKey,
  onClose,
  onSelect,
}: AppDrawerProps) {
  const { t } = useLocale();

  // 開啟時鎖定背景捲動
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 抽屜本體 */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[280px] max-w-[80vw] flex-col bg-ink-100 p-6 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          aria-label="關閉選單"
          onClick={onClose}
          className="self-end text-white"
        >
          <FaXmark size={30} />
        </button>

        <nav className="mt-4 flex flex-1 flex-col">
          {navItemsData.map((item) => {
            const selected = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={`py-3 text-left text-base ${
                  selected
                    ? 'font-bold text-primary-200'
                    : 'font-normal text-white'
                }`}
              >
                {navLabel(t, item.key)}
              </button>
            );
          })}
          <div className="py-3">
            <LocaleSelector light />
          </div>
        </nav>

        <DrawerFooter />
      </aside>
    </>
  );
}
