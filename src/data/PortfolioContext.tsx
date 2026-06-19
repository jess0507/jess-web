import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { loadPortfolioStatic } from './portfolioRepository';
import { emptyPortfolio, type PortfolioData } from './types';

interface PortfolioState {
  /** 已載入的資料;載入中或錯誤時為空狀態,供 UI 安全渲染。 */
  data: PortfolioData;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioState | null>(null);

/**
 * 持有 portfolio 顯示資料,掛載時從靜態 JSON 載入。
 * 對應 Flutter 的 portfolioProvider(AsyncNotifier)。
 */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(emptyPortfolio);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
