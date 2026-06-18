import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { logEvent } from '@/services/analytics';
import { scrollToSection } from '@/lib/utils';
import { HomePage } from '@/features/home/HomePage';
import { VersionBadge } from '@/features/version/VersionBadge';
import { WebNavigationBar } from './WebNavigationBar';
import { MobileNavBar, AppDrawer } from './MobileNav';
import { navItemsData } from './navItems';

// build 時注入,對應 VersionService.getDisplayVersion 的 v{version}
const APP_VERSION = `v${__APP_VERSION__}`;

/**
 * 主框架:頂部導覽(RWD)+ 單頁捲動內容 + 版本標籤。
 * 對應 Flutter 的 ScaffoldWithNav。
 */
export function ScaffoldWithNav() {
  const isMobile = useIsMobile(950); // RefinedBreakpoints().desktopSmall
  const [activeKey, setActiveKey] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // scroll spy:依目前可視區塊更新導覽列選取狀態
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const item = navItemsData.find(
            (n) => n.sectionId === visible.target.id
          );
          if (item) setActiveKey(item.key);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    navItemsData.forEach((n) => {
      const el = document.getElementById(n.sectionId);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const onSelect = (key: string) => {
    const item = navItemsData.find((n) => n.key === key);
    if (!item) return;
    logEvent('navigation_clicked', { nav_item: key, nav_path: item.sectionId });
    setActiveKey(key);
    setDrawerOpen(false);
    scrollToSection(item.sectionId);
  };

  return (
    <div className="min-h-screen bg-surface">
      {isMobile ? (
        <>
          <MobileNavBar onOpenDrawer={() => setDrawerOpen(true)} />
          <AppDrawer
            open={drawerOpen}
            activeKey={activeKey}
            onClose={() => setDrawerOpen(false)}
            onSelect={onSelect}
          />
        </>
      ) : (
        <WebNavigationBar activeKey={activeKey} onSelect={onSelect} />
      )}

      <main>
        <HomePage />
      </main>

      <VersionBadge version={APP_VERSION} />
    </div>
  );
}
