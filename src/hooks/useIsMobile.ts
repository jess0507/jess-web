import { useEffect, useState } from 'react';

/**
 * 視窗寬度是否小於指定斷點(對應 Flutter ResponsiveBuilder 的判斷)。
 * 預設斷點對齊 responsive_builder 的 RefinedBreakpoints:
 *   tabletSmall 600 / tabletLarge 850 / desktopSmall 950
 */
export function useIsMobile(breakpoint = 950): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}
