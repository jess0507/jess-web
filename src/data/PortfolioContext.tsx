import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { loadPortfolioStatic, loadPortfolioStaticSync } from './portfolioRepository';
import { type PortfolioData } from './types';

interface PortfolioState {
  /** 已載入的資料;載入中或錯誤時為空狀態,供 UI 安全渲染。 */
  data: PortfolioData;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioState | null>(null);

/**
 * 持有 portfolio 顯示資料。資料已內嵌於 bundle,故同步載入為初始值,
 * 讓首次渲染(含 build 時 SSR 預渲染)即有完整內容。
 * 對應 Flutter 的 portfolioProvider(AsyncNotifier)。
 */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(loadPortfolioStaticSync);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loadPortfolioStatic());
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioState {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio 必須在 <PortfolioProvider> 之內使用');
  }
  return ctx;
}
