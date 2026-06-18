import { useEffect, useState } from 'react';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { PortfolioProvider, usePortfolio } from '@/data/PortfolioContext';
import { ScaffoldWithNav } from '@/features/navigation/ScaffoldWithNav';
import { logEvent } from '@/services/analytics';
import { getDeviceInfo } from '@/services/deviceInfo';

/** App 內層:負責 app_opened 事件與資料載入失敗提示。 */
function AppShell() {
  const { error } = usePortfolio();
  const [toast, setToast] = useState<string | null>(null);

  // App Opened — 記錄裝置資訊(對應 logAppOpened)
  useEffect(() => {
    logEvent('app_opened', getDeviceInfo());
  }, []);

  // 載入失敗時顯示提示(對應 handlePortfolioState 的 SnackBar)
  useEffect(() => {
    if (!error) return;
    setToast('資料載入失敗,請稍後再試');
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [error]);

  return (
    <>
      <ScaffoldWithNav />
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-ink-100 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <PortfolioProvider>
        <AppShell />
      </PortfolioProvider>
    </LocaleProvider>
  );
}
