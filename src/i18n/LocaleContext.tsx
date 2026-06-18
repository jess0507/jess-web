import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { translations, type LocaleCode, type Translation } from './translations';

interface LocaleState {
  locale: LocaleCode;
  t: Translation;
  setLocale: (code: LocaleCode) => void;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleState | null>(null);

/** 偵測初始語系:優先瀏覽器語言,zh 開頭視為中文,其餘為英文。 */
function detectLocale(): LocaleCode {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }
  return 'zh';
}

/** 管理 App 目前語系(對應 Flutter 的 localeProvider)。 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleCode>(detectLocale);

  const value = useMemo<LocaleState>(
    () => ({
      locale,
      t: translations[locale],
      setLocale,
      toggle: () => setLocale((prev) => (prev === 'zh' ? 'en' : 'zh')),
    }),
    [locale]
  );

  // 同步 <html lang>,利於 SEO 與無障礙
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh' ? 'zh-Hant' : 'en';
  }

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale 必須在 <LocaleProvider> 之內使用');
  return ctx;
}
